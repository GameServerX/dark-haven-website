import { useEffect } from 'react';
import { Card } from '@/components/ui/card';

const AIChatSection = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://timeweb.cloud/api/v1/cloud-ai/agents/a26d62cb-d2f5-437b-b097-8d32f04e6dec/embed.js?collapsed=false';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      const chatWidget = document.querySelector('[data-timeweb-chat]');
      if (chatWidget) {
        chatWidget.remove();
      }
    };
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <img 
            src="https://cdn.poehali.dev/files/IMG_20251115_140800_058.png" 
            alt="ПИИ" 
            className="w-16 h-16 object-contain"
          />
          <div>
            <h2 className="text-4xl font-bold glow-cyan mb-2">ПИИ</h2>
            <p className="text-muted-foreground">Персональный ИИ-ассистент Dark Haven</p>
          </div>
        </div>
      </div>

      <Card className="bg-card/50 border-cyan-500/50 backdrop-blur-sm min-h-[600px] flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-24 h-24 mx-auto mb-6 animate-bounce">
            <img 
              src="https://cdn.poehali.dev/files/IMG_20251115_140800_058.png" 
              alt="ПИИ" 
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-muted-foreground text-lg">Загрузка ИИ-ассистента...</p>
          <p className="text-sm text-muted-foreground">Чат появится через несколько секунд</p>
        </div>
      </Card>
    </div>
  );
};

export default AIChatSection;
