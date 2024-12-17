import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Loading from './Loading';

const SectionWrapper = styled.div`
    width: calc(95%);
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
`;

const Button = styled.div`
    width: 150px;
    height: 40px;
    margin: 5px 0;
    border-radius: 5px;
    background: #e13955;
    font: bold 14px 'arial';
    text-align: center;
    line-height: 40px;
    color: white;
    &.info {
        bottom: 55%;
        background: gray;
        margin-top: 10px;
    }
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 40px;
    padding: 0;
    width: 100%;
    height: 300px;
    position: relative;
    background-color: transparent;
    background-image: url(${(props) => props.bgImage}); /* 배경 이미지 설정 */
    background-size: cover; /* 이미지가 요소를 가득 채우도록 설정 */
    background-position: center; /* 이미지 중심에 배치 */
    @media screen and (min-width: 768px) {
        height: 400px;
    }
`;

const Title = styled.p`
    color: white;
    margin: 0;
    font: bold 30px 'arial';
    background-color: transparent;
    @media screen and (min-width: 768px) {
        font-size: 50px;
    }
`;

const Info = styled.p`
    margin: 20px 0;
    color: white;
    font: bold 14px 'arial';
    background-color: transparent;
    max-height: 80px; /* 최대 높이 설정 */
    overflow: hidden; /* 넘치는 내용 숨기기 */
    text-overflow: ellipsis; /* 넘치는 텍스트에 줄임표 표시 */
    display: -webkit-box; /* 웹킷 박스 모델 사용 */
    -webkit-box-orient: vertical; /* 수직 방향 박스 정렬 */
    -webkit-line-clamp: 4; /* 최대 4줄 표시 */
    @media screen and (min-width: 768px) {
        font-size: 17px;
    }
`;

const ContentWrapper = styled.div`
    margin: 0;
    padding: 0;
    background: none;
    width: calc(80%);
    height: auto;
    position: absolute;
    bottom: 20px;
    left: 20px;
    @media screen and (min-width: 768px) {
        width: calc(50%);
    }
`;

const MainHeader = () => {
    const [movies, setMovies] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);

    useEffect(() => {
        const password = process.env.REACT_APP_MOVIE; // localStorage에서 비밀번호 가져오기
        const options = {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${password}` // localStorage의 비밀번호로 인증
            }
        };

        const fetchMovies = async () => {
            try {
                const popularResponse = await axios.get('https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1', options);
                const movieData = popularResponse.data.results; // 인기 영화 목록 가져오기
                setMovies(movieData); // 영화 목록 저장
                setLoading(false); // 로딩 완료
            } catch (err) {
                console.error(err);
                setLoading(false); // 에러 발생 시에도 로딩 완료
            }
        };

        fetchMovies();
    }, []);

    useEffect(() => {
        if (movies.length > 0) {
            const fetchImages = async (id) => {
                const password = process.env.REACT_APP_MOVIE; // localStorage에서 비밀번호 가져오기
                const options = {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${password}` // localStorage의 비밀번호로 인증
                    }
                };

                try {
                    const imageResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/images`, options);
                    setImages(imageResponse.data.backdrops); // backdrops 배열을 상태에 저장
                } catch (err) {
                    console.error(err);
                }
            };

            fetchImages(movies[selectedMovieIndex].id);
        }
    }, [movies, selectedMovieIndex]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedMovieIndex((prevIndex) => (prevIndex + 1) % movies.length); // 5초마다 인덱스 업데이트
        }, 50000);

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
    }, [movies]);

    if (loading) {
        return <Loading />; // 데이터를 가져오는 동안 로딩 메시지 표시
    }

    const selectedMovie = movies[selectedMovieIndex];
    const backgroundImage = `https://image.tmdb.org/t/p/w500${images[0]?.file_path}` ;

    return (
        <SectionWrapper>
            <Wrapper bgImage={backgroundImage}>
                <ContentWrapper>
                    <Title>{selectedMovie.title}</Title>
                    <Info>{selectedMovie.overview}</Info>
                    <Button>재생</Button>
                </ContentWrapper>
            </Wrapper>
        </SectionWrapper>
    );
};

export default MainHeader;
