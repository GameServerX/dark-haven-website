import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { PageElement } from '@/types/editor';

interface ElementEditorProps {
  element: PageElement | null;
  onUpdate: (element: PageElement) => void;
  onDelete: () => void;
  onClose: () => void;
}

const ElementEditor = ({ element, onUpdate, onDelete, onClose }: ElementEditorProps) => {
  const [localElement, setLocalElement] = useState<PageElement | null>(element);

  useEffect(() => {
    setLocalElement(element);
  }, [element]);

  if (!localElement) return null;

  const updateElement = (updates: Partial<PageElement>) => {
    const updated = { ...localElement, ...updates };
    setLocalElement(updated);
    onUpdate(updated);
  };

  const updateStyles = (styleUpdates: Partial<PageElement['styles']>) => {
    updateElement({
      styles: { ...localElement.styles, ...styleUpdates }
    });
  };

  return (
    <div className="fixed right-6 top-24 z-50 w-96 max-h-[calc(100vh-200px)] overflow-y-auto animate-slide-in-right">
      <Card className="bg-card/95 backdrop-blur-lg border-2 border-primary/50 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Icon name="Edit" size={20} className="text-primary" />
              <span>Редактор элемента</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Тип: {localElement.type}</Label>
          </div>

          {localElement.type === 'text' && (
            <div>
              <Label htmlFor="text-content">Текст</Label>
              <Textarea
                id="text-content"
                value={localElement.content}
                onChange={(e) => updateElement({ content: e.target.value })}
                rows={3}
              />
            </div>
          )}

          {localElement.type === 'button' && (
            <>
              <div>
                <Label htmlFor="button-text">Текст кнопки</Label>
                <Input
                  id="button-text"
                  value={localElement.content}
                  onChange={(e) => updateElement({ content: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="button-link">Ссылка (URL)</Label>
                <Input
                  id="button-link"
                  value={localElement.link || ''}
                  onChange={(e) => updateElement({ link: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </>
          )}

          {localElement.type === 'image' && (
            <div>
              <Label htmlFor="image-url">URL изображения</Label>
              <Input
                id="image-url"
                value={localElement.imageUrl || ''}
                onChange={(e) => updateElement({ imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}

          {localElement.type === 'video' && (
            <div>
              <Label htmlFor="video-url">URL видео</Label>
              <Input
                id="video-url"
                value={localElement.videoUrl || ''}
                onChange={(e) => updateElement({ videoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4"
              />
            </div>
          )}

          <div className="space-y-3">
            <Label>Размер</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="width" className="text-xs">Ширина (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={localElement.size.width}
                  onChange={(e) => updateElement({
                    size: { ...localElement.size, width: parseInt(e.target.value) || 100 }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-xs">Высота (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={localElement.size.height}
                  onChange={(e) => updateElement({
                    size: { ...localElement.size, height: parseInt(e.target.value) || 100 }
                  })}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="bg-color">Цвет фона</Label>
            <Input
              id="bg-color"
              type="color"
              value={localElement.styles.backgroundColor || '#1a1a2e'}
              onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="text-color">Цвет текста</Label>
            <Input
              id="text-color"
              type="color"
              value={localElement.styles.textColor || '#ffffff'}
              onChange={(e) => updateStyles({ textColor: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="font-size">Размер шрифта: {localElement.styles.fontSize || 16}px</Label>
            <Slider
              id="font-size"
              value={[localElement.styles.fontSize || 16]}
              onValueChange={(value) => updateStyles({ fontSize: value[0] })}
              min={10}
              max={72}
              step={1}
            />
          </div>

          <div>
            <Label htmlFor="border-radius">Скругление углов: {localElement.styles.borderRadius || 0}px</Label>
            <Slider
              id="border-radius"
              value={[localElement.styles.borderRadius || 0]}
              onValueChange={(value) => updateStyles({ borderRadius: value[0] })}
              min={0}
              max={50}
              step={1}
            />
          </div>

          <div>
            <Label htmlFor="padding">Отступы: {localElement.styles.padding || 10}px</Label>
            <Slider
              id="padding"
              value={[localElement.styles.padding || 10]}
              onValueChange={(value) => updateStyles({ padding: value[0] })}
              min={0}
              max={50}
              step={1}
            />
          </div>

          <div>
            <Label htmlFor="glow-color">Цвет свечения</Label>
            <Input
              id="glow-color"
              type="color"
              value={localElement.styles.glowColor || '#00d9ff'}
              onChange={(e) => updateStyles({ glowColor: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="glow-intensity">Интенсивность свечения: {localElement.styles.glowIntensity || 0}</Label>
            <Slider
              id="glow-intensity"
              value={[localElement.styles.glowIntensity || 0]}
              onValueChange={(value) => updateStyles({ glowIntensity: value[0] })}
              min={0}
              max={50}
              step={1}
            />
          </div>

          <div>
            <Label htmlFor="animation">Анимация</Label>
            <Select
              value={localElement.styles.animation || 'none'}
              onValueChange={(value) => updateStyles({ animation: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Без анимации</SelectItem>
                <SelectItem value="fade-in">Появление</SelectItem>
                <SelectItem value="float">Плавание</SelectItem>
                <SelectItem value="pulse-glow">Пульсация</SelectItem>
                <SelectItem value="slide-in-right">Выезд справа</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bg-image">Фоновое изображение (URL)</Label>
            <Input
              id="bg-image"
              value={localElement.styles.backgroundImage || ''}
              onChange={(e) => updateStyles({ backgroundImage: e.target.value })}
              placeholder="https://example.com/bg.jpg"
            />
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={onDelete}
          >
            <Icon name="Trash2" size={16} className="mr-2" />
            Удалить элемент
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElementEditor;
