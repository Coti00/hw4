import React from "react";
import styled from "styled-components";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';

const MenuWrapper = styled.div`
    position: absolute;
    width: calc(50%);
    height: auto;
    background-color: #2f2d2d;
    z-index: 999;
    right: 0;
    top: 10px;
    border-radius: 5px;
`;

const Menulist = styled.div`
    display: flex;
    flex-direction: column; /* 수직 정렬 */
    align-items: center;
    margin: 50px 0 20px 0;
    padding: 0;
`;

const Menuitem = styled.div`
    font: bold 13px 'arial';
    text-align: center;
    margin: 15px 0; /* 간격 조정 */
    border-bottom: 2px solid transparent;
    color: white;
    &:hover {
        cursor: pointer;
        color: #e13955;
        border-bottom: 2px solid #e13955;
    }
`;

const Username = styled.p`
    color: #e13955;
    font: bold 15px 'arial';
    display: flex;
    margin: 15px 0; /* 간격 조정 */
`;

const Off = styled(VscChromeClose)`
    color: white;
    float: right;
    margin: 0;
    padding: 0;
    margin-right: 20px;
    width: 30px;
    height: 30px;
    cursor: pointer; /* 커서 스타일 추가 */
`

const Menu = ({ handleLogout, username, onClose }) => { // onClose prop 추가
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
    return (
        <MenuWrapper>
            <Off onClick={onClose} /> {/* Off 버튼 클릭 시 Menu 닫기 */}
            <Menulist>
                <Username>{username ? `${username}` : '로그인 해주세요'}
                    <p style={{ margin: '0', padding: '0', fontSize: '10px', paddingTop: '5px', marginLeft: '3px', color: 'white' }}>
                        님 환영합니다!
                    </p>
                </Username>
                <Menuitem onClick={clickhome}>홈</Menuitem>
                <Menuitem onClick={clickpopular}>대세 콘텐츠</Menuitem>
                <Menuitem onClick={clicksearch}>찾아보기</Menuitem>
                <Menuitem onClick={clickwishlist}>내가 찜한 리스트</Menuitem>
                <Menuitem onClick={handleLogout}>로그아웃</Menuitem>
            </Menulist>
        </MenuWrapper>
    );
};

export default Menu;
