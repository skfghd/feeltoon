import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { validateRequestData, sanitizeErrorMessage } from "./security";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    const errorMessage = sanitizeErrorMessage(`${res.status}: ${text}`);
    throw new Error(errorMessage);
  }
}

export async function apiRequest(
  url: string,
  options?: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  }
): Promise<Response> {
  const { method = 'GET', body, headers = {} } = options || {};
  
  // 요청 데이터 검증
  if (body && !validateRequestData(body)) {
    throw new Error('요청 데이터에 민감한 정보가 포함되어 있습니다.');
  }

  try {
    const res = await fetch(url, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        // 보안 헤더 추가
        "X-Requested-With": "XMLHttpRequest",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    const sanitizedError = sanitizeErrorMessage(error);
    throw new Error(sanitizedError);
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5분
      retry: (failureCount, error: any) => {
        // API 키 관련 오류는 재시도하지 않음
        if (error?.message?.includes('unauthorized') || 
            error?.message?.includes('403') ||
            error?.message?.includes('API_KEY') ||
            error?.message?.includes('인증')) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
