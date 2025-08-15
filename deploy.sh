#!/bin/bash

# Firebase 배포 자동화 스크립트
# AI 개인맞춤 동화책 생성 플랫폼

set -e  # 에러 발생 시 스크립트 중단

echo "🚀 Firebase 배포를 시작합니다..."
echo "=================================================="

# 프로젝트 정보 확인
echo "📋 프로젝트 정보:"
echo "- 플랫폼: AI 개인맞춤 동화책 생성"
echo "- 리전: 서울 (asia-northeast3)"
echo "- 서비스: Hosting + Functions + Firestore"
echo ""

# 필수 파일 확인
echo "🔍 필수 파일 확인 중..."
if [ ! -f "firebase.json" ]; then
    echo "❌ firebase.json 파일이 없습니다!"
    exit 1
fi

if [ ! -f ".firebaserc" ]; then
    echo "❌ .firebaserc 파일이 없습니다!"
    exit 1
fi

if [ ! -f "functions/src/index.ts" ]; then
    echo "❌ functions/src/index.ts 파일이 없습니다!"
    exit 1
fi

echo "✅ 모든 필수 파일이 확인되었습니다."
echo ""

# Firebase CLI 설치 확인
echo "🔧 Firebase CLI 확인 중..."
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI가 설치되어 있지 않습니다. 설치 중..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI가 설치되어 있습니다."
fi

# Node.js 및 npm 버전 확인
echo "📦 Node.js 환경 확인..."
echo "Node.js 버전: $(node --version)"
echo "npm 버전: $(npm --version)"
echo ""

# Firebase 로그인 확인
echo "🔑 Firebase 인증 확인 중..."
if ! firebase projects:list &> /dev/null; then
    echo "Firebase 로그인이 필요합니다..."
    firebase login
else
    echo "✅ Firebase에 로그인되어 있습니다."
fi

# 프로젝트 ID 설정 확인
echo "🎯 Firebase 프로젝트 설정 확인..."
PROJECT_ID=$(grep -o '"default": "[^"]*"' .firebaserc | cut -d'"' -f4)

if [ "$PROJECT_ID" = "your-project-id" ]; then
    echo "⚠️  프로젝트 ID가 설정되어 있지 않습니다."
    echo "Firebase Console에서 프로젝트를 생성하고 아래 명령어로 설정하세요:"
    echo ""
    echo "firebase use --add"
    echo ""
    echo "또는 .firebaserc 파일을 직접 수정하세요."
    exit 1
fi

echo "✅ 프로젝트 ID: $PROJECT_ID"
echo ""

# 환경변수 설정 확인
echo "🔐 환경변수 설정 확인..."
if [ ! -f "functions/.env" ]; then
    if [ -f "functions/.env.example" ]; then
        echo "⚠️  functions/.env 파일이 없습니다."
        echo "functions/.env.example 파일을 참고하여 환경변수를 설정해주세요:"
        echo ""
        echo "cd functions && cp .env.example .env"
        echo ""
        echo "그다음 .env 파일에 실제 API 키를 입력하세요."
        exit 1
    else
        echo "⚠️  환경변수 설정 파일이 없습니다."
        echo "Firebase Functions에서 환경변수를 직접 설정해야 합니다:"
        echo ""
        echo "firebase functions:config:set google.api_key=YOUR_API_KEY"
        echo ""
    fi
else
    echo "✅ 환경변수 파일이 설정되어 있습니다."
fi

# 의존성 설치
echo "📥 의존성 설치 중..."
echo "루트 프로젝트 의존성 설치..."
npm install

echo "Functions 의존성 설치..."
cd functions
npm install
cd ..

echo "✅ 모든 의존성이 설치되었습니다."
echo ""

# 클라이언트 빌드
echo "🏗️  클라이언트 빌드 중..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 클라이언트 빌드에 실패했습니다!"
    exit 1
fi

echo "✅ 클라이언트 빌드가 완료되었습니다."
echo ""

# Functions 빌드
echo "⚙️  Functions 빌드 중..."
npm run functions:build

if [ $? -ne 0 ]; then
    echo "❌ Functions 빌드에 실패했습니다!"
    exit 1
fi

echo "✅ Functions 빌드가 완료되었습니다."
echo ""

# 배포 전 최종 확인
echo "🚀 배포 준비 완료!"
echo "=================================================="
echo "배포 내용:"
echo "- Firebase Hosting (정적 파일)"
echo "- Firebase Functions (API 서버)"
echo "- Firestore 규칙 및 인덱스"
echo ""
echo "배포를 진행하시겠습니까? (y/N)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🚀 배포를 시작합니다..."
    
    # Firebase 배포 실행
    firebase deploy
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 배포가 성공적으로 완료되었습니다!"
        echo "=================================================="
        echo "웹사이트 URL: https://$PROJECT_ID.web.app"
        echo "Functions URL: https://asia-northeast3-$PROJECT_ID.cloudfunctions.net/api"
        echo ""
        echo "🔧 추가 설정이 필요한 항목:"
        echo "1. Google Analytics 설정 (선택사항)"
        echo "2. Google AdSense 설정"
        echo "3. 커스텀 도메인 연결 (선택사항)"
        echo "4. SSL 인증서 자동 설정 완료"
        echo ""
        echo "📖 자세한 설정 방법은 README-FIREBASE.md를 참고하세요."
    else
        echo "❌ 배포 중 오류가 발생했습니다!"
        echo "오류 해결 후 다시 시도해주세요."
        exit 1
    fi
else
    echo "배포가 취소되었습니다."
    exit 0
fi