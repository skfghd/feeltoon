import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Flame, 
  Frown, 
  CloudRain, 
  Star, 
  Heart, 
  Smile,
  X
} from "lucide-react";

interface EmotionSelectorProps {
  selectedEmotions: string[];
  onEmotionsChange: (emotions: string[]) => void;
}

const emotions = [
  {
    id: "anger",
    name: "분노",
    description: "강렬하고 열정적인 이야기",
    icon: Flame,
    color: "bg-red-600",
    lightColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  {
    id: "frustration",
    name: "좌절",
    description: "극복과 성장의 이야기",
    icon: Frown,
    color: "bg-orange-600",
    lightColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    id: "sadness",
    name: "우울",
    description: "깊이 있고 감성적인 이야기",
    icon: CloudRain,
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "excitement",
    name: "흥분",
    description: "모험과 발견의 이야기",
    icon: Star,
    color: "bg-yellow-600",
    lightColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  {
    id: "love",
    name: "사랑",
    description: "따뜻하고 감동적인 이야기",
    icon: Heart,
    color: "bg-pink-600",
    lightColor: "bg-pink-50",
    borderColor: "border-pink-200",
  },
  {
    id: "joy",
    name: "기쁨",
    description: "밝고 유쾌한 이야기",
    icon: Smile,
    color: "bg-green-600",
    lightColor: "bg-green-50",
    borderColor: "border-green-200",
  },
];

export default function EmotionSelector({ selectedEmotions, onEmotionsChange }: EmotionSelectorProps) {
  const handleEmotionToggle = (emotionId: string) => {
    if (selectedEmotions.includes(emotionId)) {
      onEmotionsChange(selectedEmotions.filter(id => id !== emotionId));
    } else {
      onEmotionsChange([...selectedEmotions, emotionId]);
    }
  };

  const handleClearAll = () => {
    onEmotionsChange([]);
  };

  const removeEmotion = (emotionId: string) => {
    onEmotionsChange(selectedEmotions.filter(id => id !== emotionId));
  };

  return (
    <div>
      {/* Emotion Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8">
        {emotions.map((emotion) => {
          const isSelected = selectedEmotions.includes(emotion.id);
          const IconComponent = emotion.icon;
          
          return (
            <Card
              key={emotion.id}
              className={`emotion-card border-2 ${emotion.borderColor} p-3 sm:p-4 md:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                isSelected ? 'selected' : ''
              }`}
              onClick={() => handleEmotionToggle(emotion.id)}
            >
              <div className="text-center">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${isSelected ? emotion.color : emotion.lightColor} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4`}>
                  <IconComponent className={`text-lg sm:text-xl md:text-2xl ${isSelected ? 'text-white' : emotion.color.replace('bg-', 'text-')}`} />
                </div>
                <h3 className="font-medium sm:font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{emotion.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-tight">{emotion.description}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Selected Emotions Display */}
      <Card className="bg-gray-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">선택된 감정</h3>
          {selectedEmotions.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-gray-500 hover:text-gray-700">
              모두 지우기
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedEmotions.length > 0 ? (
            selectedEmotions.map((emotionId) => {
              const emotion = emotions.find(e => e.id === emotionId);
              if (!emotion) return null;
              
              return (
                <Badge
                  key={emotionId}
                  className={`${emotion.color} text-white hover:${emotion.color}/90 cursor-pointer flex items-center gap-1`}
                  onClick={() => removeEmotion(emotionId)}
                >
                  {emotion.name}
                  <X className="w-3 h-3" />
                </Badge>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">선택된 감정이 없습니다.</p>
          )}
        </div>
        
        {selectedEmotions.length > 0 && (
          <p className="text-sm text-gray-600">
            선택한 감정들이 조화롭게 어우러진 동화가 만들어집니다.
          </p>
        )}
      </Card>
    </div>
  );
}
