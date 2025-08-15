import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock } from "lucide-react";

interface UsageStatus {
  current: number;
  limit: number;
  remaining: number;
  isExceeded: boolean;
  date: string;
}

export default function UsageStatus() {
  const { data: status } = useQuery<UsageStatus>({
    queryKey: ["/api/usage/status"],
    refetchInterval: 30000, // 30초마다 업데이트
  });

  if (!status) return null;

  const progressPercentage = (status.current / status.limit) * 100;
  const isNearLimit = progressPercentage > 80;
  const isAtLimit = status.isExceeded;

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-purple-200 rounded-lg px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${isAtLimit ? 'text-orange-500' : 'text-purple-500'}`} />
          <span className="text-sm font-medium text-gray-700">
            오늘의 AI 마법
          </span>
        </div>
        <Badge 
          variant={isAtLimit ? "destructive" : isNearLimit ? "secondary" : "default"}
          className="text-xs"
        >
          {status.current} / {status.limit}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <Progress 
          value={progressPercentage} 
          className="h-2"
        />
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {isAtLimit ? 
              '오늘의 마법이 모두 소진되었어요' : 
              `${status.remaining}개의 마법이 남았어요`
            }
          </span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>매일 오전 5시 리셋</span>
          </div>
        </div>
        
        {isAtLimit && (
          <div className="text-xs text-orange-600 bg-orange-50 rounded px-2 py-1 mt-2 space-y-1">
            <div className="font-medium">AI는 오늘 모두 일했어요! 🤖💤</div>
            <div>하지만 걱정 마세요. 앱 자체의 창작 로직으로 계속 동화를 만들 수 있어요.</div>
            <div className="text-orange-500">내일 오전 5시에 AI 마법이 다시 충전됩니다 ✨</div>
          </div>
        )}
      </div>
    </div>
  );
}