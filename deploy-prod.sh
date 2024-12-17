#!/bin/bash

# 배포용 스크립트
echo "Starting production deployment..."

# 기존 PM2 프로세스 삭제
echo "Deleting all existing PM2 processes..."
pm2 delete all


# 클라이언트 빌드
cd client
echo "Building React client for production..."
npm run build:prod

# PM2로 서버 실행
echo "Starting PM2 for production..."
cd ..
pm2 start ecosystem.config.js --only myApp-prod

echo "Production deployment complete."
