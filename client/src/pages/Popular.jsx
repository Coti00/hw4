import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Header from "../components/Header";
import { FaTableCellsLarge, FaStar } from 'react-icons/fa6';
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import Loading from '../components/Loading';

const SectionWrapper = styled.div`
    width: 100%;
    height: ${(props) => (props.isInfinite ? '100%' : 'calc(100vh - 100px)')};
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;

const ViewSelector = styled.div`
    width: calc(80%);
    display: flex;
    justify-content: flex-end;
    margin: 0;
    padding-right: 70px;
`;

const TableButton = styled(FaTableCellsLarge)`
    background-color: #e13955;
    border: none;
    padding: 10px 15px;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    margin-right: 5px;
    cursor: pointer;
    &.active {
        background-color: gray;
        color: white;
    }
`;

const InfiniteButton = styled(MdKeyboardDoubleArrowDown)`
    background-color: #e13955;
    border: none;
    padding: 10px 15px;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    margin-left: 5px;
    cursor: pointer;
    &.active {
        background-color: gray;
        color: white;
    }
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80%;
    height: 100%;
    padding: 20px;
    overflow-y: auto; /* 내부 스크롤을 가능하게 함 */
`;

const TableViewContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    max-width: 100%;
    justify-content: center;
`;

const InfiniteViewContainer = styled(TableViewContainer)``;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: calc((100% / 5) - 10px);
    flex-shrink: 0;
    position: relative;

    @media (max-width: 768px) {
        width: calc((100% / 4) - 10px);
    }

    @media (max-width: 480px) {
        width: calc((100% / 2) - 10px);
    }
`;

const Poster = styled.img`
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        transform: scale(1.05);
        box-shadow: 0px 4px 8px #e9a6b1, 0px 6px 20px #ea8e9d;
    }
`;

const Title = styled.p`
    margin: 0;
    text-align: center;
    color: white;
    font: bold 14px 'arial';
    margin-top: 5px;
    max-height: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    width: 100%;
`;

const Star = styled(FaStar)`
    position: absolute;
    top: 10px;
    right: 10px;
    color: gold;
    font-size: 20px;
    background-color: transparent;
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
    display: none;
    font: bold 14px 'arial';
    &.visible {
        display: block;
    }
