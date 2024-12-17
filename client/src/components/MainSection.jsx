// MainSection.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

const SectionWrapper = styled.div`
    width: calc(70%);
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
    margin-bottom: 20px;
    @media screen and (min-width: 768px) {
        width: calc(80%);
    }
`;

const Title = styled.p`
    font: bold 30px 'arial';
    color: white;
    margin: 0;
    padding: 0;
    text-align: center;
    margin-bottom: 10px;
    background-color: transparent;
    &.movieTitle {
        color: #e13955;
    }
`;

const ContentWrapper = styled.div`
    width: 200px;
    height: 300px; /* 고정 높이 설정 */
    position: relative; /* 자식 요소의 절대 위치에 대한 기준 설정 */
    overflow: hidden; /* 오버플로우 숨기기 */
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    &:hover {
        transform: scale(1.05); /* hover 시 이미지 크기 증가 */
        box-shadow: 0px 4px 8px #e9a6b1, 0px 6px 20px #ea8e9d;
    }
    @media screen and (min-width: 768px) {
        margin: 0 10px;
    }
`;

const Img = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 5px;
    margin: 0;
    padding: 0;
    position: absolute; /* 절대 위치로 설정 */
    transition: transform 0.3s ease; /* 부드러운 효과를 위한 transition */
`;

const Content = styled.div`
    display: none; /* 기본적으로 숨김 */
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: black; /* 글자 색을 검은색으로 변경 */
    background-color: white; /* 흰색 배경 */
    border-radius: 5px; /* 모서리 둥글게 */
    position: absolute; /* 절대 위치로 설정 */
    width: 100%; /* Content의 너비를 이미지에 맞춤 */
    height: 350px; /* 자동 높이 */
    z-index: 1; /* 이미지 위에 나타나도록 z-index 설정 */
    bottom: 0; /* 하단에 배치 */
`;

const P = styled.p`
    margin:0;
    padding: 0;
    background-color: transparent;
    &.title{
        font: bold 17px 'arial';
        color: #e13955;
        margin-top: 40px;
    }
    &.overview {
        margin: 15px 5px 10px 5px;
        font: 500 12px 'arial';
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 7;
    }
    &.vote {
        margin-top: 5px;
        font: 400 11px 'arial';
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%; /* 버튼을 전체 너비로 설정 */
    margin: 0;
    padding: 0;
    position: relative; /* 자식 요소의 절대 위치에 대한 기준 설정 */
`;

const LeftButton = styled(FaChevronLeft)`
    width: 20px;
    height: 20px;
    padding: 20px 10px;
    background-color: black;
    border-radius: 5px;
    opacity: 1;
    color: #e13955;
    &:hover {
        cursor: pointer;
        opacity: 30%;
    }
`;

const RightButton = styled(FaChevronRight)`
    width: 20px;
    height: 20px;
    padding: 20px 10px;
    border-radius: 5px;
    background-color: black;
    opacity: 1;
    color: #e13955;
    &:hover {
        cursor: pointer;
        opacity: 30%;
    }
`;

const DetailButton = styled.button`
    background-color: #e13955;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    margin-top: 10px;
    width: calc(40%);
    height: 30px;
    font: bold 13px 'arial';
    z-index: 30;
    &:hover {
        background-color: #c82c45;
    }
    @media screen and (min-width: 768px) {
        width: calc(30%);
    }
`;

const Star = styled(FaStar)`
    position: absolute;
    top: 10px;
    right: 10px;
    color: gold;
    font-size: 20px;
    background-color: transparent;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;   
`;

const MovieWrapper = styled.div`
    display: flex;
    width: calc(100%);
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: visible;
    padding: 20px 0;
    justify-content: center;
`

const MainSection = ({ movies, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [contentVisible, setContentVisible] = useState(Array(movies.length).fill(false));
    const [itemsToShow, setItemsToShow] = useState(5); // 표시할 항목 수 설정
    const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem('wishlist')) || []);

    useEffect(() => {
        const updateItemsToShow = () => {
            const width = window.innerWidth;
            if (width >= 1200) setItemsToShow(4);
            else if (width >= 992) setItemsToShow(3);
            else if (width >= 903) setItemsToShow(2);
            else if (width <= 840) setItemsToShow(1);
        };

        window.addEventListener("resize", updateItemsToShow);
        updateItemsToShow();

        const autoSlide = setInterval(() => {
            handleNext();
        }, 10000);

        return () => {
            window.removeEventListener("resize", updateItemsToShow);
            clearInterval(autoSlide);
        };
    }, []);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + itemsToShow;
            return nextIndex >= movies.length ? 0 : nextIndex;
        });
        setContentVisible(Array(movies.length).fill(false));
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex - itemsToShow;
            return nextIndex < 0 ? Math.max(0, movies.length - itemsToShow) : nextIndex;
        });
        setContentVisible(Array(movies.length).fill(false));
    };

    const handleDetailClick = (index) => {
        setContentVisible((prevVisible) => {
            const newVisible = [...prevVisible];
            newVisible[index] = !newVisible[index];
            return newVisible;
        });
    };

    const handleAddToWishlist = (movie) => {
        const movieExists = wishlist.find(item => item.id === movie.id);
        if (!movieExists) {
            const updatedWishlist = [...wishlist, movie];
            setWishlist(updatedWishlist);
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        } else {
            const updatedWishlist = wishlist.filter(item => item.id !== movie.id);
            setWishlist(updatedWishlist);
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        }
    };

    const renderMovies = () => {
        const moviesToShow = movies.slice(currentIndex, currentIndex + itemsToShow);
        return moviesToShow.map((movie, index) => (
            <Wrapper key={index}>
                <ContentWrapper onClick={() => handleAddToWishlist(movie)}>
                    <Img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                        alt={movie.title} 
                    />
                    {wishlist.some(item => item.id === movie.id) && <Star />}
                    <Content style={{ display: contentVisible[currentIndex + index] ? 'flex' : 'none' }}>
                        <P className="title">{movie.title}</P>
                        <P className="overview">{movie.overview}</P>
                        <P className="vote">평점: {movie.vote_average} / 10</P>
                    </Content>
                </ContentWrapper>
                <DetailButton onClick={(e) => {
                    e.stopPropagation();
                    handleDetailClick(currentIndex + index);
                }}>
                    정보보기
                </DetailButton>
            </Wrapper>
        ));
    };

    return (
        <SectionWrapper>
            <Title>{title}</Title>
            <ButtonWrapper>
                <LeftButton onClick={handlePrev} />
                <MovieWrapper>
                    {renderMovies()}
                </MovieWrapper>
                <RightButton onClick={handleNext} />
            </ButtonWrapper>
        </SectionWrapper>
    );
};

export default MainSection;
