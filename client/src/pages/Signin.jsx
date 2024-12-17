import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import background from '../img/signin.png';
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdOutlineCheckBox } from "react-icons/md";
import kakao from '../img/kakao.png';
import axios from 'axios';

const REST_API_KEY = process.env.REACT_APP_API;
const REDIRECT_URI = process.env.REACT_APP_URI;
const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&prompt=login`;

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const Container = styled.div`
    margin: 0;
    padding: 0;
    background: url(${background}) no-repeat center center;
    width: 100%;
    height: 100vh;
    background-size: cover;
    opacity: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const SignWrapper = styled.div`
    margin: 0;
    padding: 0;
    border-radius: 5px;
    background: rgba(9, 9, 9, 0.5);
    width: calc(80%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(10px); 
    animation: ${fadeIn} 0.5s ease-in-out;
    @media screen and (min-width: 768px) {
        width: calc(30%);
    }
`;

const Title = styled.p`
    color: white;
    font: bold 30px 'arial';
    margin: 20px 0;
    padding: 0;
    margin-top: 40px;
    background: none;
`;

const Email = styled.input`
    width: calc(60%);
    height: 40px;
    border-radius: 5px;
    padding-left: 20px;
    border: 1px solid gray;
    margin: 20px 0;
    background: transparent;
    color: white;
    &:focus {
        outline: none; 
    }
`;

const Password = styled.input`
    width: calc(60%);
    height: 40px;
    border-radius: 5px;
    padding-left: 20px;
    border: 1px solid gray;
    margin: 0;
    margin-bottom: 20px;
    background: none;
    color: white;
    &:focus {
        outline: none; 
    }
`;

const LoginButton = styled.button`
    width: calc(65%);
    height: 40px;
    border-radius: 5px;  
    border: none;
    margin: 0;
    padding: 0;
    margin-top: 20px;
    font: bold 15px 'arial';
    color: white;
    background-color: red;
`;

const Store = styled.div`
    display: flex;
    width: calc(60%);
    justify-content: center;
    background: transparent;

    &:hover {
        cursor: pointer;
    }
`;

const Squre = styled(MdCheckBoxOutlineBlank)`
    color: white;
    margin: 0;
`;

const CheckSqure = styled(MdOutlineCheckBox)`
    color: white;
    margin: 0;
    padding: 0;
`;

const Wrapper = styled.div`
    display: flex;
    background: transparent;
`;

const P = styled.p`
    color: white;
    font: 500 13px 'arial';
    margin: 0;
    padding: 0;
    margin-top: 20px;
    background: transparent;
    &.storelogin {
        margin: 0;
        margin-left: 5px;
        padding-top: 1px;
    }
    &.signup {
        margin: 0;
        margin-top: 20px;
        font: 500 14px 'arial';
        color: #b8b7b7;
    }
    &.signup2 {
        margin: 20px 0px 40px 5px;
        &:hover {
            cursor: pointer;
        }
    }
`;

const KaKao = styled.img`
    background: transparent;
    margin-bottom: 40px;
`

const SignUpWrapper = styled(SignWrapper)`
    animation: ${fadeIn} 0.5s ease-in-out;
`;

const Sigin = () => {
    const [check, setcheck] = useState(false);
    const [signup, setsignup] = useState(true);
    const [term, setterm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const navigate = useNavigate(); 

    const termclick = () => {
        setterm(!term);
    };

    const checkclick = () => {
        setcheck(!check);
    };

    const signupclick = () => {
        setsignup(!signup);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        return regex.test(email);
    };

    const handleSignUp = () => {
        if (!validateEmail(email)) {
            alert("유효한 이메일 주소를 입력해 주세요.");
            return;
        }
        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!term) {
            alert("약관에 동의해 주세요.");
            return;
        }
        localStorage.setItem('username', email);
        localStorage.setItem('password', password);
        alert('회원가입 완료!');
        setsignup(!signup);
    };

    const handleLogin = () => {
        const storedEmail = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');

        if (loginEmail === storedEmail && loginPassword === storedPassword) {
            alert('로그인 성공!');
            navigate('/');
            if (check) {
                localStorage.setItem('loginEmail', loginEmail);
                localStorage.setItem('loginPassword', loginPassword);
            } else {
                localStorage.removeItem('loginEmail');
                localStorage.removeItem('loginPassword');
            }
        } else {
            alert('아이디 또는 비밀번호가 잘못되었습니다.');
        }
    };

    const handleKakaoLogin = () => {
        window.location.href = kakaoAuthURL;
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            fetchAccessToken(code);
        }
    }, []);

    const fetchAccessToken = async (code) => {
        try {
            const response = await axios.post(
                'https://kauth.kakao.com/oauth/token',
                new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: REST_API_KEY,
                    redirect_uri: REDIRECT_URI,
                    code: code,
                }).toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            const { access_token } = response.data;

            localStorage.setItem('token',access_token);

            axios.get("https://kapi.kakao.com/v2/user/me", {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                    },
                })
                .then((res) => {
                    console.log("사용자 정보:", res.data);
                    alert("카카오 로그인 성공!");
                    localStorage.setItem('username',res.data.properties.nickname);
                    localStorage.setItem('kakaoUser', JSON.stringify(res.data));
                    navigate('/');
                })
                .catch((err) => {
                    console.error("사용자 정보 요청 실패:", err);
                    alert("사용자 정보를 가져오는데 실패했습니다.");
                });
        } catch (error) {
            console.error("카카오 로그인 실패:", error);
            alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    };
    

    return (
        <Container>
            {signup ? (
                <SignWrapper>
                    <Title>로그인</Title>
                    <Email
                        placeholder='이메일을 입력해주세요'
                        type='email'
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                    />
                    <Password
                        placeholder='비밀번호를 입력해주세요'
                        type='password'
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <Store onClick={checkclick}>
                        {check ? <CheckSqure /> : <Squre />}
                        <P className="storelogin">로그인 정보 저장</P>
                    </Store>
                    <LoginButton onClick={handleLogin}>로그인</LoginButton>
                    <Wrapper>
                        <P className='signup'>회원이 아닌가요?</P>
                        <P className='signup2' onClick={signupclick}>지금 가입하세요</P>
                    </Wrapper>
                    <Wrapper>
                        <KaKao src={kakao} onClick={handleKakaoLogin}/>
                    </Wrapper>
                </SignWrapper>
            ) : (
                <SignUpWrapper>
                    <Title>회원가입</Title>
                    <Email
                        placeholder='이메일을 입력해주세요'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Password
                        placeholder='비밀번호를 입력해주세요'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Password
                        placeholder='비밀번호를 재입력해주세요'
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Store onClick={termclick}>
                        {term ? <CheckSqure /> : <Squre />}
                        <P className="storelogin">약관동의</P>
                    </Store>
                    <LoginButton onClick={handleSignUp}>회원가입</LoginButton>
                    <Wrapper>
                        <P className='signup'>이미 계정이 있으신가요?</P>
                        <P className='signup2' onClick={signupclick}>로그인</P>
                    </Wrapper>
                </SignUpWrapper>
            )}
        </Container>
    );
};

export default Sigin;
