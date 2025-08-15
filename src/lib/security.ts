// 클라이언트 사이드 보안 유틸리티

// 요청 데이터 검증
export function validateRequestData(data: any): boolean {
  // 기본적인 데이터 검증
  if (!data || typeof data !== 'object') {
    return false;
  }

  // 민감한 정보가 포함되어 있는지 확인
  const sensitivePatterns = [
    /sk-[a-zA-Z0-9]+/g,  // OpenAI API 키 패턴
    /AIza[a-zA-Z0-9_-]{35}/g,  // Google API 키 패턴
    /gcp-[a-zA-Z0-9_-]+/g,  // Google Cloud 키 패턴
    /Bearer [a-zA-Z0-9]+/g,  // Bearer 토큰 패턴
    /password/i,  // 패스워드 필드
    /secret/i,    // 시크릿 필드
    /token/i,     // 토큰 필드
    /api[_-]?key/i  // API 키 필드
  ];

  const dataString = JSON.stringify(data);
  return !sensitivePatterns.some(pattern => pattern.test(dataString));
}

// 에러 메시지 안전화
export function sanitizeErrorMessage(error: any): string {
  if (!error) return '알 수 없는 오류가 발생했습니다.';
  
  let message = typeof error === 'string' ? error : error.message || '오류가 발생했습니다.';
  
  // 민감한 정보 제거
  message = message.replace(/sk-[a-zA-Z0-9]+/g, '[OPENAI_KEY_HIDDEN]');
  message = message.replace(/AIza[a-zA-Z0-9_-]{35}/g, '[GOOGLE_KEY_HIDDEN]');
  message = message.replace(/gcp-[a-zA-Z0-9_-]+/g, '[GCP_KEY_HIDDEN]');
  message = message.replace(/Bearer [a-zA-Z0-9]+/g, '[TOKEN_HIDDEN]');
  message = message.replace(/api[_-]?key/gi, 'API 키');
  
  // 일반적인 에러 메시지로 변환
  if (message.includes('unauthorized') || message.includes('401')) {
    return 'API 인증에 실패했습니다. 관리자에게 문의하세요.';
  }
  
  if (message.includes('forbidden') || message.includes('403')) {
    return '접근 권한이 없습니다.';
  }
  
  if (message.includes('rate limit') || message.includes('429')) {
    return '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  if (message.includes('500') || message.includes('internal server error')) {
    return '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  return message;
}

// 로컬 스토리지 보안 처리
export function secureLocalStorage() {
  // 민감한 데이터가 로컬 스토리지에 저장되지 않도록 방지
  const originalSetItem = localStorage.setItem;
  const originalGetItem = localStorage.getItem;
  
  localStorage.setItem = function(key: string, value: string) {
    // 민감한 키워드가 포함된 데이터 저장 방지
    const sensitiveKeys = ['api_key', 'secret', 'token', 'password'];
    const isSensitive = sensitiveKeys.some(sk => 
      key.toLowerCase().includes(sk) || value.toLowerCase().includes(sk)
    );
    
    if (isSensitive) {
      console.warn('민감한 데이터는 로컬 스토리지에 저장할 수 없습니다.');
      return;
    }
    
    originalSetItem.call(this, key, value);
  };
}

// 콘솔 로그 보안 처리
export function secureConsoleLog() {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  
  const sanitizeLogMessage = (message: any) => {
    if (typeof message === 'string') {
      return message
        .replace(/sk-[a-zA-Z0-9]+/g, '[OPENAI_KEY_HIDDEN]')
        .replace(/AIza[a-zA-Z0-9_-]{35}/g, '[GOOGLE_KEY_HIDDEN]')
        .replace(/gcp-[a-zA-Z0-9_-]+/g, '[GCP_KEY_HIDDEN]')
        .replace(/Bearer [a-zA-Z0-9]+/g, '[TOKEN_HIDDEN]');
    }
    if (typeof message === 'object' && message !== null) {
      return JSON.parse(JSON.stringify(message).replace(/sk-[a-zA-Z0-9]+/g, '[OPENAI_KEY_HIDDEN]').replace(/AIza[a-zA-Z0-9_-]{35}/g, '[GOOGLE_KEY_HIDDEN]'));
    }
    return message;
  };
  
  console.log = function(...args) {
    const sanitizedArgs = args.map(sanitizeLogMessage);
    originalLog.apply(this, sanitizedArgs);
  };
  
  console.error = function(...args) {
    const sanitizedArgs = args.map(sanitizeLogMessage);
    originalError.apply(this, sanitizedArgs);
  };
  
  console.warn = function(...args) {
    const sanitizedArgs = args.map(sanitizeLogMessage);
    originalWarn.apply(this, sanitizedArgs);
  };
}

// API 키 암호화 (브라우저 메모리에서만 사용)
export function encryptApiKey(apiKey: string): string {
  // 간단한 브라우저 메모리 내 암호화 (실제 암호화는 아니지만 브라우저 메모리 스캐닝 방지용)
  const encoded = btoa(apiKey);
  return encoded.split('').reverse().join('');
}

export function decryptApiKey(encryptedKey: string): string {
  const reversed = encryptedKey.split('').reverse().join('');
  return atob(reversed);
}

// API 키 보안 검증
export function validateApiKey(apiKey: string, type: 'openai' | 'google'): boolean {
  if (!apiKey || typeof apiKey !== 'string') return false;
  
  switch (type) {
    case 'openai':
      return apiKey.startsWith('sk-') && apiKey.length > 20;
    case 'google':
      return /^AIza[a-zA-Z0-9_-]{35}$/.test(apiKey);
    default:
      return false;
  }
}

// 네트워크 요청 보안 모니터링
export function monitorNetworkRequests() {
  const originalFetch = window.fetch;
  
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input.toString();
    const body = init?.body;
    
    // API 키가 포함된 요청 로깅 방지
    if (body && typeof body === 'string') {
      const hasSensitiveData = [
        /sk-[a-zA-Z0-9]+/,
        /AIza[a-zA-Z0-9_-]{35}/,
        /Bearer [a-zA-Z0-9]+/
      ].some(pattern => pattern.test(body));
      
      if (hasSensitiveData) {
        console.log(`🔒 보안 요청: ${url} (내용 숨김)`);
      }
    }
    
    return originalFetch.call(this, input, init);
  };
}

// 메모리 정리 함수
export function clearSensitiveMemory() {
  // 가비지 컬렉션 강제 실행 시도
  if ((window as any).gc) {
    (window as any).gc();
  }
  
  // 세션 스토리지 정리
  try {
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('api') || key.includes('key') || key.includes('token'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  } catch (e) {
    // 세션 스토리지 접근 실패 시 무시
  }
}

// 페이지 종료 시 보안 정리
export function setupSecurityCleanup() {
  window.addEventListener('beforeunload', () => {
    clearSensitiveMemory();
  });
  
  window.addEventListener('pagehide', () => {
    clearSensitiveMemory();
  });
  
  // 탭 전환 시에도 메모리 정리
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearSensitiveMemory();
    }
  });
}

// 초기화 함수
export function initializeSecurity() {
  secureLocalStorage();
  secureConsoleLog();
  monitorNetworkRequests();
  setupSecurityCleanup();
  
  // 개발자 도구 경고 (프로덕션 환경에서만)
  if (import.meta.env.PROD) {
    console.warn('⚠️ 개발자 도구 사용 시 주의: 민감한 정보를 입력하지 마세요.');
  }
  
  // 보안 정책 설정
  console.log('🔒 API 키 보안 시스템 활성화됨');
}