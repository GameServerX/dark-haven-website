import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface TabManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTab: (name: string, icon: string, location: 'header' | 'sidebar') => void;
}

const TabManager = ({ isOpen, onClose, onCreateTab }: TabManagerProps) => {
  const [tabName, setTabName] = useState('');
  const [tabIcon, setTabIcon] = useState('Star');
  const [location, setLocation] = useState<'header' | 'sidebar'>('header');
  const { toast } = useToast();

  const icons = [
    'Star', 'Sparkles', 'Trophy', 'Target', 'Zap', 'Shield', 'Heart',
    'Crown', 'Flame', 'Sword', 'Briefcase', 'Map', 'Compass', 'Anchor'
  ];

  const handleCreate = () => {
    if (!tabName.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название вкладки',
        variant: 'destructive'
      });
      return;
    }

    onCreateTab(tabName, tabIcon, location);
    setTabName('');
    setTabIcon('Star');
    setLocation('header');
    onClose();
    
    toast({
      title: 'Успешно!',
      description: `Вкладка "${tabName}" создана`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold glow-cyan">
            Создание новой вкладки
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="tab-name">Название вкладки</Label>
            <Input
              id="tab-name"
              value={tabName}
              onChange={(e) => setTabName(e.target.value)}
              placeholder="Например: Магазин"
            />
          </div>

          <div>
            <Label htmlFor="tab-icon">Иконка</Label>
            <Select value={tabIcon} onValueChange={setTabIcon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {icons.map(icon => (
                  <SelectItem key={icon} value={icon}>
                    <div className="flex items-center space-x-2">
                      <Icon name={icon as any} size={16} />
                      <span>{icon}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Расположение</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Button
                variant={location === 'header' ? 'default' : 'outline'}
                onClick={() => setLocation('header')}
                className="w-full"
              >
                <Icon name="ArrowRight" size={16} className="mr-2" />
                Верхнее меню
              </Button>
              <Button
                variant={location === 'sidebar' ? 'default' : 'outline'}
                onClick={() => setLocation('sidebar')}
                className="w-full"
              >
                <Icon name="ArrowDown" size={16} className="mr-2" />
                Боковое меню
              </Button>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button onClick={handleCreate} className="w-full animate-pulse-glow">
              <Icon name="Plus" size={16} className="mr-2" />
              Создать вкладку
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TabManager;
