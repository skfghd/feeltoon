import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const footerLinks = [
    { name: "사이트 소개", url: "https://kindtoolai.replit.app/about" },
    { name: "면책조항", url: "https://kindtoolai.replit.app/disclaimer" },
    { name: "개인정보처리방침", url: "https://kindtoolai.replit.app/privacy-policy" },
    { name: "이용약관", url: "https://kindtoolai.replit.app/terms-of-service" },
    { name: "문의하기", url: "https://kindtoolai.replit.app/contact" }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            {footerLinks.map((link, index) => (
              <div key={link.name} className="flex items-center">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {link.name}
                </a>
                {index < footerLinks.length - 1 && (
                  <div className="hidden sm:block ml-4 sm:ml-6 h-4 w-px bg-gray-300" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 text-xs text-gray-500">
            © 2025 KindTool.ai - All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}