import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import TableView from "../components/TableView";

const SectionWrapper = styled.div`
    width: 100%;
    height: calc(100vh - 100px);
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80%;
    height: 100%;
    padding: 20px;
    overflow-y: hidden;
`;

const SearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
`;

const SearchInputWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const SearchInput = styled.input`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #e13955;
    font: 500 14px 'arial';
    color: white;
    width: 300px;
`;

const SearchButton = styled.button`
    padding: 10px 15px;
    background-color: #e13955;
    color: white;
    border: none;
    border-radius: 5px;
    font: bold 10px 'arial';
    cursor: pointer;
    &:hover {
        background-color: #d12945;
    }
`;

const RecentSearches = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

const RecentSearchItem = styled.div`
    display: flex;
    align-items: center;
    background-color: #3c3c3c;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
`;

const RemoveButton = styled.button`
    background: none;
    border: none;
    color: #e13955;
    margin-left: 5px;
    cursor: pointer;
    font-size: 14px;
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
`;

const Button = styled.button`
    background-color: #e13955;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 5px;

    &:disabled {
        background-color: gray;
        cursor: not-allowed;
    }
`;

const PageInfo = styled.span`
    color: white;
    margin: 0 10px;
`;

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(storedWishlist);
        setFilteredMovies(storedWishlist);

        const storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
        setRecentSearches(storedSearches.slice(0, 3));

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);
        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredMovies(wishlist);
        }
    }, [searchTerm, wishlist]);

    const updateItemsPerPage = () => {
        const width = window.innerWidth;
        if (width > 768) {
            setItemsPerPage(10);
        } else if (width > 650) {
            setItemsPerPage(12);
        } else {
            setItemsPerPage(16);
        }
    };

    const handleRemoveFromWishlist = (movieId) => {
        const updatedWishlist = wishlist.filter((movie) => movie.id !== movieId);
        setWishlist(updatedWishlist);
        setFilteredMovies(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    };

    const handleSearch = () => {
        const filtered = wishlist.filter((movie) =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
        setCurrentPage(1);

        if (searchTerm && !recentSearches.includes(searchTerm)) {
            const updatedSearches = [searchTerm, ...recentSearches.slice(0, 2)];
            setRecentSearches(updatedSearches);
            localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
        }
    };

    const handleRecentSearchClick = (term) => {
        setSearchTerm(term);
        handleSearch();
    };

    const handleRemoveRecentSearch = (term) => {
        const updatedSearches = recentSearches.filter((item) => item !== term);
        setRecentSearches(updatedSearches);
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    };

    const currentMovies = filteredMovies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <>
            <Header />
            <SectionWrapper>
                <ContentContainer>
                    <SearchContainer>
                        <SearchInputWrapper>
                            <SearchInput
                                type="text"
                                placeholder="영화 제목 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <SearchButton onClick={handleSearch}>검색</SearchButton>
                        </SearchInputWrapper>
                        <RecentSearches>
                            {recentSearches.map((term, index) => (
                                <RecentSearchItem key={index} onClick={() => handleRecentSearchClick(term)}>
                                    {term}
                                    <RemoveButton onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveRecentSearch(term);
                                    }}>X</RemoveButton>
                                </RecentSearchItem>
                            ))}
                        </RecentSearches>
                    </SearchContainer>
                    <TableView movies={currentMovies} onRemoveFromWishlist={handleRemoveFromWishlist} />
                    <Pagination>
                        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>이전</Button>
                        <PageInfo>{currentPage} / {totalPages}</PageInfo>
                        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>다음</Button>
                    </Pagination>
                </ContentContainer>
            </SectionWrapper>
        </>
    );
};

export default Wishlist;
