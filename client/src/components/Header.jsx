import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { GrLogout } from "react-icons/gr";
import { BiSolidCameraMovie } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import Menu from './Menu';
import './Header.css';
import { CSSTransition } from 'react-transition-group';

const MenuWrapper = styled.div`
    height: 50px;
    width: 100%;
    display: flex;
    margin: 0;
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: #2f2d2d;
    align-items: center;
    justify-content: space-between;
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    &:hover{
        cursor: pointer;
    }
`;

const IconName = styled.p`
    margin: 0;
    padding: 0;
    font: bold 30px 'arial';
    color: white;
    margin-left: 10px;
`;

const MovieIcon = styled(BiSolidCameraMovie)`
    color: #e13955;
    width: 30px;
    height: 30px;
    margin: 0;
    padding: 0;
    margin-left: 20px;
`;

const Menulist = styled.div`
    display: flex;
    align-items: center;
    height: 50px;
    @media screen and (max-width: 768px) {
        display: none; /* 768px 이하에서는 숨김 */
    }
`;

const Menuitem = styled.div`
    font: bold 15px 'arial';
    text-align: center;
    margin: 0 30px;
    border-bottom: 2px solid transparent;
    color: white;
    &:hover {
        cursor: pointer;
        color: #e13955;
        border-bottom: 2px solid #e13955;
    }
`;

const LogoutWrapper = styled.div`
    margin: 0 20px;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    &:hover {
        cursor: pointer;
        color: #e13955;
    }
`;

const LogoutIcon = styled(GrLogout)`
    margin: 0;
    padding: 0;
`;

const Logout = styled.p`
    font: bold 11px 'arial';
    margin: 0;
    padding: 0;
`;

const Username = styled.p`
    color: #e13955;
    margin-left: 20px;
    font: bold 15px 'arial';
    display: flex;
`;

const Hamburger = styled(GiHamburgerMenu)`
    color: white;
    width: 30px;
    height: 30px;
    margin-right: 20px;
    cursor: pointer;
    @media screen and (min-width: 768px) {
        display: none; /* 768px 이상에서는 숨김 */
    }
`;

const Header = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const [menu, setMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // 현재 화면 크기 상태 추가

    const home = useNavigate();
    const clickhome = () => {
        home('/');
    }

    const popular = useNavigate();
    const clickpopular = () => {
        popular('/popular');
    }

    const search = useNavigate();
    const clicksearch = () => {
        search('/search');
    }

    const wishlist = useNavigate();
    const clickwishlist = () => {
        wishlist('/wishlist');
    }
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            const name = storedUsername.split('@')[0];
            setUsername(name);
        }
        
        // 화면 크기 변화 감지
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setMenu(false); // 768px 이상일 때 메뉴 닫기
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLogout = () => {
        setUsername('');
        navigate('/signin'); // 로그아웃 후 /signin으로 이동
    };

    const menuclick = () => {
        setMenu(!menu);
    };

    const closeMenu = () => {
        setMenu(false); // 메뉴 닫기
    };

    return (
        <CSSTransition in={true} appear ={true} timeout = {300} classNames="header">
            <MenuWrapper>
                <IconWrapper onClick={clickhome}>
                    <MovieIcon />
                    <IconName>Dongflix</IconName>
                </IconWrapper>
                <Menulist> {/* 메뉴 상태에 따라 표시 */}
                    <Menuitem onClick={clickhome}>홈</Menuitem>
                    <Menuitem onClick={clickpopular}>대세 콘텐츠</Menuitem>
                    <Menuitem onClick={clicksearch}>찾아보기</Menuitem>
                    <Menuitem onClick = {clickwishlist}>내가 찜한 리스트</Menuitem>
                    <Username>
                        {username ? `${username}` : '로그인 해주세요'}
                        <p style={{ margin: '0', padding: '0', fontSize: '10px', paddingTop: '5px', marginLeft: '3px', color: 'white' }}>
                            님 환영합니다!
                        </p>
                    </Username>
                    <LogoutWrapper onClick={handleLogout}>
                        <LogoutIcon />
                        <Logout>로그아웃</Logout>
                    </LogoutWrapper>
                </Menulist>
                <Hamburger onClick={menuclick} />
                {/* 메뉴가 열려있고 화면이 768px 이하인 경우에만 Menu 표시 */}
                {menu && isMobile ? <Menu handleLogout={handleLogout} username={username} onClose={closeMenu} /> : null}
            </MenuWrapper>
        </CSSTransition>
    );
};

export default Header;
