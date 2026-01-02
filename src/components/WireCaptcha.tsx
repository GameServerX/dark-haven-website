import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WireCaptchaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Wire {
  id: string;
  color: string;
  label: string;
  leftConnected: boolean;
  rightConnected: boolean;
}

const WireCaptcha = ({ isOpen, onClose, onSuccess }: WireCaptchaProps) => {
  const [wires, setWires] = useState<Wire[]>([
    { id: 'gnd', color: '#10b981', label: 'GND', leftConnected: false, rightConnected: false },
    { id: 'sig', color: '#eab308', label: 'SIG', leftConnected: false, rightConnected: false },
    { id: 'vcc', color: '#f97316', label: 'VCC', leftConnected: false, rightConnected: false }
  ]);
  const [draggedWire, setDraggedWire] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setWires([
        { id: 'gnd', color: '#10b981', label: 'GND', leftConnected: false, rightConnected: false },
        { id: 'sig', color: '#eab308', label: 'SIG', leftConnected: false, rightConnected: false },
        { id: 'vcc', color: '#f97316', label: 'VCC', leftConnected: false, rightConnected: false }
      ]);
    }
  }, [isOpen]);

  const handleConnect = (wireId: string) => {
    setWires(prev => prev.map(wire => 
      wire.id === wireId 
        ? { ...wire, leftConnected: true, rightConnected: true }
        : wire
    ));
  };

  const handleVerify = () => {
    const allConnected = wires.every(wire => wire.leftConnected && wire.rightConnected);
    
    if (allConnected) {
      toast({
        title: 'Капча пройдена!',
        description: 'Добро пожаловать на борт станции',
      });
      onSuccess();
    } else {
      toast({
        title: 'Ошибка подключения',
        description: 'Соедините все провода правильно',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold glow-cyan">
            Восстановление энергосистемы
          </DialogTitle>
          <DialogDescription className="text-base">
            Соедините провода по цветам для доступа к системам станции
          </DialogDescription>
        </DialogHeader>

        <div className="py-8">
          <div className="bg-muted/30 rounded-lg p-6 border border-border">
            <div className="space-y-6">
              {wires.map(wire => (
                <div key={wire.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold cursor-pointer transition-all hover:scale-110"
                      style={{ 
                        borderColor: wire.color,
                        backgroundColor: wire.leftConnected ? wire.color : 'transparent',
                        color: wire.leftConnected ? '#000' : wire.color,
                        boxShadow: wire.leftConnected ? `0 0 20px ${wire.color}` : 'none'
                      }}
                      onClick={() => !wire.leftConnected && setDraggedWire(wire.id)}
                    >
                      {wire.label}
                    </div>
                    
                    <div className="flex-1 h-1 relative" style={{ width: '300px' }}>
                      <div 
                        className="absolute inset-0 rounded-full transition-all"
                        style={{ 
                          backgroundColor: wire.leftConnected && wire.rightConnected ? wire.color : '#374151',
                          boxShadow: wire.leftConnected && wire.rightConnected ? `0 0 10px ${wire.color}` : 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold cursor-pointer transition-all hover:scale-110"
                    style={{ 
                      borderColor: wire.color,
                      backgroundColor: wire.rightConnected ? wire.color : 'transparent',
                      color: wire.rightConnected ? '#000' : wire.color,
                      boxShadow: wire.rightConnected ? `0 0 20px ${wire.color}` : 'none'
                    }}
                    onClick={() => {
                      if (draggedWire === wire.id) {
                        handleConnect(wire.id);
                        setDraggedWire(null);
                      }
                    }}
                  >
                    {wire.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              {draggedWire ? (
                <p className="animate-pulse">Кликните на правый разъем того же цвета</p>
              ) : (
                <p>Кликните на левый разъем, затем на правый разъем того же цвета</p>
              )}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleVerify} 
          className="w-full animate-pulse-glow"
          size="lg"
        >
          Проверить подключение
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WireCaptcha;
