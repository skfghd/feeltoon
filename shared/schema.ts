import { z } from "zod";

// Firestore 문서 타입 정의
export interface User {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface FairyTale {
  id: string;
  title: string;
  emotions: string[];
  illustrationStyle: string;
  story: string;
  illustrations: { url: string; description: string; page: number }[];
  pdfUrl: string | null;
  authorName: string | null;
  userId: string | null;
  characterName: string | null;
  characterAge: string | null;
  characterGender: string | null;
  favoriteAnimal: string | null;
  favoriteColor: string | null;
  hobbies: string | null;
  interests: string | null;
  specialSituation: string | null;
  favoriteThings: string | null;
  dreamOrGoal: string | null;
  createdAt: any; // Firestore Timestamp
  isPublic: boolean;
  isApproved: boolean;
}

export interface Like {
  id: string;
  fairyTaleId: string;
  userIp: string;
  createdAt: any; // Firestore Timestamp
}

export interface DailyUsage {
  id: string;
  date: string; // YYYY-MM-DD 형식
  count: number;
  maxLimit: number;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

// Validation 스키마
export const createFairyTaleSchema = z.object({
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

export type CreateFairyTaleRequest = z.infer<typeof createFairyTaleSchema>;

// API 응답 타입
export interface UsageStatus {
  current: number;
  limit: number;
  remaining: number;
  isExceeded: boolean;
  date: string;
}

export interface LikeResponse {
  isLiked: boolean;
  likeCount: number;
}