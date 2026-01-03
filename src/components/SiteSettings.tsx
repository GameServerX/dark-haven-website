import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface SiteConfig {
  logoUrl: string;
  logoType: 'image' | 'video' | 'text';
  logoText: string;
  backgrounds: Record<string, { type: 'image' | 'video'; url: string; parallax: boolean }>;
  pageHeights: Record<string, number>;
}

const SiteSettings = ({ onClose }: { onClose: () => void }) => {
  const [config, setConfig] = useState<SiteConfig>({
    logoUrl: '',
    logoType: 'text',
    logoText: 'DARK HAVEN',
    backgrounds: {},
    pageHeights: {}
  });

  const [musicTracks, setMusicTracks] = useState<any[]>([]);
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackUrl, setNewTrackUrl] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('darkHavenSiteConfig');
    if (saved) setConfig(JSON.parse(saved));

    const savedTracks = localStorage.getItem('darkHavenTracks');
    if (savedTracks) setMusicTracks(JSON.parse(savedTracks));
  }, []);

  const handleSave = () => {
    localStorage.setItem('darkHavenSiteConfig', JSON.stringify(config));
    localStorage.setItem('darkHavenTracks', JSON.stringify(musicTracks));
    onClose();
    window.location.reload();
  };

  const handleAddTrack = () => {
    if (!newTrackTitle || !newTrackUrl) return;
    const newTrack = { id: Date.now().toString(), title: newTrackTitle, url: newTrackUrl };
    const updated = [...musicTracks, newTrack];
    setMusicTracks(updated);
    setNewTrackTitle('');
    setNewTrackUrl('');
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
                <label className="text-sm mb-2 block">Тип логотипа</label>
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
                <Input placeholder="Текст логотипа" value={config.logoText} onChange={(e) => setConfig({...config, logoText: e.target.value})} />
              )}

              {(config.logoType === 'image' || config.logoType === 'video') && (
                <Input placeholder="URL логотипа" value={config.logoUrl} onChange={(e) => setConfig({...config, logoUrl: e.target.value})} />
              )}
            </TabsContent>

            <TabsContent value="backgrounds" className="space-y-4">
              <p className="text-sm text-muted-foreground">Установите фон для каждой вкладки</p>
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
                      <Input 
                        placeholder="URL" 
                        value={config.backgrounds[page]?.url || ''} 
                        onChange={(e) => setConfig({
                          ...config, 
                          backgrounds: {...config.backgrounds, [page]: {...config.backgrounds[page], url: e.target.value}}
                        })}
                      />
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={config.backgrounds[page]?.parallax || false}
                          onChange={(e) => setConfig({
                            ...config, 
                            backgrounds: {...config.backgrounds, [page]: {...config.backgrounds[page], parallax: e.target.checked}}
                          })}
                        />
                        <span className="text-sm">Параллакс эффект</span>
                      </label>
                    </>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="music" className="space-y-4">
              <div className="space-y-2">
                <Input placeholder="Название трека" value={newTrackTitle} onChange={(e) => setNewTrackTitle(e.target.value)} />
                <Input placeholder="URL трека" value={newTrackUrl} onChange={(e) => setNewTrackUrl(e.target.value)} />
                <Button onClick={handleAddTrack} className="w-full">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить трек
                </Button>
              </div>

              <div className="space-y-2">
                {musicTracks.map(track => (
                  <div key={track.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-semibold">{track.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-md">{track.url}</p>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteTrack(track.id)}>
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pages" className="space-y-4">
              <p className="text-sm text-muted-foreground">Установите минимальную высоту для каждой страницы</p>
              {['home', 'news', 'development', 'wiki', 'rules', 'chat', 'profile'].map(page => (
                <div key={page} className="flex items-center space-x-4">
                  <span className="w-32 capitalize">{page}</span>
                  <Input 
                    type="number" 
                    placeholder="Высота (vh)" 
                    value={config.pageHeights[page] || 100}
                    onChange={(e) => setConfig({
                      ...config,
                      pageHeights: {...config.pageHeights, [page]: parseInt(e.target.value) || 100}
                    })}
                  />
                  <span className="text-sm text-muted-foreground">vh</span>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex gap-2">
            <Button onClick={handleSave} className="flex-1">Сохранить</Button>
            <Button onClick={onClose} variant="outline" className="flex-1">Отмена</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettings;