`;

const Popular = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [view, setView] = useState("table");
    const [showTopButton, setShowTopButton] = useState(false);
    const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem('wishlist')) || []);

    // TableView 전용 데이터 가져오기 함수
    useEffect(() => {
        const fetchAllMoviesForTable = async () => {
            setLoading(true);
            const password = process.env.REACT_APP_MOVIE;
            let allMovies = [];
    
            try {
                for (let page = 1; page <= 20; page++) {
                    const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`, {
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${password}`
                        }
                    });
                    const newMovies = response.data.results;
    
                    // 중복 제거 후 movies에 추가
                    newMovies.forEach((movie) => {
                        if (!allMovies.some(existingMovie => existingMovie.id === movie.id)) {
                            allMovies.push(movie);
                        }
                    });
                }
                setMovies(allMovies);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (view === "table") fetchAllMoviesForTable();
    }, [view]);

    // InfiniteView 전용 데이터 가져오기 함수
const fetchMoviesForInfiniteView = async (page) => {
        const password = process.env.REACT_APP_MOVIE;
        setLoading(true);
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`, {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${password}`
                }
            });
            setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    // InfiniteView에서만 스크롤이 하단에 닿을 때 추가 페이지 데이터 로드
    useEffect(() => {
        if (view === "infinite" && currentPage === 1) {
            fetchMoviesForInfiniteView(currentPage);
        }
    }, [currentPage, view]);


    // InfiniteView에서만 스크롤이 하단에 닿을 때 추가 페이지 데이터 로드
    useEffect(() => {
        if (view === "infinite" && currentPage > 1) {
            fetchMoviesForInfiniteView(currentPage);
        }
    }, [currentPage, view]);

    // InfiniteView에서만 스크롤 이벤트 설정
    useEffect(() => {
        const handleInfiniteScroll = () => {
            if (view === "infinite" && window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
                setCurrentPage((prevPage) => prevPage + 1);
            }
            setShowTopButton(window.scrollY > 300);
        };

        if (view === "infinite") {
            window.addEventListener("scroll", handleInfiniteScroll);
            return () => window.removeEventListener("scroll", handleInfiniteScroll);
        }
    }, [view, loading]);

    // 화면 크기에 따라 itemsPerPage 값 변경
    useEffect(() => {
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

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    const handleAddToWishlist = (movie) => {
        const isInWishlist = wishlist.some(wish => wish.id === movie.id);
        if (!isInWishlist) {
            const updatedWishlist = [...wishlist, movie];
            setWishlist(updatedWishlist);
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        } else {
            const updatedWishlist = wishlist.filter(wish => wish.id !== movie.id);
            setWishlist(updatedWishlist);
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        }
    };

    const isMovieInWishlist = (movie) => {
        return wishlist.some(wish => wish.id === movie.id);
    };

    const currentMovies = movies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(movies.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handleViewChange = (newView) => {
        if (newView !== view) {
            setView(newView);
            setCurrentPage(1);
            setMovies([]); // 새 뷰로 전환 시 목록 초기화
        }
    };

    const handleScroll = () => {
        if (view === "infinite" && window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
            handleNextPage();
        }
        setShowTopButton(window.scrollY > 300); // 300px 이상 스크롤 시 Top 버튼 표시
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentPage(1); // 스크롤 초기화
        setMovies([]); // 기존 데이터 초기화
        if (view === "infinite") {
            fetchMoviesForInfiniteView(1); // InfiniteView 첫 페이지 로드
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [view, currentPage]);

    return (
        <>
            <Header />
            <SectionWrapper isInfinite={view === "infinite"}>
                <ViewSelector>
                    <TableButton onClick={() => handleViewChange("table")} className={view === "table" ? "active" : ""} />
                    <InfiniteButton onClick={() => handleViewChange("infinite")} className={view === "infinite" ? "active" : ""}>Infinite Scroll</InfiniteButton>
                </ViewSelector>

                <ContentContainer>
                    {loading ? (
                        <Loading/>
                    ) : (
                        <>
                            {view === "table" ? (
                                <TableViewContainer>
                                    {currentMovies.map((movie) => (
                                        <Wrapper key={movie.id}>
                                            <Star style={{ display: isMovieInWishlist(movie) ? 'block' : 'none' }} />
                                            <Poster 
                                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                                alt={movie.title}
                                                onClick={() => handleAddToWishlist(movie)} // 위시리스트 추가/제거
                                            />
                                            <Title>{movie.title}</Title>
                                        </Wrapper>
                                    ))}
                                </TableViewContainer>
                            ) : (
                                <InfiniteViewContainer>
                                    {movies.map((movie) => (
                                        <Wrapper key={movie.id}>
                                            <Star style={{ display: isMovieInWishlist(movie) ? 'block' : 'none' }} />
                                            <Poster 
                                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                                alt={movie.title}
                                                onClick={() => handleAddToWishlist(movie)} // 위시리스트 추가/제거
                                            />
                                            <Title>{movie.title}</Title>
                                        </Wrapper>
                                    ))}
                                </InfiniteViewContainer>
                            )}
                        </>
                    )}
                    {view === "table" && (
                        <Pagination>
                            <Button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>이전</Button>
                            <PageInfo>{currentPage} / {totalPages}</PageInfo>
                            <Button onClick={handleNextPage} disabled={currentPage === totalPages}>다음</Button>
                        </Pagination>
                    )}
                </ContentContainer>

                {view === "infinite" && (
                    <TopButton className={showTopButton ? "visible" : ""} onClick={scrollToTop}>Top</TopButton>
                )}
            </SectionWrapper>
        </>
    );
};

export default Popular;