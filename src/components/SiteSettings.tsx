import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface SiteConfig {
  logoUrl: string;
  logoType: 'image' | 'video' | 'text';
  logoText: string;
  backgrounds: Record<string, { type: 'image' | 'video'; url: string; parallax: boolean }>;
  pageHeights: Record<string, number>;
}

const SiteSettings = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<SiteConfig>({
    logoUrl: '',
    logoType: 'text',
    logoText: 'DARK HAVEN',
    backgrounds: {},
    pageHeights: {}
  });

  const [musicTracks, setMusicTracks] = useState<any[]>([]);
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const logoFileRef = useRef<HTMLInputElement>(null);
  const bgFileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const musicFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('darkHavenSiteConfig');
    if (saved) setConfig(JSON.parse(saved));

    const savedTracks = localStorage.getItem('darkHavenTracks');
    if (savedTracks) setMusicTracks(JSON.parse(savedTracks));
  }, []);

  const handleSave = () => {
    localStorage.setItem('darkHavenSiteConfig', JSON.stringify(config));
    localStorage.setItem('darkHavenTracks', JSON.stringify(musicTracks));
    toast({ title: 'Сохранено!', description: 'Настройки применены' });
    onClose();
    window.location.reload();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setConfig({ ...config, logoUrl: dataUrl });
      toast({ title: 'Загружено!', description: 'Логотип обновлен' });
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundUpload = (page: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setConfig({
        ...config,
        backgrounds: {
          ...config.backgrounds,
          [page]: { ...config.backgrounds[page], url: dataUrl }
        }
      });
      toast({ title: 'Загружено!', description: `Фон для ${page} обновлен` });
    };
    reader.readAsDataURL(file);
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !newTrackTitle) {
      toast({ title: 'Ошибка', description: 'Укажите название трека', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newTrack = { 
        id: Date.now().toString(), 
        title: newTrackTitle, 
        url: dataUrl 
      };
      const updated = [...musicTracks, newTrack];
      setMusicTracks(updated);
      setNewTrackTitle('');
      toast({ title: 'Добавлено!', description: `Трек "${newTrackTitle}" загружен` });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteTrack = (id: string) => {
    setMusicTracks(musicTracks.filter(t => t.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-primary/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl glow-cyan">Настройки сайта</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={24} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="logo">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="logo">Логотип</TabsTrigger>
              <TabsTrigger value="backgrounds">Фоны</TabsTrigger>
              <TabsTrigger value="music">Музыка</TabsTrigger>
              <TabsTrigger value="pages">Страницы</TabsTrigger>
            </TabsList>

            <TabsContent value="logo" className="space-y-4">
              <div>
                <Label className="mb-2 block">Тип логотипа</Label>
                <Select value={config.logoType} onValueChange={(val: any) => setConfig({...config, logoType: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Текст</SelectItem>
                    <SelectItem value="image">Изображение</SelectItem>
                    <SelectItem value="video">Видео</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.logoType === 'text' && (
                <div>
                  <Label className="mb-2 block">Текст логотипа</Label>
                  <Input 
                    placeholder="DARK HAVEN" 
                    value={config.logoText} 
                    onChange={(e) => setConfig({...config, logoText: e.target.value})} 
                  />
                </div>
              )}

              {(config.logoType === 'image' || config.logoType === 'video') && (
                <div className="space-y-2">
                  <Label>Загрузить {config.logoType === 'image' ? 'изображение' : 'видео'}</Label>
                  <input
                    ref={logoFileRef}
                    type="file"
                    accept={config.logoType === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => logoFileRef.current?.click()}
                    className="w-full"
                  >
                    <Icon name="Upload" size={16} className="mr-2" />
                    Выбрать файл
                  </Button>
                  {config.logoUrl && (
                    <div className="mt-2 p-2 border border-border rounded">
                      {config.logoType === 'image' ? (
                        <img src={config.logoUrl} alt="Logo preview" className="max-h-32 mx-auto" />
                      ) : (
                        <video src={config.logoUrl} className="max-h-32 mx-auto" controls />
                      )}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="backgrounds" className="space-y-4">
              <p className="text-sm text-muted-foreground">Установите фон для каждой вкладки с параллакс эффектом</p>
              {['home', 'news', 'development', 'wiki', 'rules', 'chat', 'profile'].map(page => (
                <div key={page} className="space-y-2 p-4 border border-border rounded-lg">
                  <h4 className="font-semibold capitalize">{page}</h4>
                  <Select 
                    value={config.backgrounds[page]?.type || 'none'} 
                    onValueChange={(val: any) => setConfig({
                      ...config, 
                      backgrounds: {...config.backgrounds, [page]: {...config.backgrounds[page], type: val}}
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Без фона" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Без фона</SelectItem>
                      <SelectItem value="image">Изображение</SelectItem>
                      <SelectItem value="video">Видео</SelectItem>
                    </SelectContent>
                  </Select>
                  {config.backgrounds[page]?.type !== 'none' && (
                    <>
                      <input
                        ref={(el) => (bgFileRefs.current[page] = el)}
                        type="file"
                        accept={config.backgrounds[page]?.type === 'image' ? 'image/*' : 'video/*'}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleBackgroundUpload(page, file);
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => bgFileRefs.current[page]?.click()}
                        className="w-full"
                      >
                        <Icon name="Upload" size={16} className="mr-2" />
                        Загрузить {config.backgrounds[page]?.type === 'image' ? 'изображение' : 'видео'}
                      </Button>
                      {config.backgrounds[page]?.url && (
                        <div className="text-xs text-green-500">✓ Файл загружен</div>
                      )}
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={config.backgrounds[page]?.parallax || false}
                          onChange={(e) => setConfig({
                            ...config, 
                            backgrounds: {...config.backgrounds, [page]: {...config.backgrounds[page], parallax: e.target.checked}}
                          })}
                        />
                        <span className="text-sm">Параллакс эффект (плавная прокрутка)</span>
                      </label>
                    </>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="music" className="space-y-4">
              <div className="space-y-2">
                <Label>Название трека</Label>
                <Input 
                  placeholder="Мой трек" 
                  value={newTrackTitle} 
                  onChange={(e) => setNewTrackTitle(e.target.value)} 
                />
                <input
                  ref={musicFileRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleMusicUpload}
                  className="hidden"
                />
                <Button 
                  onClick={() => musicFileRef.current?.click()} 
                  className="w-full"
                  disabled={!newTrackTitle}
                >
                  <Icon name="Upload" size={16} className="mr-2" />
                  Загрузить аудио файл
                </Button>
              </div>

              <div className="space-y-2">
                {musicTracks.map(track => (
                  <div key={track.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex-1 truncate">
                      <p className="font-semibold">{track.title}</p>
                      <p className="text-xs text-muted-foreground">Аудио файл загружен</p>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteTrack(track.id)}>
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pages" className="space-y-4">
              <p className="text-sm text-muted-foreground">Минимальная высота каждой страницы (100-1000vh)</p>
              {['home', 'news', 'development', 'wiki', 'rules', 'chat', 'profile'].map(page => (
                <div key={page} className="space-y-2">
                  <Label className="capitalize">{page}: {config.pageHeights[page] || 100}vh</Label>
                  <Slider
                    value={[config.pageHeights[page] || 100]}
                    onValueChange={(val) => setConfig({
                      ...config,
                      pageHeights: {...config.pageHeights, [page]: val[0]}
                    })}
                    min={100}
                    max={1000}
                    step={10}
                  />
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Отмена</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettings;
