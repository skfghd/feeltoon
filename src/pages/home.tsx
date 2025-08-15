import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wand2, HelpCircle, ArrowLeft, ArrowRight, Play, Home as HomeIcon, BookOpen, ChevronLeft, ChevronRight, X } from "lucide-react";
import EmotionSelector from "@/components/emotion-selector";
import StyleSelector from "@/components/style-selector";
import PersonalizationOptions from "@/components/personalization-options";
import StoryGenerator from "@/components/story-generator";
import ProgressSidebar from "@/components/progress-sidebar";
import StoryPreviewModal from "@/components/story-preview-modal";
import Footer from "@/components/footer";
import UsageStatus from "@/components/usage-status";


export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [personalizationData, setPersonalizationData] = useState<any>({});
  const [generatedStory, setGeneratedStory] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showProgressSidebar, setShowProgressSidebar] = useState(false);


  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedEmotions.length > 0;
      case 2:
        return selectedStyle !== "";
      case 3:
        return true; // 개인화는 선택사항
      default:
        return true;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "1단계: 감정 스펙트럼 선택";
      case 2:
        return "2단계: 일러스트레이션 스타일 선택";
      case 3:
        return "3단계: 개인화 옵션 (선택사항)";
      case 4:
        return "4단계: 스토리 생성";
      case 5:
        return "5단계: 일러스트 생성";
      case 6:
        return "6단계: 완성 및 감상";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "동화에 담고 싶은 감정들을 선택해주세요. 여러 감정을 조합할 수 있습니다.";
      case 2:
        return "동화책의 일러스트레이션 스타일을 선택해주세요.";
      case 3:
        return "더 개인적인 이야기를 위한 선택사항을 입력해주세요. 건너뛰어도 됩니다. ⚠️ 생성된 동화는 자동으로 공유 갤러리에 공개됩니다.";
      case 4:
        return "선택한 감정과 스타일, 개인화 정보로 AI가 맞춤형 동화를 생성합니다.";
      case 5:
        return "스토리에 맞는 아름다운 일러스트레이션을 생성합니다.";
      case 6:
        return "완성된 그림책을 감상하고 공유 갤러리에서 다른 사람들과 공유하세요.";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-y-auto">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                <Wand2 className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">나만의 그림책</h1>
                <p className="text-sm text-gray-500">AI로 만드는 나만의 감정 동화</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Progress Toggle Button - Only show on desktop */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProgressSidebar(!showProgressSidebar)}
                className="hidden lg:flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                {showProgressSidebar ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span>{showProgressSidebar ? '진행률 숨기기' : '진행률 보기'}</span>
              </Button>
              <div className="hidden sm:flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = '/publishing-guide'}
                  className="flex items-center space-x-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>출판 가이드</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.open('https://kindtool.ai/', '_blank')}
                  className="flex items-center space-x-2"
                >
                  <HomeIcon className="w-5 h-5" />
                  <span>홈으로</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="w-5 h-5" />
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => window.location.href = '/gallery'}
                >
                  공유 갤러리
                </Button>
              </div>

              {/* Mobile Menu */}
              <div className="sm:hidden">
                <Button 
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => window.location.href = '/gallery'}
                >
                  갤러리
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className={`grid grid-cols-1 ${showProgressSidebar ? 'lg:grid-cols-4' : 'lg:grid-cols-1'} gap-4 sm:gap-8 transition-all duration-300`}>

            {/* Sidebar Navigation - Hidden on mobile by default */}
            {showProgressSidebar && (
              <div className="hidden lg:block lg:col-span-1 order-2 lg:order-1">
                <div className="lg:sticky lg:top-24">
                  <div className="relative">
                    <ProgressSidebar currentStep={currentStep} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowProgressSidebar(false)}
                      className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 shadow-md flex z-10"
                      title="진행률 숨기기"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className={`${showProgressSidebar ? 'lg:col-span-3' : 'lg:col-span-1'} order-1 lg:order-2 transition-all duration-300 min-w-0`}>
            <Card className="bg-white rounded-2xl shadow-xl overflow-hidden relative">

              {/* Step Header */}
              <div className="bg-gradient-to-r from-primary to-purple-600 p-4 sm:p-6 text-white relative">
                {!showProgressSidebar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProgressSidebar(true)}
                    className="absolute right-4 top-4 text-white hover:bg-white/20 hidden lg:flex items-center z-10"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    진행률 보기
                  </Button>
                )}
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{getStepTitle()}</h2>
                <p className="text-purple-100 text-sm sm:text-base">{getStepDescription()}</p>
              </div>

              {/* Step Content */}
              <div className="p-4 sm:p-6 md:p-8">
                {currentStep === 1 && (
                  <EmotionSelector
                    selectedEmotions={selectedEmotions}
                    onEmotionsChange={setSelectedEmotions}
                  />
                )}

                {currentStep === 2 && (
                  <StyleSelector
                    selectedStyle={selectedStyle}
                    onStyleChange={setSelectedStyle}
                  />
                )}

                {currentStep === 3 && (
                  <PersonalizationOptions
                    onComplete={(data) => {
                      setPersonalizationData(data);
                      handleNext();
                    }}
                    onBack={handlePrevious}
                  />
                )}

                {(currentStep === 4 || currentStep === 5 || currentStep === 6) && (
                  <StoryGenerator
                    emotions={selectedEmotions}
                    illustrationStyle={selectedStyle}
                    personalizationData={personalizationData}
                    currentStep={currentStep}
                    onStoryGenerated={setGeneratedStory}
                    generatedStory={generatedStory}
                    onShowPreview={() => setShowPreview(true)}
                  />
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 bg-white relative z-10">
                  <Button 
                    variant="ghost" 
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>이전 단계</span>
                  </Button>

                  {currentStep < 6 && currentStep !== 3 ? (
                    <div className="flex flex-col items-end">
                      <Button 
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                      >
                        <span>
                          {currentStep === 1 ? "다음 단계: 스타일 선택" :
                           currentStep === 2 ? "다음 단계: 개인화 (선택)" :
                           currentStep === 4 ? (generatedStory ? "동화 완성본 확인하기" : "다음 단계: 일러스트 생성") :
                           "다음 단계: 완성"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      {currentStep === 4 && generatedStory && (
                        <p className="text-xs text-gray-500 mt-1 text-right">
                          생성된 동화와 일러스트를 확인합니다
                        </p>
                      )}
                    </div>
                  ) : currentStep === 6 ? (
                    <div className="flex flex-col items-end">
                      <Button 
                        onClick={() => setShowPreview(true)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                      >
                        <span>완성된 그림책 보기</span>
                        <Play className="w-4 h-4" />
                      </Button>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        모든 창작이 완료되었습니다
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </Card>
            </div>
          </div>
      </div>

      {/* Floating Progress Bar */}
      <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">창작 진행률</span>
              <span className="text-sm text-gray-500">{currentStep}/6</span>
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-gradient-to-r from-primary to-purple-600 rounded-full transition-all duration-300" 
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
          </div>
          <Button 
            size="sm" 
            className="w-10 h-10 bg-primary rounded-full p-0 hover:bg-primary/90"
            onClick={() => setShowPreview(true)}
            disabled={!generatedStory}
          >
            <Play className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Story Preview Modal */}
      {showPreview && generatedStory && (
        <StoryPreviewModal
          fairyTale={generatedStory}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Usage Status above Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-center">
          <UsageStatus />
        </div>
      </div>

      <Footer />
    </div>
  );
}