import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Circle,
  Heart,
  Palette,
  BookOpen,
  Image,
  Eye,
  Lightbulb
} from "lucide-react";

interface ProgressSidebarProps {
  currentStep: number;
}

const steps = [
  {
    id: 1,
    title: "감정 선택",
    icon: Heart,
  },
  {
    id: 2,
    title: "스타일 선택", 
    icon: Palette,
  },
  {
    id: 3,
    title: "개인화 (선택)",
    icon: Lightbulb,
  },
  {
    id: 4,
    title: "스토리 생성",
    icon: BookOpen,
  },
  {
    id: 5,
    title: "일러스트 생성",
    icon: Image,
  },
  {
    id: 6,
    title: "완성 및 감상",
    icon: Eye,
  },
];

export default function ProgressSidebar({ currentStep }: ProgressSidebarProps) {
  return (
    <Card className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">창작 단계</h2>
      
      <nav className="space-y-2 sm:space-y-3">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const IconComponent = step.icon;
          
          return (
            <div
              key={step.id}
              className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 border-primary/20' 
                  : isCompleted
                  ? 'bg-green-50 border-green-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                isActive 
                  ? 'bg-primary text-white'
                  : isCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </div>
              
              <div className="flex-1">
                <div className={`text-sm sm:text-base font-medium ${
                  isActive 
                    ? 'text-primary' 
                    : isCompleted
                    ? 'text-green-700'
                    : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                {isCompleted && (
                  <Badge variant="secondary" className="text-xs mt-1">완료</Badge>
                )}
              </div>
            </div>
          );
        })}
      </nav>
    </Card>
  );
}
