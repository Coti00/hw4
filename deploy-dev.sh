#!/bin/bash

# 개발용 배포 스크립트
echo "Starting development deployment..."

# 클라이언트 빌드
cd client
echo "Building React client for development..."
npm run build:dev

# 서버 시작
cd ../server
echo "Starting server in development mode..."
npm run start:dev

echo "Development deployment complete."
