import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        style={{
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)'
        }}
      >
        <img 
          src="https://cdn.poehali.dev/files/IMG_20251115_140800_058.png" 
          alt="ПИИ" 
          className="w-10 h-10 object-contain"
        />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-4xl h-[80vh] m-4 bg-card/95 border-cyan-500/50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://cdn.poehali.dev/files/IMG_20251115_140800_058.png" 
                  alt="ПИИ" 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h2 className="text-2xl font-bold glow-cyan">ПИИ</h2>
                  <p className="text-sm text-muted-foreground">Персональный ИИ-ассистент Dark Haven</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hover:bg-accent"
              >
                <Icon name="X" size={24} />
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden p-4" id="timeweb-chat-container">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-4">
                  <Icon name="Bot" size={48} className="mx-auto text-cyan-500" />
                  <p>Загрузка ИИ-ассистента...</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default AIChat;
