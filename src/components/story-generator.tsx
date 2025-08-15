import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Palette, 
  Download, 
  RefreshCw,
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FairyTale } from "@shared/schema";

interface StoryGeneratorProps {
  emotions: string[];
  illustrationStyle: string;
  personalizationData?: any;
  currentStep: number;
  onStoryGenerated: (story: FairyTale) => void;
  generatedStory: FairyTale | null;
  onShowPreview: () => void;
}

export default function StoryGenerator({
  emotions,
  illustrationStyle,
  personalizationData = {},
  currentStep,
  onStoryGenerated,
  generatedStory,
  onShowPreview
}: StoryGeneratorProps) {
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  const generateStoryMutation = useMutation({
    mutationFn: async () => {
      // 서버 API를 통한 동화 생성 요청
      const response = await apiRequest('/api/fairy-tales/generate', {
        method: 'POST',
        body: {
          emotions,
          illustrationStyle,
          ...personalizationData
        }
      });
      return response.json();
    },
    onSuccess: (data) => {
      onStoryGenerated(data);
      setGenerationProgress(100);
      setCurrentTask("완료!");
      
      // Check if fallback was used and show appropriate message
      if (data.usingFallback) {
        toast({
          title: "그림책 요정의 특별한 선물! ✨",
          description: data.fallbackMessage || "오늘의 AI 마법이 모두 소진되어 요정이 직접 만든 동화를 선물로 드려요!",
          variant: "default",
        });
      } else {
        toast({
          title: "동화 생성 완료!",
          description: "아름다운 동화책이 완성되었습니다.",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "생성 실패",
        description: error instanceof Error ? error.message : "동화 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  });

  const generateIllustrationsMutation = useMutation({
    mutationFn: async () => {
      if (!generatedStory) throw new Error("스토리가 없습니다");
      
      // 서버에서 일러스트 생성 처리 (이미 생성되어 있음)
      return generatedStory;

    },
    onSuccess: (data) => {
      onStoryGenerated(data);
      toast({
        title: "일러스트 생성 완료",
        description: "모든 일러스트가 성공적으로 생성되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "일러스트 생성 실패",
        description: "일러스트 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const regenerateIllustrationsMutation = useMutation({
    mutationFn: async () => {
      if (!generatedStory) throw new Error("스토리가 없습니다");
      
      const response = await apiRequest(`/api/fairy-tales/${generatedStory.id}/regenerate-illustrations`, {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: (data) => {
      onStoryGenerated(data);
      toast({
        title: "일러스트 재생성 완료!",
        description: "새로운 일러스트가 생성되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "재생성 불가",
        description: "새로운 동화를 만들어보세요!",
        variant: "destructive",
      });
    }
  });

  const handlePublishToGallery = async () => {
    if (!generatedStory) return;
    
    setIsPublishing(true);
    try {
      await apiRequest(`/api/fairy-tales/${generatedStory.id}/publish`, {
        method: 'POST'
      });
      
      toast({
        title: "공유 완료! 🎉",
        description: "동화가 공유 갤러리에 게시되었습니다.",
      });
      
      // 갤러리로 이동
      setTimeout(() => {
        window.location.href = '/gallery';
      }, 1500);
    } catch (error) {
      toast({
        title: "공유 실패",
        description: error instanceof Error ? error.message : "공유 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteStory = async () => {
    if (!generatedStory) return;
    
    setIsDeleting(true);
    try {
      await apiRequest(`/api/fairy-tales/${generatedStory.id}`, {
        method: 'DELETE'
      });
      
      toast({
        title: "삭제 완료",
        description: "동화가 완전히 삭제되었습니다.",
      });
      
      // 홈으로 이동
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    handleDeleteStory();
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // PDF 다운로드는 브라우저에서 직접 처리
  const downloadPdf = () => {
    if (!generatedStory) return;
    
    // 간단한 HTML을 PDF로 변환하는 기능 (실제로는 더 복잡한 라이브러리 필요)
    const printContent = `
      <html>
        <head>
          <title>${generatedStory.title}</title>
          <style>
            body { font-family: '맑은 고딕', sans-serif; margin: 20px; }
            .page { page-break-after: always; padding: 20px; }
            h1 { text-align: center; color: #333; }
            .story { line-height: 1.6; font-size: 14px; }
            .illustration { text-align: center; margin: 20px 0; }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <div class="page">
            <h1>${generatedStory.title}</h1>
            <div class="story">${generatedStory.story}</div>
          </div>
          ${generatedStory.illustrations && generatedStory.illustrations.length > 0 ? generatedStory.illustrations.map(ill => `
            <div class="page">
              <div class="illustration">
                ${ill.url ? `<img src="${ill.url}" alt="${ill.description}" />` : ''}
                <p><em>${ill.description}</em></p>
              </div>
            </div>
          `).join('') : ''}
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
    
    toast({
      title: "인쇄 대화상자 열림",
      description: "브라우저의 인쇄 기능을 사용해 PDF로 저장하세요.",
    });
  };

  useEffect(() => {
    if (currentStep === 4 && !generatedStory && !generateStoryMutation.isPending) {
      // Auto-start generation when reaching step 4
      setGenerationProgress(0);
      setCurrentTask("AI가 동화를 생성하고 있습니다...");
      
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 5;
        });
      }, 2000);

      // 단계별 진행 상황 업데이트
      setTimeout(() => {
        setCurrentTask("스토리 내용을 작성하고 있습니다...");
        setGenerationProgress(25);
      }, 3000);
      
      setTimeout(() => {
        setCurrentTask("일러스트 장면을 구성하고 있습니다...");
        setGenerationProgress(50);
      }, 8000);
      
      setTimeout(() => {
        setCurrentTask("최종 검토 및 완성 중입니다...");
        setGenerationProgress(75);
      }, 15000);

      generateStoryMutation.mutate();

      return () => clearInterval(progressInterval);
    }
  }, [currentStep, generatedStory]);

  useEffect(() => {
    if (currentStep === 5 && generatedStory && generatedStory.illustrations && generatedStory.illustrations.length > 0 && !generatedStory.illustrations[0]?.url && !generateIllustrationsMutation.isPending) {
      // Auto-start illustration generation when reaching step 5
      generateIllustrationsMutation.mutate();
    }
  }, [currentStep, generatedStory]);

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

  if (currentStep === 4) {
    return (
      <div className="space-y-6">
        {/* Selected Options Summary */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="font-semibold text-gray-900 mb-4">선택한 옵션</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">감정: </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {emotions.map(emotion => (
                  <Badge key={emotion} variant="secondary">
                    {getEmotionDisplay(emotion)}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">스타일: </span>
              <Badge className="ml-2">{getStyleDisplay(illustrationStyle)}</Badge>
            </div>
          </div>
        </Card>

        {/* Generation Progress */}
        {generateStoryMutation.isPending && (
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <h3 className="font-semibold text-gray-900">AI가 동화를 생성하고 있습니다...</h3>
            </div>
            
            <Progress value={generationProgress} className="mb-4" />
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>{currentTask}</span>
              </div>
              <p className="text-xs text-gray-500">
                완성까지 2-3분 정도 소요될 수 있습니다. 잠시만 기다려주세요.
              </p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {generateStoryMutation.isError && (
          <Card className="p-6 border-red-200 bg-red-50">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">생성 중 오류가 발생했습니다</h3>
            </div>
            <p className="text-sm text-red-700 mb-4">
              {generateStoryMutation.error instanceof Error 
                ? generateStoryMutation.error.message 
                : "알 수 없는 오류가 발생했습니다."}
            </p>
            <Button 
              onClick={() => generateStoryMutation.mutate()}
              className="bg-red-600 hover:bg-red-700"
            >
              다시 시도
            </Button>
          </Card>
        )}

        {/* Success State */}
        {generatedStory && (
          <Card className="p-6 border-green-200 bg-green-50">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">스토리 생성 완료!</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">제목</h4>
                <p className="text-gray-700">{generatedStory.title}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">스토리 미리보기</h4>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {generatedStory.story ? generatedStory.story.substring(0, 200) : "스토리를 불러오는 중..."}...
                </p>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={onShowPreview} variant="outline" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  미리보기
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  }

  if (currentStep === 5) {
    return (
      <div className="space-y-6">
        {generatedStory ? (
          <>
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">일러스트 생성 현황</h3>
              
              <div className="grid gap-4">
                {generatedStory.illustrations && generatedStory.illustrations.length > 0 ? generatedStory.illustrations.map((illustration, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {illustration.url ? (
                        <img 
                          src={illustration.url} 
                          alt={illustration.description}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Palette className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        페이지 {illustration.page}
                      </p>
                      <p className="text-sm text-gray-600">
                        {illustration.description}
                      </p>
                    </div>
                    
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                )) : (
                  <div className="text-center text-gray-500">
                    <Palette className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>일러스트가 준비되지 않았습니다.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex gap-2">
                <Button onClick={onShowPreview} variant="outline" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  미리보기
                </Button>
                
                <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded flex items-center">
                  📚 일러스트 재생성 불가 - 토큰 절약
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card className="p-6">
            <div className="text-center">
              <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">먼저 스토리를 생성해주세요.</p>
            </div>
          </Card>
        )}
      </div>
    );
  }

  if (currentStep === 6) {
    return (
      <div className="space-y-6">
        {generatedStory ? (
          <>
            <Card className="p-6 text-center bg-gradient-to-r from-green-50 to-blue-50">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                축하합니다! 🎉
              </h3>
              <p className="text-gray-600 mb-2">
                "{generatedStory.title}" 그림책이 완성되었습니다!
              </p>
              <p className="text-sm text-gray-600 mb-6">
                갤러리에 공유하지 않으면 동화가 사라져요. 어떻게 하시겠어요?
              </p>
              
              <div className="space-y-4">
                {/* 미리보기 버튼 */}
                <div className="flex justify-center">
                  <Button 
                    onClick={onShowPreview}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    동화 미리보기
                  </Button>
                </div>

                {/* 메인 선택 */}
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-700 mb-4 text-center">선택해주세요</p>
                  <div className="flex flex-col gap-3 max-w-md mx-auto">
                    <Button 
                      onClick={handlePublishToGallery}
                      disabled={isPublishing}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 h-12"
                    >
                      {isPublishing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      )}
                      갤러리에 공유하기
                    </Button>
                    
                    <Button 
                      onClick={handleDeleteClick}
                      disabled={isDeleting}
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50 flex items-center justify-center gap-2 h-12"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      공유하지 않고 삭제
                    </Button>

                    <Button 
                      onClick={() => window.location.href = '/gallery'}
                      variant="ghost"
                      className="text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 h-10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      다른 작품들 둘러보기
                    </Button>
                  </div>
                </div>

                {/* 삭제 확인 다이얼로그 */}
                {showDeleteConfirm && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5C3.498 16.333 4.46 18 6 18z" />
                      </svg>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-red-800 mb-2">
                          정말 삭제하시겠어요?
                        </h4>
                        <p className="text-sm text-red-700 mb-3">
                          "{generatedStory?.title}" 동화가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없어요.
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            onClick={confirmDelete}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            네, 삭제할게요
                          </Button>
                          <Button 
                            onClick={cancelDelete}
                            size="sm"
                            variant="outline"
                            className="text-gray-700"
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">작품 정보</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">제목:</span>
                  <span className="font-medium">{generatedStory.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">감정:</span>
                  <span>{emotions.map(getEmotionDisplay).join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">스타일:</span>
                  <span>{getStyleDisplay(illustrationStyle)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">일러스트:</span>
                  <span>{generatedStory.illustrations.length}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">생성 시간:</span>
                  <span>{generatedStory.createdAt ? new Date(generatedStory.createdAt).toLocaleDateString() : '방금 전'}</span>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card className="p-6">
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">먼저 동화를 생성해주세요.</p>
            </div>
          </Card>
        )}
      </div>
    );
  }

  return null;
}
