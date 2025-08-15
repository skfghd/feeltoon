import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  RefreshCw, 
  X,
  BookOpen,
  Palette,
  Loader2,
  Share2,
  Wand2
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FairyTale } from "@shared/schema";

interface StoryPreviewModalProps {
  fairyTale: FairyTale;
  onClose: () => void;
}

export default function StoryPreviewModal({ fairyTale, onClose }: StoryPreviewModalProps) {
  const { toast } = useToast();

  const handleShareToGallery = () => {
    toast({
      title: "갤러리 공유 완료!",
      description: "동화가 공유 갤러리에 자동으로 등록되었습니다. 다른 사람들도 감상할 수 있어요.",
    });
  };



  const getEmotionDisplay = (emotionId: string) => {
    const emotionNames: Record<string, string> = {
      anger: "분노",
      frustration: "좌절", 
      sadness: "우울",
      excitement: "흥분",
      love: "사랑",
      joy: "기쁨"
    };
    return emotionNames[emotionId] || emotionId;
  };

  const getStyleDisplay = (styleId: string) => {
    const styleNames: Record<string, string> = {
      fantasy: "판타지 몽환적",
      traditional: "전통 동화책",
      picturebook: "모던 그림책", 
      photographic: "사진적 무드",
      collage: "콜라주",
      experimental: "실험적 스타일"
    };
    return styleNames[styleId] || styleId;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="border-b border-gray-200 pb-4 px-6 pt-6 shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {fairyTale.title}
              </DialogTitle>
              <div className="flex flex-wrap gap-2">
                {fairyTale.emotions && fairyTale.emotions.length > 0 ? (
                  fairyTale.emotions.map(emotion => (
                    <Badge key={emotion} variant="secondary" className="text-xs">
                      {getEmotionDisplay(emotion)}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    감정 설정 없음
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {getStyleDisplay(fairyTale.illustrationStyle)}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded">
                📚 공유 갤러리에 자동 등록됨
              </div>
              
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                새 동화 만들기
              </Button>

              <Button
                onClick={() => window.open('https://kindtool.ai/', '_blank')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                홈으로
              </Button>

              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
                닫기
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-6">
            <div className="py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Story Content */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">스토리</h3>
                  </div>
                  
                  <Card className="p-6">
                <div className="prose prose-sm max-w-none">
                  {fairyTale.story ? (
                    fairyTale.story.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed font-serif">
                        {paragraph.trim()}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">스토리를 불러오는 중...</p>
                    )}
                  </div>
                  </Card>
                </div>

                {/* Illustrations */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">일러스트레이션</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {fairyTale.illustrations && fairyTale.illustrations.length > 0 ? (
                  fairyTale.illustrations.map((illustration, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-video bg-gray-100">
                        {illustration.url ? (
                          <img 
                            src={illustration.url} 
                            alt={illustration.description}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Palette className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            페이지 {illustration.page}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {illustration.description}
                        </p>
                      </div>
                    </Card>
                    ))
                    ) : (
                      <Card className="p-6">
                        <div className="text-center text-gray-500">
                          <Palette className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>일러스트가 준비 중입니다.</p>
                          <p className="text-sm mt-2">일러스트 재생성 버튼을 눌러 새로 생성해보세요.</p>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
