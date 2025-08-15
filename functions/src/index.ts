import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';

// Firestore 및 Firebase Admin 초기화
admin.initializeApp();
const db = admin.firestore();

// Express 앱 생성
const app = express();

// CORS 설정
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 보안 헤더 설정
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  });
  next();
});

// 요청 로깅
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        const safeResponse = JSON.stringify(capturedJsonResponse).replace(/sk-[a-zA-Z0-9]+/g, '[API_KEY_HIDDEN]');
        logLine += ` :: ${safeResponse}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + '…';
      }

      console.log(logLine);
    }
  });

  next();
});

// API 키 검증 미들웨어
app.use('/api', (req, res, next) => {
  const endpoints = ['/api/fairy-tales/generate'];
  
  if (endpoints.some(endpoint => req.path.includes(endpoint.split('/')[3]))) {
    if (!process.env.GOOGLE_API_KEY && !process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'CONFIGURATION_ERROR',
        message: '서버 설정에 문제가 있습니다. 관리자에게 문의해주세요.' 
      });
    }
  }
  next();
});

// 스키마 정의
const createFairyTaleSchema = z.object({
  emotions: z.array(z.string()).min(1, "At least one emotion is required"),
  illustrationStyle: z.string().min(1, "Illustration style is required"),
  characterName: z.string().optional(),
  characterAge: z.string().optional(),
  characterGender: z.enum(["남성", "여성", "상관없음"]).optional(),
  favoriteAnimal: z.string().optional(),
  favoriteColor: z.string().optional(),
  hobbies: z.string().optional(),
  interests: z.string().optional(),
  specialSituation: z.string().optional(),
  favoriteThings: z.string().optional(),
  dreamOrGoal: z.string().optional(),
});

// 일일 사용량 관리 함수들
async function getUsageStatus() {
  const today = new Date().toISOString().split('T')[0];
  const usageRef = db.collection('dailyUsage').doc(today);
  const usageDoc = await usageRef.get();
  
  const limit = parseInt(process.env.DAILY_USAGE_LIMIT || '50');
  
  if (!usageDoc.exists) {
    await usageRef.set({
      date: today,
      count: 0,
      maxLimit: limit,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { current: 0, limit, remaining: limit, isExceeded: false, date: today };
  }
  
  const data = usageDoc.data()!;
  const current = data.count || 0;
  const remaining = Math.max(0, limit - current);
  const isExceeded = current >= limit;
  
  return { current, limit, remaining, isExceeded, date: today };
}

async function incrementUsageCount() {
  const today = new Date().toISOString().split('T')[0];
  const usageRef = db.collection('dailyUsage').doc(today);
  
  await db.runTransaction(async (transaction) => {
    const usageDoc = await transaction.get(usageRef);
    const limit = parseInt(process.env.DAILY_USAGE_LIMIT || '50');
    
    if (!usageDoc.exists) {
      transaction.set(usageRef, {
        date: today,
        count: 1,
        maxLimit: limit,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      const currentCount = usageDoc.data()!.count || 0;
      transaction.update(usageRef, {
        count: currentCount + 1,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });
}

async function isUsageLimitExceeded() {
  const status = await getUsageStatus();
  return status.isExceeded;
}

// Gemini AI 스토리 생성 함수
async function generateStory(options: any) {
  const { GoogleGenerativeAI } = require('@google/genai');
  
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Google API key not configured');
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
  const prompt = generateStoryPrompt(options);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    throw new Error('AI 응답 파싱에 실패했습니다.');
  }
}

function generateStoryPrompt(options: any) {
  const { emotions, illustrationStyle, characterName, characterAge, characterGender, favoriteAnimal, favoriteColor, hobbies, interests, specialSituation, favoriteThings, dreamOrGoal } = options;
  
  let personalizationContext = '';
  if (characterName) {
    personalizationContext += `주인공의 이름: ${characterName}\n`;
  }
  if (characterAge) {
    personalizationContext += `주인공의 나이: ${characterAge}\n`;
  }
  if (characterGender && characterGender !== '상관없음') {
    personalizationContext += `주인공의 성별: ${characterGender}\n`;
  }
  if (favoriteAnimal) {
    personalizationContext += `좋아하는 동물: ${favoriteAnimal}\n`;
  }
  if (favoriteColor) {
    personalizationContext += `좋아하는 색깔: ${favoriteColor}\n`;
  }
  if (hobbies) {
    personalizationContext += `취미: ${hobbies}\n`;
  }
  if (interests) {
    personalizationContext += `관심사: ${interests}\n`;
  }
  if (specialSituation) {
    personalizationContext += `특별한 상황: ${specialSituation}\n`;
  }
  if (favoriteThings) {
    personalizationContext += `좋아하는 것들: ${favoriteThings}\n`;
  }
  if (dreamOrGoal) {
    personalizationContext += `꿈이나 목표: ${dreamOrGoal}\n`;
  }

  return `당신은 창의적인 동화 작가입니다. 주어진 감정과 개인화 정보를 바탕으로 따뜻하고 교훈적인 동화를 만들어주세요.

