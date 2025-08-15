import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { User, Heart, Sparkles, Target, ChevronLeft, ChevronRight } from "lucide-react";

interface PersonalizationData {
  characterName?: string;
  characterAge?: "어린이" | "청소년" | "성인";
  characterGender?: "남성" | "여성" | "상관없음";
  favoriteAnimal?: string;
  favoriteColor?: string;
  hobbies?: string;
  interests?: string;
  specialSituation?: string;
  favoriteThings?: string;
  dreamOrGoal?: string;
}

interface PersonalizationOptionsProps {
  onComplete: (data: PersonalizationData) => void;
  onBack: () => void;
  isGenerating?: boolean;
}

export default function PersonalizationOptions({ onComplete, onBack, isGenerating }: PersonalizationOptionsProps) {
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData>({});

  const handleInputChange = (field: keyof PersonalizationData, value: string) => {
    setPersonalizationData(prev => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  const handleSelectChange = (field: keyof PersonalizationData, value: string) => {
    setPersonalizationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onComplete(personalizationData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary">나만의 특별한 이야기 만들기</h2>
        <p className="text-muted-foreground">
          더 개인적이고 특별한 동화를 만들기 위해 선택사항을 입력해주세요
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 주인공 설정 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-primary" />
              주인공 설정
            </CardTitle>
            <CardDescription>이야기의 주인공을 설정해주세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="characterName">주인공 이름 (선택)</Label>
              <Input
                id="characterName"
                placeholder="예: 지민이, 나"
                value={personalizationData.characterName || ""}
                onChange={(e) => handleInputChange("characterName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="characterAge">나이대 (선택)</Label>
              <Select onValueChange={(value) => handleSelectChange("characterAge", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="나이대를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="어린이">어린이</SelectItem>
                  <SelectItem value="청소년">청소년</SelectItem>
                  <SelectItem value="성인">성인</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="characterGender">성별 (선택)</Label>
              <Select onValueChange={(value) => handleSelectChange("characterGender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="성별을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="남성">남성</SelectItem>
                  <SelectItem value="여성">여성</SelectItem>
                  <SelectItem value="상관없음">상관없음</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 관심사와 취미 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-primary" />
              관심사와 취미
            </CardTitle>
            <CardDescription>좋아하는 것들을 알려주세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="favoriteAnimal">좋아하는 동물 (선택)</Label>
              <Input
                id="favoriteAnimal"
                placeholder="예: 고양이, 강아지, 토끼"
                value={personalizationData.favoriteAnimal || ""}
                onChange={(e) => handleInputChange("favoriteAnimal", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="favoriteColor">좋아하는 색깔 (선택)</Label>
              <Input
                id="favoriteColor"
                placeholder="예: 파란색, 분홍색, 무지개색"
                value={personalizationData.favoriteColor || ""}
                onChange={(e) => handleInputChange("favoriteColor", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hobbies">취미 (선택)</Label>
              <Input
                id="hobbies"
                placeholder="예: 그림 그리기, 축구, 독서"
                value={personalizationData.hobbies || ""}
                onChange={(e) => handleInputChange("hobbies", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="interests">관심사 (선택)</Label>
              <Input
                id="interests"
                placeholder="예: 우주, 음악, 요리"
                value={personalizationData.interests || ""}
                onChange={(e) => handleInputChange("interests", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 특별한 상황이나 메시지 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              특별한 상황
            </CardTitle>
            <CardDescription>현재 상황이나 전달하고 싶은 메시지</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="specialSituation">특별한 상황 (선택)</Label>
              <Textarea
                id="specialSituation"
                placeholder="예: 새 학교에 적응 중, 친구 사귀기가 어려워요"
                value={personalizationData.specialSituation || ""}
                onChange={(e) => handleInputChange("specialSituation", e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="favoriteThings">소중한 것들 (선택)</Label>
              <Textarea
                id="favoriteThings"
                placeholder="예: 가족, 친구, 우리 집 강아지"
                value={personalizationData.favoriteThings || ""}
                onChange={(e) => handleInputChange("favoriteThings", e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* 꿈과 목표 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-primary" />
              꿈과 목표
            </CardTitle>
            <CardDescription>이루고 싶은 꿈이나 목표</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="dreamOrGoal">꿈이나 목표 (선택)</Label>
              <Textarea
                id="dreamOrGoal"
                placeholder="예: 의사가 되고 싶어요, 세계 여행을 하고 싶어요"
                value={personalizationData.dreamOrGoal || ""}
                onChange={(e) => handleInputChange("dreamOrGoal", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          이전으로
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? "생성 중..." : "동화 생성하기"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}