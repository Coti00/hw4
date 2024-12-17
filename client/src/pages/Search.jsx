import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import axios from "axios";
import { FaStar } from "react-icons/fa6";

const SectionWrapper = styled.div`
    width: 100%;
    margin: 50px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;

const TopButton = styled.button`
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #e13955;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    font: bold 14px 'arial';
    display: ${(props) => (props.visible ? "block" : "none")};
    &:hover {
        background-color: #d12945;
    }
`;

const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #e13955;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-top: 20px;

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

const FilterContainer = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    @media screen and (max-width: 768px) {
        width: 100%;
    }
`;

const FilterGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const FilterSelect = styled.select`
    padding: 10px;
    border-radius: 5px;
    border: none;
    margin-right: 10px;
    color: white;
    font: 500 14px 'arial';
`;

const ResetButton = styled.button`
    background-color: #e13955;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    font: bold 10px 'arial';
    &:hover {
        cursor: pointer;
        background-color: #d12945;
    }
    @media screen and (min-width: 768px) {
        font: bold 15px 'arial';
    }
`;

const InfiniteViewContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    max-width: 80%;
    justify-content: center;
    padding-bottom: 50px;
`;

const MovieCard = styled.div`
    width: calc(20% - 20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #3c3c3c;
    border-radius: 5px;
    padding: 10px;
    position: relative;
`;

const Poster = styled.img`
    width: 80%;
    height: calc(100% - 50px);
    border-radius: 5px;
    &:hover {
        transform: scale(1.05);
    }
`;

const Title = styled.p`
    color: white;
    text-align: center;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    font: bold 13px 'arial';
    background: transparent;
    @media screen and (max-width: 768px) {
        font: bold 15px 'arial';
    }
`;

const Star = styled(FaStar)`
    position: absolute;
    top: 10px;
    right: 10px;
    color: gold;
    font-size: 20px;
    cursor: pointer;
`;

const Content = styled.div`
    display: ${(props) => (props.visible ? "flex" : "none")};
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: black;
    background-color: white;
    border-radius: 5px;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    bottom: 0;
`;

const DetailButton = styled.button`
    background-color: #e13955;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    margin-top: 10px;
    width: 80%;
    font: bold 13px 'arial';
    z-index: 2;
    &:hover {
        background-color: #c82c45;
    }
    @media screen and (max-width: 768px) {
        font: bold 7px 'arial';
    }
`;

const P = styled.p`
    margin: 0;
    padding: 0;
    background: transparent;
    font: bold 13px 'arial';
    &.title {
        font: bold 18px 'arial';
        color: #c82c45;
        margin-bottom: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        @media screen and (max-width: 768px) {
            font: bold 10px 'arial';
            margin-bottom: 10px;
        }
    }
    &.vote {
        margin-bottom: 10px;
        @media screen and (max-width: 768px) {
            font: bold 7px 'arial';
        }
    }
    &.overview {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 7;
        margin-inline: 10px;
        margin-bottom: 50px;
        @media screen and (max-width: 768px) {
            -webkit-line-clamp: 4;
            font: bold 7px 'arial';
            margin-bottom: 20px;
        }
    }
`;

const Search = () => {
    const [movies, setMovies] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState("popularity.desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [wishlist, setWishlist] = useState([]);
    const [contentVisible, setContentVisible] = useState({});
    const [showTopButton, setShowTopButton] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchFilteredMovies = async () => {
        const password = process.env.REACT_APP_MOVIE;
        const options = {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${password}`
            }
        };

        try {
            setLoading(true);
            const genreFilter = selectedGenre !== "all" ? `&with_genres=${selectedGenre}` : "";
            const ratingFilter = minRating > 0 ? `&vote_average.gte=${minRating}` : "";
            const sortFilter = sortBy ? `&sort_by=${sortBy}` : "";
            
            const response = await axios.get(
                `https://api.themoviedb.org/3/discover/movie?language=ko-KR&page=${currentPage}${genreFilter}${ratingFilter}${sortFilter}`,
                options
            );

            if (currentPage === 1) {
                setMovies(response.data.results);
            } else {
                setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilteredMovies();
    }, [currentPage, selectedGenre, minRating, sortBy]);

    const loadMoreMovies = () => {
        if (!loading) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
            loadMoreMovies();
        }
        setShowTopButton(window.scrollY > 300);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentPage(1);
        setMovies([]);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleToggleWishlist = (movie) => {
        const isWished = wishlist.some(wish => wish.id === movie.id);
        const updatedWishlist = isWished
            ? wishlist.filter(wish => wish.id !== movie.id)
            : [...wishlist, movie];
        
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    };

    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlist(storedWishlist);
    }, []);

    const handleReset = () => {
        setSelectedGenre("all");
        setMinRating(0);
        setSortBy("popularity.desc");
        setCurrentPage(1);
    };

    const handleFilterChange = (filterFunction) => {
        filterFunction();
        setCurrentPage(1);
    };

    return (
        <>
            <Header />
            <SectionWrapper>
                <FilterContainer>
                    <FilterGroup>
                        <FilterSelect
                            value={selectedGenre}
                            onChange={(e) => handleFilterChange(() => setSelectedGenre(e.target.value))}
                        >
                            <option value="all">모든 장르</option>
                            <option value="28">액션</option>
                            <option value="878">SF</option>
                            <option value="12">모험</option>
                            <option value="16">애니메이션</option>
                            <option value="10751">가족영화</option>
                        </FilterSelect>

                        <FilterSelect
                            value={minRating}
                            onChange={(e) => handleFilterChange(() => setMinRating(e.target.value))}
                        >
                            <option value={0}>최소 평점</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                        </FilterSelect>

                        <FilterSelect
                            value={sortBy}
                            onChange={(e) => handleFilterChange(() => setSortBy(e.target.value))}
                        >
                            <option value="popularity.desc">인기순</option>
                            <option value="release_date.desc">최신순</option>
                        </FilterSelect>

                        <ResetButton onClick={handleReset}>초기화</ResetButton>
                    </FilterGroup>
                </FilterContainer>

                <InfiniteViewContainer>
                    {movies.map(movie => (
                        <MovieCard key={movie.id}>
                            <Poster 
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                alt={movie.title} 
                                onClick={() => handleToggleWishlist(movie)}
                            />
                            <Star 
                                onClick={() => handleToggleWishlist(movie)} 
                                style={{ display: wishlist.some(wish => wish.id === movie.id) ? 'block' : 'none' }}
                            />
                            <Title>{movie.title.length > 20 ? `${movie.title.substring(0, 20)}...` : movie.title}</Title>
                            <DetailButton onClick={() => setContentVisible(prev => ({ ...prev, [movie.id]: !prev[movie.id] }))}>
                                정보보기
                            </DetailButton>
                            <Content visible={contentVisible[movie.id]}>
                                <P className="title">{movie.title}</P>
                                <P className="vote">평점: {movie.vote_average} / 10</P>
                                <P className="overview">{movie.overview}</P>
                            </Content>
                        </MovieCard>
                    ))}
                </InfiniteViewContainer>

                {loading && <LoadingSpinner />}
                
                <TopButton onClick={scrollToTop} visible={showTopButton}>Top</TopButton>
            </SectionWrapper>
        </>
    );
};

export default Search;
