const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(cors());

const envFile = process.env.NODE_ENV === 'production' ? '.env-prod' : '.env-dev';
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

app.use(express.json());

app.post('/kakaoLogin', async (req, res) => {
    const { code } = req.body;
    const REST_API_KEY = process.env.REACT_APP_API;
    const REDIRECT_URI = process.env.REACT_APP_URI;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is missing' });
    }

    try {
        const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: REST_API_KEY,
                redirect_uri: REDIRECT_URI,
                code,
            },
        });

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        res.json({ accessToken, user: userResponse.data });
    } catch (error) {
        console.error('카카오 로그인 실패:', error.response?.data || error.message);
        if (error.response) {
            // 카카오 API 응답에 의한 오류
            res.status(error.response.status).json({
                error: 'Kakao API Error',
                details: error.response.data,
            });
        } else if (error.request) {
            // 네트워크 오류
            res.status(503).json({
                error: 'Network Error',
                message: '카카오 API 서버에 연결할 수 없습니다.',
            });
        } else {
            // 기타 오류
            res.status(500).json({
                error: 'Server Error',
                message: '서버 내부 오류가 발생했습니다.',
            });
        }
    }
});



// React 정적 파일 제공
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// React로 모든 요청 처리
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'client', 'build', 'index.html'), (err) => {
        if (err) {
            res.status(500).send(err);
            console.log("error");
        }
    });
});

console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Loaded PORT: ${process.env.PORT}`);


// 서버 실행
const PORT = process.env.PORT || 3000;
const URI = process.env.IP_ADDRESS
app.listen(PORT, () => console.log(`Server is running on http://${URI}:${PORT}`));
