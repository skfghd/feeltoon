# 🚀 Firebase 배포 가이드

AI 개인맞춤 동화책 생성 플랫폼을 Firebase로 배포하는 완전한 가이드입니다.

## 📋 목차

1. [사전 준비사항](#사전-준비사항)
2. [Firebase 프로젝트 설정](#firebase-프로젝트-설정)
3. [환경변수 설정](#환경변수-설정)
4. [원클릭 배포](#원클릭-배포)
5. [수동 배포](#수동-배포)
6. [AdSense 설정](#adsense-설정)
7. [도메인 연결](#도메인-연결)
8. [문제 해결](#문제-해결)

## 🛠️ 사전 준비사항

### 필수 계정
- Firebase/Google Cloud 계정
- Google Gemini AI API 키
- Google AdSense 계정 (수익화용)

### 필수 소프트웨어
- Node.js 18 이상
- npm 또는 yarn
- Git

## 🔧 Firebase 프로젝트 설정

### 1. Firebase 프로젝트 생성

```bash
# Firebase Console에서 새 프로젝트 생성
# https://console.firebase.google.com/

# 프로젝트 이름: fairy-tale-platform (또는 원하는 이름)
# Google Analytics: 활성화 권장
```

### 2. Firebase 서비스 활성화

Firebase Console에서 다음 서비스를 활성화하세요:

- **Hosting**: 정적 웹사이트 호스팅
- **Functions**: 서버리스 백엔드 API
- **Firestore**: NoSQL 데이터베이스
- **Analytics**: 사용자 분석 (선택사항)

### 3. 프로젝트 ID 설정

```bash
# .firebaserc 파일 수정
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## 🔐 환경변수 설정

### 1. Functions 환경변수

```bash
cd functions
cp .env.example .env
```

`.env` 파일에 실제 API 키 입력:

```env
# Google Gemini AI API 키 (필수)
GOOGLE_API_KEY=your_actual_google_api_key

# 일일 사용량 제한
DAILY_USAGE_LIMIT=50

# 운영 환경
NODE_ENV=production

# Firebase 리전 (서울)
FIREBASE_REGION=asia-northeast3
```

### 2. Firebase Functions 환경변수 설정

```bash
# Firebase CLI로 환경변수 설정
firebase functions:config:set google.api_key="YOUR_ACTUAL_API_KEY"
firebase functions:config:set daily.usage_limit=50
```

## 🚀 원클릭 배포

### 배포 스크립트 실행

```bash
# 실행 권한 부여
chmod +x deploy.sh

# 배포 실행
./deploy.sh
```

스크립트가 자동으로 다음을 수행합니다:

1. ✅ 필수 파일 및 환경 확인
2. 📦 의존성 설치
3. 🏗️ 클라이언트 빌드
4. ⚙️ Functions 빌드
5. 🚀 Firebase 배포

## 🔧 수동 배포

### 1. 의존성 설치

```bash
# 루트 프로젝트
npm install

# Functions
cd functions
npm install
cd ..
```

### 2. 빌드

```bash
# 클라이언트 빌드
npm run build

# Functions 빌드
npm run functions:build
```

### 3. 배포

```bash
# 전체 배포
firebase deploy

# 개별 배포
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore
```

## 💰 Google AdSense 설정

### 1. AdSense 계정 연동

1. [Google AdSense](https://www.google.com/adsense/) 계정 생성
2. 웹사이트 추가: `https://your-project-id.web.app`
3. 사이트 검토 대기 (보통 1-7일)

### 2. 광고 코드 설정

`public/index.html`에서 AdSense 클라이언트 ID 수정:

```html
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
        crossorigin="anonymous"></script>
```

### 3. 광고 단위 추가

AdSense 대시보드에서 광고 단위를 생성하고 코드를 웹사이트에 추가하세요.

## 🌐 커스텀 도메인 연결

### 1. 도메인 구매

원하는 도메인 등록업체에서 도메인 구매

### 2. Firebase Hosting 도메인 추가

```bash
# Firebase Console > Hosting > 커스텀 도메인 추가
# 또는 CLI 사용:
firebase hosting:sites:create your-site-name
```

### 3. DNS 설정

도메인 등록업체에서 DNS 레코드 추가:

```
Type: A
Name: @
Value: [Firebase에서 제공하는 IP 주소]

Type: A  
Name: www
Value: [Firebase에서 제공하는 IP 주소]
```

## 🔍 배포 확인

### 1. 웹사이트 접속

```
기본 URL: https://your-project-id.web.app
Functions URL: https://asia-northeast3-your-project-id.cloudfunctions.net/api
```

### 2. 기능 테스트

- ✅ 홈페이지 로딩
- ✅ 동화 생성 기능
- ✅ 갤러리 페이지
- ✅ 좋아요 기능
- ✅ 반응형 디자인

## 📊 모니터링 및 분석

### 1. Firebase 콘솔 모니터링

- Functions 로그 확인
- Firestore 사용량 모니터링
- Hosting 트래픽 분석

### 2. Google Analytics 설정

`public/index.html`에서 GA Measurement ID 수정:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_ACTUAL_GA_ID');
</script>
```

## 🚨 문제 해결

### 배포 실패 시

```bash
# Firebase 로그인 확인
firebase login

# 프로젝트 재설정
firebase use --add

# 캐시 정리
npm run build
firebase deploy --force
```

### Functions 오류 시

```bash
# Functions 로그 확인
firebase functions:log

# 환경변수 확인
firebase functions:config:get

# Functions 재배포
firebase deploy --only functions
```

### Firestore 권한 오류 시

```bash
# Firestore 규칙 재배포
firebase deploy --only firestore:rules
```

## 📈 성능 최적화

### 1. Hosting 설정

- CDN 자동 활성화
- Gzip 압축 적용
- 캐시 정책 최적화

### 2. Functions 최적화

- 메모리 할당: 1GB (대용량 AI 처리용)
- 타임아웃: 300초
- 서울 리전 사용

### 3. Firestore 최적화

- 인덱스 자동 생성
- 복합 쿼리 최적화
- 보안 규칙 적용

## 🔒 보안 설정

### 1. API 키 보안

- 환경변수로 API 키 관리
- Functions에서만 API 호출
- 클라이언트에 API 키 노출 방지

### 2. Firestore 보안

- 읽기/쓰기 권한 제어
- 사용자별 데이터 접근 제한
- 스팸 방지 규칙 적용

## 💡 추가 기능

### 1. 백업 설정

```bash
# Firestore 백업 스케줄 설정
gcloud firestore export gs://your-backup-bucket
```

### 2. 알림 설정

- 오류 알림 (Slack, 이메일)
- 사용량 임계값 알림
- 성능 모니터링 알림

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. Firebase Console 로그
2. Functions 실행 로그
3. 브라우저 개발자 도구
4. 이 README의 문제 해결 섹션

---

## 🎉 배포 완료!

축하합니다! AI 개인맞춤 동화책 생성 플랫폼이 성공적으로 Firebase에 배포되었습니다.

이제 전 세계 사용자들이 감정과 취향에 맞는 특별한 동화를 생성하고 공유할 수 있습니다.