import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const { toast } = useToast();
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleContent, setNewRuleContent] = useState('');
  const [backgroundType, setBackgroundType] = useState<'static' | 'animated'>('animated');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [buttonGlow, setButtonGlow] = useState(true);
  const [buttonAnimation, setButtonAnimation] = useState(true);

  const handleAddNews = () => {
    if (!newNewsTitle || !newNewsContent) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    const news = JSON.parse(localStorage.getItem('darkHavenNews') || '[]');
    news.unshift({
      id: Date.now(),
      title: newNewsTitle,
      content: newNewsContent,
      date: new Date().toISOString().split('T')[0],
      author: 'Admin'
    });
    localStorage.setItem('darkHavenNews', JSON.stringify(news));
    
    setNewNewsTitle('');
    setNewNewsContent('');
    toast({ title: 'Успешно!', description: 'Новость добавлена' });
  };

  const handleAddRule = () => {
    if (!newRuleTitle || !newRuleContent) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    const rules = JSON.parse(localStorage.getItem('darkHavenRules') || '[]');
    rules.push({
      id: rules.length + 1,
      title: newRuleTitle,
      content: newRuleContent
    });
    localStorage.setItem('darkHavenRules', JSON.stringify(rules));
    
    setNewRuleTitle('');
    setNewRuleContent('');
    toast({ title: 'Успешно!', description: 'Правило добавлено' });
  };

  const handleSaveDesign = () => {
    const design = {
      backgroundType,
      backgroundUrl,
      buttonGlow,
      buttonAnimation
    };
    localStorage.setItem('darkHavenDesign', JSON.stringify(design));
    toast({ title: 'Успешно!', description: 'Настройки дизайна сохранены' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold glow-cyan flex items-center space-x-2">
            <Icon name="Settings" size={24} />
            <span>Административная панель</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="design">Дизайн</TabsTrigger>
            <TabsTrigger value="navigation">Навигация</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6 mt-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="Newspaper" size={20} />
                  <span>Добавить новость</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="news-title">Заголовок</Label>
                  <Input
                    id="news-title"
                    value={newNewsTitle}
                    onChange={(e) => setNewNewsTitle(e.target.value)}
                    placeholder="Название новости"
                  />
                </div>
                <div>
                  <Label htmlFor="news-content">Содержание</Label>
                  <Textarea
                    id="news-content"
                    value={newNewsContent}
                    onChange={(e) => setNewNewsContent(e.target.value)}
                    placeholder="Текст новости"
                    rows={4}
                  />
                </div>
                <Button onClick={handleAddNews} className="w-full">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить новость
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="ScrollText" size={20} />
                  <span>Добавить правило</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="rule-title">Заголовок правила</Label>
                  <Input
                    id="rule-title"
                    value={newRuleTitle}
                    onChange={(e) => setNewRuleTitle(e.target.value)}
                    placeholder="Название правила"
                  />
                </div>
                <div>
                  <Label htmlFor="rule-content">Описание</Label>
                  <Textarea
                    id="rule-content"
                    value={newRuleContent}
                    onChange={(e) => setNewRuleContent(e.target.value)}
                    placeholder="Текст правила"
                    rows={4}
                  />
                </div>
                <Button onClick={handleAddRule} className="w-full">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить правило
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-6 mt-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="Image" size={20} />
                  <span>Настройка фона</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Тип фона</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant={backgroundType === 'static' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBackgroundType('static')}
                    >
                      Статический
                    </Button>
                    <Button
                      variant={backgroundType === 'animated' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBackgroundType('animated')}
                    >
                      Анимированный
                    </Button>
                  </div>
                </div>

                {backgroundType === 'static' && (
                  <div>
                    <Label htmlFor="bg-url">URL фонового изображения</Label>
                    <Input
                      id="bg-url"
                      value={backgroundUrl}
                      onChange={(e) => setBackgroundUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="Sparkles" size={20} />
                  <span>Эффекты кнопок</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="button-glow">Свечение кнопок</Label>
                  <Switch
                    id="button-glow"
                    checked={buttonGlow}
                    onCheckedChange={setButtonGlow}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="button-animation">Анимация кнопок</Label>
                  <Switch
                    id="button-animation"
                    checked={buttonAnimation}
                    onCheckedChange={setButtonAnimation}
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSaveDesign} className="w-full animate-pulse-glow">
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить настройки дизайна
            </Button>
          </TabsContent>

          <TabsContent value="navigation" className="space-y-6 mt-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="Layout" size={20} />
                  <span>Управление навигацией</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Настройка структуры меню и добавление новых разделов будет доступна в следующем обновлении.
                </p>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon name="Home" size={20} className="text-primary" />
                      <span>Главная</span>
                    </div>
                    <Switch checked disabled />
                  </div>
                  <div className="p-3 rounded-lg border border-border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon name="Newspaper" size={20} className="text-primary" />
                      <span>Новости</span>
                    </div>
                    <Switch checked disabled />
                  </div>
                  <div className="p-3 rounded-lg border border-border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon name="Rocket" size={20} className="text-primary" />
                      <span>Развитие</span>
                    </div>
                    <Switch checked disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
