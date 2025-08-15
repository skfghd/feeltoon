import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Eye, EyeOff, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { validateApiKey, encryptApiKey } from "@/lib/security";

interface ApiKeyInputProps {
  onApiKeySet: (apiKeys: { openai?: string; google?: string; provider: 'openai' | 'google' }) => void;
  isValid?: boolean;
}

export default function ApiKeyInput({ onApiKeySet, isValid }: ApiKeyInputProps) {
  const [openaiKey, setOpenaiKey] = useState("");
  const [googleKey, setGoogleKey] = useState("");
  const [activeProvider, setActiveProvider] = useState<'openai' | 'google'>('openai');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async () => {
    const currentKey = activeProvider === 'openai' ? openaiKey : googleKey;
    if (!currentKey.trim()) return;
    
    setIsValidating(true);
    try {
      // API 키 보안 검증
      if (validateApiKey(currentKey.trim(), activeProvider)) {
        // API 키 암호화하여 전달
        const encryptedKey = encryptApiKey(currentKey.trim());
        onApiKeySet({
          [activeProvider]: encryptedKey,
          provider: activeProvider
        });
      } else {
        throw new Error(`올바른 ${activeProvider === 'openai' ? 'OpenAI' : 'Google'} API 키 형식이 아닙니다.`);
      }
    } catch (error) {
      console.error('API 키 검증 실패:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const currentKey = activeProvider === 'openai' ? openaiKey : googleKey;
  const setCurrentKey = activeProvider === 'openai' ? setOpenaiKey : setGoogleKey;

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>AI API 키 필요</CardTitle>
        <CardDescription>
          동화 생성을 위해 AI API 키를 입력해주세요.
          <br />
          🔒 키는 암호화되어 브라우저 메모리에만 저장되며 절대 유출되지 않습니다.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={activeProvider} onValueChange={(value) => setActiveProvider(value as 'openai' | 'google')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="google">Google AI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="openai" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="openaiKey">OpenAI API 키</Label>
              <div className="text-xs text-gray-600">
                • GPT-4o로 스토리 생성
                • DALL-E 3로 일러스트 생성
                • 형식: sk-...
              </div>
              <div className="relative">
                <Input
                  id="openaiKey"
                  type={showApiKey ? "text" : "password"}
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="google" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="googleKey">Google AI API 키</Label>
              <div className="text-xs text-gray-600">
                • Gemini로 스토리 생성
                • Imagen으로 일러스트 생성
                • 형식: AIza...
              </div>
              <div className="relative">
                <Input
                  id="googleKey"
                  type={showApiKey ? "text" : "password"}
                  value={googleKey}
                  onChange={(e) => setGoogleKey(e.target.value)}
                  placeholder="AIza..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">🔒 최고 수준 보안</p>
              <ul className="text-xs space-y-1">
                <li>• 키는 암호화되어 메모리에만 저장</li>
                <li>• 서버로 절대 전송되지 않음</li>
                <li>• 네트워크 모니터링으로 유출 방지</li>
                <li>• 페이지 종료 시 자동 메모리 정리</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">API 키 발급</p>
              <div className="text-xs space-y-1">
                <p>• OpenAI: <a href="https://platform.openai.com/api-keys" target="_blank" className="underline">platform.openai.com</a></p>
                <p>• Google AI: <a href="https://makersuite.google.com/app/apikey" target="_blank" className="underline">makersuite.google.com</a></p>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!currentKey.trim() || isValidating}
          className="w-full"
        >
          {isValidating ? "🔒 보안 검증 중..." : `${activeProvider === 'openai' ? 'OpenAI' : 'Google AI'} 키 설정`}
        </Button>
      </CardContent>
    </Card>
  );
}