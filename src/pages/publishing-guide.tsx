import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Banknote, 
  Users, 
  AlertTriangle, 
  ExternalLink, 
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  FileText,
  Building,
  Printer
} from "lucide-react";
import Footer from "@/components/footer";

export default function PublishingGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <BookOpen className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">그림책 출판 가이드</h1>
                <p className="text-sm text-gray-500">AI로 만든 그림책을 실제 출판하는 방법</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2"
            >
              <span>돌아가기</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-2">⚠️ 중요 안내사항</p>
                <div className="space-y-2">
                  <p>
                    <strong>이 가이드는 일반적인 정보 제공 목적으로만 작성되었습니다.</strong> 
                    출판과 관련된 구체적인 법적, 재정적, 사업적 조언을 대체하지 않습니다.
                  </p>
                  <p>
                    <strong>실제 출판 진행 전 반드시:</strong>
                  </p>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>각 플랫폼의 공식 웹사이트에서 최신 정보와 정확한 조건을 확인하세요</li>
                    <li>전문가(변호사, 세무사, 출판 컨설턴트)와 상담하세요</li>
                    <li>모든 비용, 수수료, 절차는 예고없이 변경될 수 있습니다</li>
                    <li>저작권, 계약 조건, 세무 처리 등은 개별 상황에 따라 다를 수 있습니다</li>
                  </ul>
                  <p className="mt-2">
                    <strong>본 정보 이용으로 인한 어떠한 손실이나 피해에 대해서도 당사는 일체 책임지지 않습니다.</strong>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="overview">출판 방법</TabsTrigger>
            <TabsTrigger value="platforms">플랫폼 비교</TabsTrigger>
            <TabsTrigger value="process">단계별 프로세스</TabsTrigger>
            <TabsTrigger value="costs">비용 가이드</TabsTrigger>
          </TabsList>

          {/* 출판 방법 개요 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* POD 출판 */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-green-900">POD 주문형 출판</CardTitle>
                  </div>
                  <Badge className="bg-green-100 text-green-800 w-fit">추천</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-green-800">
                    초기 비용 없이 주문 시에만 인쇄하는 방식으로 개인 작가에게 가장 적합합니다.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>초기 비용 부담 없음</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>재고 관리 불필요</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>온라인 서점 유통</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 독립출판 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    <CardTitle>독립출판 (자비출판)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    작가가 모든 과정을 직접 관리하는 방식으로 높은 자유도를 제공합니다.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                      <span>완전한 창작 자유도</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="w-4 h-4 rounded-full bg-orange-500"></span>
                      <span>초기 비용 발생 (금액은 업체별 상이)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="w-4 h-4 rounded-full bg-red-500"></span>
                      <span>복잡한 제작/유통 과정</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 기획출판 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <CardTitle>기획출판</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    출판사에 원고를 투고하여 채택되면 출판사가 모든 과정을 담당합니다.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>제작비 부담 없음</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>전문적 편집/마케팅</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="w-4 h-4 rounded-full bg-red-500"></span>
                      <span>채택 가능성 낮음</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 플랫폼 비교 */}
          <TabsContent value="platforms" className="space-y-6">
            <div className="grid gap-6">
              {/* 교보문고 바로출판 */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-blue-900">교보문고 바로출판 POD</CardTitle>
                      <CardDescription>온라인 출판 플랫폼 (조건 확인 필요)</CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">조건 확인</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">주요 특징</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• 기본 서비스 제공 (약관 확인 필요)</li>
                        <li>• 저작권료 지급 (비율은 약관 확인)</li>
                        <li>• ISBN 자동 발급</li>
                        <li>• 국립중앙도서관 납본 대행</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">유통 채널</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• 교보문고 온라인/오프라인</li>
                        <li>• 교보 eBook</li>
                        <li>• 네이버책, 다음책</li>
                        <li>• B2B 도서관</li>
                      </ul>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <a href="https://product.kyobobook.co.kr/pod" target="_blank" rel="noopener noreferrer">
                      교보문고 바로출판 바로가기 <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* 부크크 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>부크크 (BOOKK)</CardTitle>
                      <CardDescription>국내 대표 자가출판 플랫폼</CardDescription>
                    </div>
                    <Badge variant="outline">수수료 있음</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">주요 특징</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• 제작-납본-출판-유통 원스톱</li>
                        <li>• 1-2일 내 승인 완료</li>
                        <li>• 작가가 직접 가격 책정</li>
                        <li>• AI 기반 편집 도구</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">유통 채널</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• 교보문고, YES24, 알라딘</li>
                        <li>• 인터파크, 11번가</li>
                        <li>• 전국 독립서점</li>
                        <li>• 해외 아마존</li>
                      </ul>
                    </div>
                  </div>
                  <Button asChild className="w-full" variant="outline">
                    <a href="https://bookk.co.kr" target="_blank" rel="noopener noreferrer">
                      부크크 바로가기 <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* 북퍼브 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>북퍼브 (북셀프)</CardTitle>
                      <CardDescription>전문 편집서비스 제공</CardDescription>
                    </div>
                    <Badge variant="outline">유료 서비스</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">주요 특징</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• 원고교정 및 편집디자인</li>
                        <li>• ISBN 발급 대행</li>
                        <li>• 전문적인 인쇄 품질</li>
                        <li>• 맞춤형 출판 컨설팅</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">유통 채널</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• 대형서점 (교보, YES24 등)</li>
                        <li>• 전국 지역서점</li>
                        <li>• 전자책 서점</li>
                        <li>• 도서관 납품</li>
                      </ul>
                    </div>
                  </div>
                  <Button asChild className="w-full" variant="outline">
                    <a href="https://bookpub.co.kr" target="_blank" rel="noopener noreferrer">
                      북퍼브 바로가기 <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 단계별 프로세스 */}
          <TabsContent value="process" className="space-y-6">
            <div className="space-y-6">
              {/* 1단계 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <CardTitle>출판사 등록 (ISBN 발급을 위한 필수 과정)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">중요:</p>
                        <p>개인은 ISBN을 직접 발급받을 수 없습니다. 1인 출판사 등록이 필수입니다.</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        사업자등록
                      </h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• 관할 세무서에서 출판업 사업자등록</li>
                        <li>• 소요 시간: 즉시 발급</li>
                        <li>• 비용: 무료</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        출판사 신고
                      </h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• 관할 구청/시청에서 출판사 신고</li>
                        <li>• 소요 시간: 7일 내외</li>
                        <li>• 비용: 무료</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2단계 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <CardTitle>ISBN 발급</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">발행자번호 신청</h4>
                        <p className="text-sm text-gray-600">국립중앙도서관 서지정보유통지원시스템에서 신청 (2-3일 소요)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">ISBN 교육 이수</h4>
                        <p className="text-sm text-gray-600">온라인 사이버교육 (1시간 내외)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">도서번호(ISBN) 신청</h4>
                        <p className="text-sm text-gray-600">책 정보 입력 후 신청 (2-3일 소요)</p>
                      </div>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <a href="https://www.nl.go.kr/seoji/" target="_blank" rel="noopener noreferrer">
                      ISBN 신청 사이트 바로가기 <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* 3단계 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <CardTitle>원고 준비 및 편집</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">파일 준비</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• PDF 형식 (인쇄용 CMYK)</li>
                        <li>• 재단선 포함 설정</li>
                        <li>• 고해상도 (300dpi 이상)</li>
                        <li>• 표지와 본문 파일 분리</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">편집 포인트</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• 판형(크기) 결정</li>
                        <li>• 여백 및 레이아웃 설정</li>
                        <li>• 폰트 임베딩 확인</li>
                        <li>• 색상 교정</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4단계 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <CardTitle>플랫폼 등록 및 출간</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">파일 업로드</h4>
                      <p className="text-sm text-gray-600 mb-2">선택한 플랫폼에 편집 완료된 파일을 업로드합니다.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">도서 정보 입력</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• 제목, 저자명, 출판사명</li>
                        <li>• 책 소개글 (상세하고 매력적으로)</li>
                        <li>• 카테고리 및 키워드</li>
                        <li>• 가격 설정</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">검수 및 승인</h4>
                      <p className="text-sm text-gray-600">플랫폼별 검수 과정을 거친 후 판매 시작됩니다.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 비용 가이드 */}
          <TabsContent value="costs" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* 무료 옵션 */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-900 flex items-center">
                    <Banknote className="w-5 h-5 mr-2" />
                    POD 출판 (기본형)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-green-800">교보문고 바로출판</h4>
                      <p className="text-sm text-green-700">기본 서비스 제공 (최신 약관 확인 필요)</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800">부크크 기본 서비스</h4>
                      <p className="text-sm text-green-700">기본 서비스 제공 (수수료 정책 확인 필요)</p>
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">추천 대상</p>
                    <p className="text-xs text-green-700">첫 출간이나 테스트 출간을 원하는 경우</p>
                  </div>
                </CardContent>
              </Card>

              {/* 유료 독립출판 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Printer className="w-5 h-5 mr-2" />
                    독립출판 비용 항목
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <p className="text-xs text-yellow-800">
                        <strong>주의:</strong> 아래 비용은 일반적인 예시이며, 업체와 서비스에 따라 크게 다를 수 있습니다. 
                        정확한 견적은 각 업체에 직접 문의하세요.
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">소량인쇄 (100부)</span>
                      <span className="text-sm font-medium">업체별 상이</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">편집디자인</span>
                      <span className="text-sm font-medium">업체별 상이</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">ISBN 발급</span>
                      <span className="text-sm font-medium">업체별 상이</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">마케팅/홍보</span>
                      <span className="text-sm font-medium">업체별 상이</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-medium">
                        <span>총 예상 비용</span>
                        <span className="text-red-600">업체별 견적 필요</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 마케팅 전략 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  마케팅 및 판매 전략
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">SNS 마케팅</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• 제작 과정 공유</li>
                      <li>• 인스타그램 릴스 활용</li>
                      <li>• 유튜브 북트레일러</li>
                      <li>• 독자 소통 강화</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">온라인 최적화</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• 키워드 최적화</li>
                      <li>• 매력적인 책 소개글</li>
                      <li>• 미리보기 퀄리티</li>
                      <li>• 리뷰 관리</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">오프라인 활동</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• 독립서점 입점</li>
                      <li>• 북페어 참가</li>
                      <li>• 작가 토크쇼</li>
                      <li>• 워크샵 개최</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}