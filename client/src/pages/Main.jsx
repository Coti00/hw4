// Main.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import axios from 'axios';
import MainSection from "../components/MainSection"; // MainSection 임포트
import MainHeader from "../components/MainHeader";
import Loading from "../components/Loading";

const Container = styled.div`
    width: calc(100%);
    margin: 0;
    padding: 0;
    height: auto;
    background-color: #2f2d2d;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 80px;
`;

const Main = () => {
    const [movies, setMovies] = useState([[], [], [], []]); // 4개의 API에 대해 각각의 영화 데이터를 저장할 상태
    const [loading, setLoading] = useState(true); // 로딩 상태 관리

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
                const upcomingResponse = await axios.get('https://api.themoviedb.org/3/movie/upcoming?language=ko-KR&page=1', options);
                const topRatedResponse = await axios.get('https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1', options);
                const nowPlayingResponse = await axios.get('https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1', options);

                setMovies([
                    popularResponse.data.results,
                    nowPlayingResponse.data.results, // '현재 상영 영화'는 이제 두 번째로 변경
                    topRatedResponse.data.results,
                    upcomingResponse.data.results // '최고 평점 영화'는 이제 세 번째로 변경
                ]); // 각각의 API 응답을 상태에 저장
                setLoading(false); // 로딩 완료
            } catch (err) {
                console.error(err);
                alert('API를 불러오지 못했습니다');
                setLoading(false); // 에러 발생 시에도 로딩 완료
            }
        };

        fetchMovies();
    }, []); // 컴포넌트가 처음 렌더링될 때만 호출

    if (loading) {
        return <Loading/>; // 로딩 중일 때 표시할 메시지
    }

    return (
        <>
            <Header />
            <Container>
                <MainHeader movies={movies[3]} /> {/* 네 번째 API: 개봉 예정 영화 */}
                <MainSection title="인기 영화" movies={movies[0]} /> {/* 첫 번째 API: 인기 영화 */}
                <MainSection title="현재 상영 영화" movies={movies[1]} /> {/* 두 번째 API: 현재 상영 영화 */}
                <MainSection title="최고 평점 영화" movies={movies[2]} /> {/* 세 번째 API: 최고 평점 영화 */}
            </Container>
        </>
    );
};

export default Main;
