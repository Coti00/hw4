// TableView.js
import React from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa6';

const TableViewContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    max-width: 100%;
    justify-content: center;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: calc((100% / 5) - 10px); /* 기본 5개의 열에 맞춰 자동 조정 */
    flex-shrink: 0;
    position: relative;

    @media (max-width: 768px) {
        width: calc((100% / 4) - 10px); /* 768px 이하에서는 4개의 열로 변경 */
    }

    @media (max-width: 480px) {
        width: calc((100% / 2) - 10px); /* 480px 이하에서는 2개의 열로 변경 */
    }
`;

const Poster = styled.img`
    width: 100%;
    aspect-ratio: 1; /* 가로 세로 비율 1:1 */
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

const TableView = ({ movies, onRemoveFromWishlist }) => {
    return (
        <TableViewContainer>
            {movies.map((movie) => (
                <Wrapper key={movie.id}>
                    <Star />
                    <Poster 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                        alt={movie.title} 
                        onClick={() => onRemoveFromWishlist(movie.id)} // 이미지 클릭 시 제거 함수 호출
                    />
                    <Title>{movie.title}</Title>
                </Wrapper>
            ))}
        </TableViewContainer>
    );
};

export default TableView;
