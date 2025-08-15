import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Check, X, Eye, Trash2, Shield } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Footer from "@/components/footer";

interface FairyTale {
  id: string;
  title: string;
  emotions: string[];
  illustrationStyle: string;
  story: string;
  illustrations: { url: string; description: string; page: number }[];
  authorName: string | null;
  userId: string | null;
  isPublic: boolean;
  isApproved: boolean;
  createdAt: Date | null;
  pdfUrl: string | null;
}

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState("pending");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allTales = [], isLoading } = useQuery<FairyTale[]>({
    queryKey: ['/api/admin/fairy-tales'],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/admin/fairy-tales/${id}/approve`, 'PATCH');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/fairy-tales'] });
      toast({
        title: "승인 완료",
        description: "작품이 갤러리에 공개되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류",
        description: "승인 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/admin/fairy-tales/${id}/reject`, 'PATCH');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/fairy-tales'] });
      toast({
        title: "거부 완료",
        description: "작품이 비공개로 설정되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류",
        description: "거부 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/admin/fairy-tales/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/fairy-tales'] });
      toast({
        title: "삭제 완료",
        description: "작품이 영구적으로 삭제되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류",
        description: "삭제 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const pendingTales = allTales.filter(tale => tale.isPublic && !tale.isApproved);
  const approvedTales = allTales.filter(tale => tale.isPublic && tale.isApproved);
  const privateTales = allTales.filter(tale => !tale.isPublic);

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      '화남': 'bg-red-100 text-red-800',
      '슬픔': 'bg-blue-100 text-blue-800',
      '기쁨': 'bg-yellow-100 text-yellow-800',
      '사랑': 'bg-pink-100 text-pink-800',
      '우울': 'bg-gray-100 text-gray-800',
      '설렘': 'bg-purple-100 text-purple-800',
    };
    return colors[emotion] || 'bg-gray-100 text-gray-800';
  };

  const getStyleBadgeColor = (style: string) => {
    const colors: Record<string, string> = {
      '콜라주': 'bg-orange-100 text-orange-800',
      '사진풍': 'bg-green-100 text-green-800',
      '판타지': 'bg-purple-100 text-purple-800',
      '전통적': 'bg-amber-100 text-amber-800',
      '실험적': 'bg-cyan-100 text-cyan-800',
    };
    return colors[style] || 'bg-gray-100 text-gray-800';
  };

  const TaleCard = ({ tale, showActions = true }: { tale: FairyTale; showActions?: boolean }) => (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100">
        {tale.illustrations[0]?.url ? (
          <img 
            src={tale.illustrations[0].url} 
            alt={tale.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl">📚</div>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className={getStyleBadgeColor(tale.illustrationStyle)}>
            {tale.illustrationStyle}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {tale.title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-2">
          작가: {tale.authorName || '익명'}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {tale.emotions.map((emotion, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={`${getEmotionColor(emotion)} text-xs`}
            >
              {emotion}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {tale.story.slice(0, 80)}...
        </p>

        {showActions && (
          <div className="flex justify-between items-center">
            {selectedTab === "pending" && (
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => approveMutation.mutate(tale.id)}
                  disabled={approveMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-1" />
                  승인
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => rejectMutation.mutate(tale.id)}
                  disabled={rejectMutation.isPending}
                >
                  <X className="w-4 h-4 mr-1" />
                  거부
                </Button>
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => deleteMutation.mutate(tale.id)}
                disabled={deleteMutation.isPending}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {tale.createdAt && new Date(tale.createdAt).toLocaleDateString('ko-KR')}
          </p>
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>돌아가기</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-red-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">관리자 페이지</h1>
                  <p className="text-sm text-gray-500">그림책 콘텐츠 관리</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center space-x-2">
              <span>승인 대기</span>
              <Badge variant="secondary">{pendingTales.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center space-x-2">
              <span>승인됨</span>
              <Badge variant="secondary">{approvedTales.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center space-x-2">
              <span>비공개</span>
              <Badge variant="secondary">{privateTales.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingTales.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">승인 대기 중인 작품이 없습니다</h3>
                  <p className="text-gray-500">새로운 공유 요청이 있으면 여기에 표시됩니다.</p>
                </div>
              ) : (
                pendingTales.map((tale) => (
                  <TaleCard key={tale.id} tale={tale} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedTales.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">승인된 작품이 없습니다</h3>
                  <p className="text-gray-500">승인된 작품들이 여기에 표시됩니다.</p>
                </div>
              ) : (
                approvedTales.map((tale) => (
                  <TaleCard key={tale.id} tale={tale} showActions={false} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="private">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {privateTales.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">비공개 작품이 없습니다</h3>
                  <p className="text-gray-500">비공개로 설정된 작품들이 여기에 표시됩니다.</p>
                </div>
              ) : (
                privateTales.map((tale) => (
                  <TaleCard key={tale.id} tale={tale} showActions={false} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}