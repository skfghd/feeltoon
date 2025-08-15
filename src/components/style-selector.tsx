import { Card } from "@/components/ui/card";
import fantasyImage from "@assets/판타지 몽환적_1754122616022.png";
import traditionalImage from "@assets/전통 동화책_1754122616021.png";
import modernImage from "@assets/모던 그림책_1754122616022.png";
import photographicImage from "@assets/사진적 무드_1754122616021.png";
import collageImage from "@assets/콜라주_1754122616021.png";
import experimentalImage from "@assets/실험적 스타일_1754123703794.png";

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

const styles = [
  {
    id: "fantasy",
    name: "판타지 몽환적",
    description: "꿈같고 신비로운 분위기",
    borderColor: "border-purple-200",
    bgColor: "bg-purple-50",
    colors: { primary: "#8b5cf6", secondary: "#ec4899", accent: "#fbbf24" },
    image: fantasyImage
  },
  {
    id: "traditional",
    name: "전통 동화책",
    description: "클래식한 동화 일러스트",
    borderColor: "border-amber-200",
    bgColor: "bg-amber-50",
    colors: { primary: "#dc2626", secondary: "#f59e0b", accent: "#10b981" },
    image: traditionalImage
  },
  {
    id: "picturebook",
    name: "모던 그림책",
    description: "현대적이고 밝은 스타일",
    borderColor: "border-green-200",
    bgColor: "bg-green-50",
    colors: { primary: "#059669", secondary: "#3b82f6", accent: "#f59e0b" },
    image: modernImage
  },
  {
    id: "photographic",
    name: "사진적 무드",
    description: "사실적이고 감성적인 분위기",
    borderColor: "border-blue-200",
    bgColor: "bg-blue-50",
    colors: { primary: "#4b5563", secondary: "#6b7280", accent: "#9ca3af" },
    image: photographicImage
  },
  {
    id: "collage",
    name: "콜라주",
    description: "독창적이고 예술적인 스타일",
    borderColor: "border-pink-200",
    bgColor: "bg-pink-50",
    colors: { primary: "#ea580c", secondary: "#dc2626", accent: "#7c3aed" },
    image: collageImage
  },
  {
    id: "experimental",
    name: "실험적 스타일",
    description: "형식의 경계를 허무는 실험적 그림책 스타일",
    borderColor: "border-red-200",
    bgColor: "bg-red-50",
    colors: { primary: "#7c3aed", secondary: "#8b5cf6", accent: "#ec4899" },
    image: experimentalImage
  },
];

// SVG 일러스트 생성 함수
function generateStylePreview(style: any) {
  const { primary, secondary, accent } = style.colors;
  
  let elements = '';
  switch (style.id) {
    case 'fantasy':
      elements = `
        <circle cx="60" cy="60" r="20" fill="${primary}" opacity="0.6"/>
        <circle cx="140" cy="80" r="15" fill="${secondary}" opacity="0.7"/>
        <path d="M20 120 Q100 80 180 120" stroke="${accent}" stroke-width="3" fill="none"/>
        <polygon points="100,50 110,30 120,50" fill="${accent}"/>
      `;
      break;
    case 'traditional':
      elements = `
        <rect x="40" y="40" width="30" height="50" fill="${primary}" opacity="0.5"/>
        <rect x="100" y="30" width="25" height="60" fill="${secondary}" opacity="0.6"/>
        <rect x="140" y="45" width="35" height="45" fill="${accent}" opacity="0.4"/>
        <circle cx="100" cy="100" r="8" fill="${primary}"/>
      `;
      break;
    case 'picturebook':
      elements = `
        <ellipse cx="80" cy="70" rx="25" ry="15" fill="${primary}" opacity="0.6"/>
        <ellipse cx="120" cy="50" rx="20" ry="25" fill="${secondary}" opacity="0.5"/>
        <path d="M40 100 Q100 70 160 100" stroke="${accent}" stroke-width="4" fill="none"/>
      `;
      break;
    case 'photographic':
      elements = `
        <rect x="50" y="40" width="100" height="60" fill="${primary}" opacity="0.3"/>
        <circle cx="100" cy="70" r="15" fill="${secondary}" opacity="0.6"/>
        <line x1="30" y1="110" x2="170" y2="110" stroke="${accent}" stroke-width="2"/>
      `;
      break;
    case 'collage':
      elements = `
        <polygon points="60,40 80,30 100,60 70,80" fill="${primary}" opacity="0.5"/>
        <circle cx="130" cy="60" r="18" fill="${secondary}" opacity="0.6"/>
        <rect x="40" y="90" width="120" height="15" fill="${accent}" opacity="0.4"/>
      `;
      break;
    case 'experimental':
      elements = `
        <path d="M50 40 L80 70 L120 50 L150 80 L100 100 Z" fill="${primary}" opacity="0.5"/>
        <circle cx="70" cy="80" r="12" fill="${secondary}" opacity="0.7"/>
        <rect x="110" y="70" width="20" height="20" fill="${accent}" opacity="0.6" transform="rotate(45 120 80)"/>
      `;
      break;
    default:
      elements = `<circle cx="100" cy="70" r="30" fill="${primary}" opacity="0.5"/>`;
  }
  
  const svgContent = `
    <svg width="200" height="120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-${style.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primary};stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:${secondary};stop-opacity:0.05" />
        </linearGradient>
      </defs>
      <rect width="200" height="120" fill="white"/>
      <rect width="200" height="120" fill="url(#bg-${style.id})"/>
      ${elements}
      <rect width="200" height="120" fill="none" stroke="${primary}" stroke-width="1" opacity="0.3"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svgContent)}`
}

export default function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">일러스트레이션 스타일을 선택하세요</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {styles.map((style) => {
          const isSelected = selectedStyle === style.id;
          
          return (
            <Card
              key={style.id}
              className={`style-card border-2 ${style.borderColor} rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                isSelected ? 'selected ring-4 ring-primary ring-opacity-50' : ''
              } ${isSelected ? style.bgColor : ''}`}
              onClick={() => onStyleChange(style.id)}
            >
              <div className="aspect-video overflow-hidden bg-gray-50 flex items-center justify-center">
                <img 
                  src={style.image} 
                  alt={style.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-3 sm:p-4">
                <h4 className="font-medium sm:font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{style.name}</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-tight">{style.description}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedStyle && (
        <Card className="mt-6 p-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-primary font-medium">
            선택된 스타일: {styles.find(s => s.id === selectedStyle)?.name}
          </p>
        </Card>
      )}
    </div>
  );
}
