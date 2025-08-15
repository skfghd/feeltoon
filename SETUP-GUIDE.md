# 🚀 Firebase 배포 빠른 시작 가이드

이 ZIP 파일에는 AI 개인맞춤 동화책 생성 플랫폼을 Firebase에 배포하기 위한 모든 파일이 포함되어 있습니다.

## ⚡ 빠른 시작 (5분 내 배포)

### 1단계: 압축 해제
```bash
unzip fairy-tale-firebase-deployment.zip
cd fairy-tale-firebase-deployment
```

### 2단계: Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: `my-fairy-tale-app`)
4. Google Analytics 설정 (권장)

### 3단계: 프로젝트 ID 설정
`.firebaserc` 파일을 열고 프로젝트 ID를 실제 값으로 변경:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 4단계: API 키 설정
`functions/.env.example`을 `functions/.env`로 복사하고 API 키 입력:
```bash
cd functions
cp .env.example .env
# .env 파일 편집하여 GOOGLE_API_KEY 입력
```

### 5단계: 원클릭 배포
```bash
./deploy.sh
```

## 🎯 원클릭 배포 스크립트 기능

`deploy.sh` 스크립트가 자동으로 수행하는 작업:

✅ **환경 검증**: Node.js, Firebase CLI, 프로젝트 설정 확인  
✅ **의존성 설치**: 루트 및 Functions 패키지 자동 설치  
✅ **빌드 프로세스**: 클라이언트 및 서버 코드 컴파일  
✅ **Firebase 배포**: Hosting, Functions, Firestore 규칙 배포  
✅ **배포 확인**: 성공적인 배포 후 URL 및 설정 가이드 제공  

## 📁 포함된 파일 구조

```
firebase-deployment/
├── 🔧 Firebase 설정
│   ├── firebase.json         # Firebase 프로젝트 설정
│   ├── .firebaserc          # 프로젝트 ID 설정
│   ├── firestore.rules      # 데이터베이스 보안 규칙
│   └── firestore.indexes.json # 데이터베이스 인덱스
│
├── ⚙️ Functions (서버)
│   ├── src/index.ts         # 메인 API 서버
│   ├── package.json         # 서버 의존성
│   ├── tsconfig.json        # TypeScript 설정
│   └── .env.example         # 환경변수 템플릿
│
├── 🌐 클라이언트 소스
│   ├── src/                 # React 컴포넌트
│   ├── public/index.html    # SEO 최적화 HTML
│   ├── package.json         # 프론트엔드 의존성
│   └── vite.firebase.config.ts # 빌드 설정
│
├── 📚 공유 모듈
│   └── shared/schema.ts     # 타입 정의
│
├── 🚀 배포 도구
│   ├── deploy.sh           # 원클릭 배포 스크립트
│   ├── README-FIREBASE.md  # 상세 배포 가이드
│   └── SETUP-GUIDE.md      # 이 파일
│
└── 🔧 설정 파일
    ├── tailwind.config.ts  # Tailwind CSS 설정
    ├── tsconfig.json       # TypeScript 설정
    └── components.json     # UI 컴포넌트 설정
```

## 🔑 필수 API 키

배포하기 전에 다음 API 키가 필요합니다:

### Google Gemini AI API 키 (필수)
1. [Google AI Studio](https://makersuite.google.com/) 접속
2. API 키 생성
3. `functions/.env` 파일에 `GOOGLE_API_KEY` 설정

### Google AdSense (수익화용, 선택사항)
1. [Google AdSense](https://www.google.com/adsense/) 계정 생성
2. `public/index.html`에서 클라이언트 ID 수정

## 🌍 배포 후 확인 사항

배포가 완료되면 다음 URL에서 앱을 확인할 수 있습니다:

- **웹사이트**: `https://your-project-id.web.app`
- **API**: `https://asia-northeast3-your-project-id.cloudfunctions.net/api`

### 테스트할 기능들
- ✅ 홈페이지 로딩
- ✅ 감정 선택 및 동화 생성
- ✅ 일러스트 표시
- ✅ 갤러리 페이지
- ✅ 좋아요 기능
- ✅ 모바일 반응형

## 🔧 고급 설정

### 커스텀 도메인 연결
```bash
firebase hosting:sites:create your-site-name
# Firebase Console에서 도메인 추가
```

### 환경변수 업데이트
```bash
firebase functions:config:set google.api_key="NEW_API_KEY"
firebase deploy --only functions
```

### 데이터베이스 백업
```bash
gcloud firestore export gs://your-backup-bucket
```

## 🆘 문제 해결

### 배포 실패 시
```bash
# 로그인 확인
firebase login

# 프로젝트 재설정
firebase use --add

# 강제 재배포
firebase deploy --force
```

### Functions 오류 시
```bash
# 로그 확인
firebase functions:log

# 환경변수 확인
firebase functions:config:get
```

## 📞 지원

- 📖 **상세 가이드**: `README-FIREBASE.md` 참조
- 🔧 **기술적 문제**: Firebase Console 로그 확인
- 💡 **추가 기능**: 소스 코드 주석 참조

---

## 🎉 성공적인 배포를 위한 체크리스트

- [ ] Firebase 프로젝트 생성 완료
- [ ] `.firebaserc`에 올바른 프로젝트 ID 설정
- [ ] `functions/.env`에 Google API 키 설정
- [ ] `./deploy.sh` 스크립트 실행
- [ ] 배포 완료 후 웹사이트 접속 확인
- [ ] 동화 생성 기능 테스트
- [ ] (선택사항) AdSense 설정
- [ ] (선택사항) 커스텀 도메인 연결

모든 단계를 완료하면 전 세계 사용자들이 접근할 수 있는 AI 동화 플랫폼이 준비됩니다! 🌟