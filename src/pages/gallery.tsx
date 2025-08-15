import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Palette, BookOpen, Share2, Eye, Heart } from "lucide-react";
import { useState } from "react";
import StoryPreviewModal from "@/components/story-preview-modal";
import { apiRequest } from "@/lib/queryClient";
import Footer from "@/components/footer";
import UsageStatus from "@/components/usage-status";

interface FairyTale {
  id: string;
  title: string;
  emotions: string[];
  illustrationStyle: string;
  story: string;
  illustrations: Array<{
    url: string;
    description: string;
    page: number;
  }>;
  createdAt: string;
  characterName?: string;
  likeCount: number;
  isLiked: boolean;
}

export default function Gallery() {
  const [selectedTale, setSelectedTale] = useState<FairyTale | null>(null);
  const queryClient = useQueryClient();
  
  const { data: fairyTales = [], isLoading } = useQuery<FairyTale[]>({
    queryKey: ["/api/gallery"],
  });

  const likeMutation = useMutation({
    mutationFn: async (fairyTaleId: string) => {
      return await apiRequest(`/api/fairy-tales/${fairyTaleId}/like`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      // 갤러리 데이터 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
    },
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">갤러리를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Share2 className="inline-block w-10 h-10 mr-3 text-primary" />
            공유 갤러리
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            모든 사용자들이 만든 동화들이 자동으로 공유되는 공간입니다
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              📚 생성된 모든 동화는 자동으로 이 갤러리에 공유됩니다. 
              개별 다운로드는 지원하지 않으며, 여기서 감상하실 수 있습니다.
            </p>
          </div>
        </div>

        {fairyTales.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">아직 공유된 동화가 없습니다</h3>
            <p className="text-gray-600">첫 번째 동화를 만들어 보세요!</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.href = '/'}
            >
              동화 만들기
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                총 <span className="font-bold text-primary">{fairyTales.length}</span>편의 동화가 공유되었습니다
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {fairyTales.map((tale) => (
                <Card key={tale.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-md">
                  <div className="aspect-[4/3] bg-gradient-to-r from-purple-100 to-pink-100 relative overflow-hidden">
                    {tale.illustrations && tale.illustrations.length > 0 && tale.illustrations[0].url ? (
                      <img 
                        src={tale.illustrations[0].url} 
                        alt={tale.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Palette className="w-12 h-12 text-purple-300" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {getStyleDisplay(tale.illustrationStyle)}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-base group-hover:text-primary transition-colors">
                      {tale.title}
                    </CardTitle>
                    {tale.characterName && (
                      <CardDescription className="text-sm text-primary font-medium">
                        주인공: {tale.characterName}
                      </CardDescription>
                    )}
                    <CardDescription className="flex items-center gap-2 text-xs">
                      <Clock className="w-3 h-3" />
                      {new Date(tale.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {tale.emotions?.slice(0, 2).map(emotion => (
                        <Badge key={emotion} variant="outline" className="text-xs">
                          {getEmotionDisplay(emotion)}
                        </Badge>
                      ))}
                      {tale.emotions?.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{tale.emotions.length - 2}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {tale.story || '스토리를 불러오는 중...'}
                    </p>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => likeMutation.mutate(tale.id)}
                        variant={tale.isLiked ? "default" : "outline"}
                        size="sm"
                        className={`flex items-center gap-2 ${
                          tale.isLiked 
                            ? "bg-red-500 hover:bg-red-600 text-white border-red-500" 
                            : "hover:bg-red-50 hover:border-red-300"
                        }`}
                        disabled={likeMutation.isPending}
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            tale.isLiked ? "fill-white" : "hover:fill-red-400"
                          }`} 
                        />
                        <span className="text-xs font-medium">
                          {tale.likeCount}
                        </span>
                      </Button>
                      
                      <Button 
                        onClick={() => setSelectedTale(tale)}
                        className="flex-1"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        감상하기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedTale && (
        <StoryPreviewModal 
          fairyTale={selectedTale as any} 
          onClose={() => setSelectedTale(null)}
        />
      )}
      
      <Footer />
    </div>
  );
}