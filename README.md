# 카카오 소셜 로그인

## 📋 프로젝트 기본 정보

- **프로젝트명**: 카카오소셜로그인 연동
- **목적**: 카카오 소셜 로그인을 기반으로 인증
  
## 🛠 기술 스택

- **백엔드**: Node.js, Express
- **프런트엔드**: React
- **API**: TMDB API Key, KaKaoAPI
- **기타** : dotenv

## 🚀 설치 및 실행 가이드

프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요.

1. **레포지토리 클론**

    [git clone https://github.com/Coti00/homework3.git](https://github.com/Coti00/homework4.git)
3. **패키지 설치**
    리액트
    - cd client

    - npm i

    Nodejs
    - cd server

    - npm i
4. **환경 변수 설정**

    프로젝트 루트경로에 .env-dev(개발), .env-prod(배포)를 생성하고 각 환경에 맞게 아래 변수 설정

    - REACT_APP_API = 카카오API

    - REACT_APP_URI = 카카오 리다이렉션 uri

    - REACT_APP_MOVIE = TMDB API Key

    - IP_ADDRESS = ip주소

    - PORT = 포트번호
5. **서버 실행**
    sh파일 실행 권한 주기

    - chmod +x deploy-dev.sh

    - chmod +x deploy-prod.sh

    개발환경 실행(로컬에서 실행)
    - ./deploy-dev.sh

    배포환경 실행(서버에서 실행)
    - ./deploy-prod.sh


## 📂 프로젝트 주요구조 설명
```bash
homework4/
├── client # 리액트 코드
│   ├── build       
│   ├── public
│   └── src
├── server  # nodejs
│   └── app.js  
├── .gitignore   
├── .env-dev  
├── .env-prod              
├── deploy-prod.sh
├── deploy-dev.sh
├── ecosystem.config.js # pm2 개발-배포 환경에 따라 백그라운드에서 구동되도록 설정          
└── README.md                    
```

## 📝 참고 사항
이 프로젝트는 교육 목적으로 만들어졌으며 상업적 용도로 사용되지 않습니다.

