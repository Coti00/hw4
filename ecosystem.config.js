module.exports = {
  apps: [
    {
      name: "myApp-dev", // 개발 환경
      script: "app.js", // 실행할 스크립트 파일
      cwd: "./server", // 작업 디렉토리를 server로 설정
      watch: true, // 코드 변경 시 자동 재시작
      env: {
        NODE_ENV: "development", // 개발 환경 설정
      },
    },
    {
      name: "myApp-prod", // 배포 환경
      script: "app.js", // 실행할 스크립트 파일
      cwd: "./server", // 작업 디렉토리를 server로 설정
      watch: false, // 배포 환경에서는 watch 비활성화
      env: {
        NODE_ENV: "production", // 배포 환경 설정
      },
    },
  ],
};