감정: ${emotions.join(', ')}
일러스트 스타일: ${illustrationStyle}

${personalizationContext ? `개인화 정보:\n${personalizationContext}` : ''}

다음 JSON 형식으로 응답해주세요:
{
  "title": "동화 제목",
  "story": "완전한 동화 내용 (최소 500자, 단락별로 구분)",
  "scenes": [
    {
      "description": "첫 번째 장면 묘사",
      "pageNumber": 1
    },
    {
      "description": "두 번째 장면 묘사", 
      "pageNumber": 2
    },
    {
      "description": "세 번째 장면 묘사",
      "pageNumber": 3
    }
  ]
}

요구사항:
1. 한국어로 작성
2. 아이들에게 적합한 내용
3. 주어진 감정을 자연스럽게 표현
4. 교훈이나 긍정적 메시지 포함
5. 개인화 정보가 있다면 자연스럽게 스토리에 반영`;
}

// 폴백 스토리 생성
function generateFallbackStory(emotions: string[], characterName?: string) {
  const fallbackStories = [
    {
      title: characterName ? `${characterName}의 모험` : "용감한 친구의 모험",
      story: `옛날 옛적에 ${characterName || '한 아이'}가 살고 있었습니다. 어느 날 ${characterName || '그 아이'}는 숲에서 길을 잃었지만, 용기를 내어 집으로 돌아가는 길을 찾았습니다. 그 과정에서 많은 친구들을 만나고 도움을 받으며, 결국 무사히 집에 돌아올 수 있었습니다. ${characterName || '아이'}는 이 경험을 통해 용기와 친절의 소중함을 배웠습니다.`,
      illustrations: [
        { description: `${characterName || '아이'}가 숲에서 길을 찾고 있는 모습`, page: 1 },
        { description: `${characterName || '아이'}가 숲 속 친구들과 만나는 모습`, page: 2 },
        { description: `${characterName || '아이'}가 집에 돌아가는 모습`, page: 3 }
      ]
    }
  ];
  
  return fallbackStories[0];
}

function getFallbackMessage() {
  return "오늘의 AI 마법이 모두 소진되어 요정이 직접 만든 특별한 동화를 선물로 드려요! 🧚‍♀️✨";
}

// SVG 일러스트 생성 (간단한 플레이스홀더)
async function generateIllustration(description: string, style: string, emotions: string[]) {
  // Firebase에서는 간단한 SVG 플레이스홀더 반환
  const colors = {
    "기쁨": "#FFD700",
    "사랑": "#FF69B4", 
    "신남": "#32CD32",
    "평온": "#87CEEB",
    "슬픔": "#4682B4",
    "화남": "#DC143C"
  };
  
  const primaryColor = colors[emotions[0] as keyof typeof colors] || "#6B73FF";
  
  const svg = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="${primaryColor}20"/>
      <circle cx="200" cy="150" r="50" fill="${primaryColor}"/>
      <text x="200" y="250" text-anchor="middle" font-family="serif" font-size="14" fill="#333">
        ${description.slice(0, 20)}...
      </text>
    </svg>
  `)}`;
  
  return { url: svg };
}

// API 라우트 정의
app.get('/api/usage/status', async (req, res) => {
  try {
    const status = await getUsageStatus();
    res.json(status);
  } catch (error) {
    console.error('Error fetching usage status:', error);
    res.status(500).json({ message: 'Failed to fetch usage status' });
  }
});

app.post('/api/fairy-tales/generate', async (req, res) => {
  try {
    const validatedData = createFairyTaleSchema.parse(req.body);
    
    const isLimitExceeded = await isUsageLimitExceeded();
    let generatedStory;
    let usingFallback = false;
    
    if (isLimitExceeded) {
      usingFallback = true;
      const fallbackStory = generateFallbackStory(
        validatedData.emotions, 
        validatedData.characterName
      );
      
      generatedStory = {
        title: fallbackStory.title,
        story: fallbackStory.story,
        scenes: fallbackStory.illustrations.map(ill => ({
          description: ill.description,
          pageNumber: ill.page
        }))
      };
      
      console.log('⚠️ 일일 한도 초과 - Fallback 스토리 사용:', { 
        title: generatedStory.title,
        fallbackMessage: getFallbackMessage()
      });
    } else {
      await incrementUsageCount();
      
      generatedStory = await generateStory({
        emotions: validatedData.emotions,
        illustrationStyle: validatedData.illustrationStyle,
        characterName: validatedData.characterName,
        characterAge: validatedData.characterAge,
        characterGender: validatedData.characterGender,
        favoriteAnimal: validatedData.favoriteAnimal,
        favoriteColor: validatedData.favoriteColor,
        hobbies: validatedData.hobbies,
        interests: validatedData.interests,
        specialSituation: validatedData.specialSituation,
        favoriteThings: validatedData.favoriteThings,
        dreamOrGoal: validatedData.dreamOrGoal
      });
      
      console.log('📖 개인화된 동화 생성:', { 
        title: generatedStory.title,
        personalizationUsed: {
          characterName: validatedData.characterName,
          favoriteAnimal: validatedData.favoriteAnimal,
          favoriteColor: validatedData.favoriteColor,
          hobbies: validatedData.hobbies
        }
      });
    }

    const illustrations = [];
    for (const scene of generatedStory.scenes) {
      try {
        if (usingFallback) {
          illustrations.push({
            url: '',
            description: scene.description,
            page: scene.pageNumber
          });
        } else {
          const illustration = await generateIllustration(
            scene.description,
            validatedData.illustrationStyle,
            validatedData.emotions
          );
          
          illustrations.push({
            url: illustration.url,
            description: scene.description,
            page: scene.pageNumber
          });
        }
      } catch (illustrationError) {
        console.error(`일러스트 생성 실패 (페이지 ${scene.pageNumber}):`, illustrationError);
        illustrations.push({
          url: '',
          description: scene.description,
          page: scene.pageNumber
        });
      }
    }

    const fairyTale = {
      title: generatedStory.title,
      emotions: validatedData.emotions,
      illustrationStyle: validatedData.illustrationStyle,
      story: generatedStory.story,
      illustrations,
      authorName: "AI 동화 작가",
      userId: null,
      characterName: validatedData.characterName || null,
      characterAge: validatedData.characterAge || null,
      characterGender: validatedData.characterGender || null,
      favoriteAnimal: validatedData.favoriteAnimal || null,
      favoriteColor: validatedData.favoriteColor || null,
      hobbies: validatedData.hobbies || null,
      interests: validatedData.interests || null,
      specialSituation: validatedData.specialSituation || null,
      favoriteThings: validatedData.favoriteThings || null,
      dreamOrGoal: validatedData.dreamOrGoal || null,
      isPublic: true,
      isApproved: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      pdfUrl: null,
    };

    // Firestore에 저장
    const docRef = await db.collection('fairyTales').add(fairyTale);
    const createdStory = { id: docRef.id, ...fairyTale };

    const response = {
      ...createdStory,
      usingFallback,
      fallbackMessage: usingFallback ? getFallbackMessage() : undefined
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating fairy tale:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid request data', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to generate fairy tale' });
    }
  }
});

app.get('/api/fairy-tales', async (req, res) => {
  try {
    const fairyTalesRef = db.collection('fairyTales')
      .where('isPublic', '==', true)
      .where('isApproved', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(50);
    
    const snapshot = await fairyTalesRef.get();
    const fairyTales = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(fairyTales);
  } catch (error) {
    console.error('Error fetching fairy tales:', error);
    res.status(500).json({ message: 'Failed to fetch fairy tales' });
  }
});

app.post('/api/fairy-tales/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const userIp = req.ip || req.connection.remoteAddress || 'unknown';
    
    // 기존 좋아요 확인
    const existingLikeQuery = await db.collection('likes')
      .where('fairyTaleId', '==', id)
      .where('userIp', '==', userIp)
      .get();
    
    if (!existingLikeQuery.empty) {
      // 좋아요 취소
      await existingLikeQuery.docs[0].ref.delete();
      
      const likeCountQuery = await db.collection('likes')
        .where('fairyTaleId', '==', id)
        .get();
      
      res.json({ isLiked: false, likeCount: likeCountQuery.size });
    } else {
      // 좋아요 추가
      await db.collection('likes').add({
        fairyTaleId: id,
        userIp,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      const likeCountQuery = await db.collection('likes')
        .where('fairyTaleId', '==', id)
        .get();
      
      res.json({ isLiked: true, likeCount: likeCountQuery.size });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
});

app.get('/api/fairy-tales/:id/likes', async (req, res) => {
  try {
    const { id } = req.params;
    const userIp = req.ip || req.connection.remoteAddress || 'unknown';
    
    const [likeCountQuery, userLikeQuery] = await Promise.all([
      db.collection('likes').where('fairyTaleId', '==', id).get(),
      db.collection('likes')
        .where('fairyTaleId', '==', id)
        .where('userIp', '==', userIp)
        .get()
    ]);
    
    res.json({
      likeCount: likeCountQuery.size,
      isLiked: !userLikeQuery.empty
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ message: 'Failed to fetch likes' });
  }
});

// 글로벌 에러 핸들러
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // 민감한 정보 제거
  message = message.replace(/sk-[a-zA-Z0-9]+/g, '[API_KEY_HIDDEN]');
  
  if (process.env.NODE_ENV === 'production') {
    message = status >= 500 ? '서버 내부 오류가 발생했습니다.' : message;
  }

  res.status(status).json({ 
    error: status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'CLIENT_ERROR',
    message 
  });
  
  const safeError = { ...err, message };
  console.log(`Error ${status}: ${safeError.message}`);
});

// Firebase Functions로 내보내기
export const api = functions
  .region('asia-northeast3') // 서울 리전
  .runWith({
    timeoutSeconds: 300,
    memory: '1GB'
  })
  .https
  .onRequest(app);