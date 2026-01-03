import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface LogoPosition {
  x: number;
  y: number;
  scale: number;
}

interface LogoEditorProps {
  isEditing: boolean;
}

const LogoEditor = ({ isEditing }: LogoEditorProps) => {
  const [config, setConfig] = useState<any>(null);
  const [position, setPosition] = useState<LogoPosition>({ x: 50, y: 20, scale: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('darkHavenSiteConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    const savedPosition = localStorage.getItem('darkHavenLogoPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditing) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !isEditing) return;
    
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    setPosition({ ...position, x, y });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      localStorage.setItem('darkHavenLogoPosition', JSON.stringify(position));
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, position]);

  const handleScaleChange = (value: number[]) => {
    const newPosition = { ...position, scale: value[0] };
    setPosition(newPosition);
    localStorage.setItem('darkHavenLogoPosition', JSON.stringify(newPosition));
  };

  if (!config || (config.logoType === 'text' && !config.logoText) || 
      ((config.logoType === 'image' || config.logoType === 'video') && !config.logoUrl)) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed z-40 ${isEditing ? 'cursor-move' : ''}`}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: `translate(-50%, -50%) scale(${position.scale / 100})`,
          pointerEvents: isEditing ? 'auto' : 'none'
        }}
        onMouseDown={handleMouseDown}
        onClick={() => isEditing && setShowControls(!showControls)}
      >
        {config.logoType === 'text' && (
          <div className="text-4xl font-bold glow-cyan whitespace-nowrap select-none">
            {config.logoText}
          </div>
        )}
        {config.logoType === 'image' && config.logoUrl && (
          <img 
            src={config.logoUrl} 
            alt="Logo" 
            className="max-w-[300px] max-h-[150px] object-contain select-none"
            draggable={false}
          />
        )}
        {config.logoType === 'video' && config.logoUrl && (
          <video 
            src={config.logoUrl} 
            className="max-w-[300px] max-h-[150px] object-contain"
            autoPlay 
            loop 
            muted 
            playsInline
            draggable={false}
          />
        )}
        
        {isEditing && (
          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            ✎
          </div>
        )}
      </div>

      {isEditing && showControls && (
        <Card className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 w-80 bg-card/95 backdrop-blur-lg border-primary/50">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Редактор логотипа</Label>
              <Button variant="ghost" size="icon" onClick={() => setShowControls(false)}>
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <div>
              <Label className="text-xs mb-2 block">Размер: {position.scale}%</Label>
              <Slider
                value={[position.scale]}
                onValueChange={handleScaleChange}
                min={50}
                max={200}
                step={5}
              />
            </div>

            <div className="text-xs text-muted-foreground">
              Перетащите логотип, чтобы изменить позицию
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  const newPos = { x: 50, y: 20, scale: 100 };
                  setPosition(newPos);
                  localStorage.setItem('darkHavenLogoPosition', JSON.stringify(newPos));
                }}
              >
                Сбросить
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => setShowControls(false)}
              >
                Готово
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default LogoEditor;
