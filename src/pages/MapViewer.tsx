import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MapViewerAdmin from '@/components/MapViewerAdmin';
import { fileDB } from '@/lib/fileDB';

interface MapData {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  description?: string;
  createdAt: string;
}

interface MapViewerProps {
  isAdmin: boolean;
  onBack: () => void;
}

const MapViewer = ({ isAdmin, onBack }: MapViewerProps) => {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [activeMapId, setActiveMapId] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    loadMaps();
  }, []);

  const loadMaps = async () => {
    const savedMaps = await fileDB.getMaps();
    if (savedMaps && savedMaps.length > 0) {
      setMaps(savedMaps);
      if (!activeMapId) {
        setActiveMapId(savedMaps[0].id);
      }
    }
  };

  const handleSaveMaps = async (newMaps: MapData[]) => {
    await fileDB.setMaps(newMaps);
    setMaps(newMaps);
    if (newMaps.length > 0 && !activeMapId) {
      setActiveMapId(newMaps[0].id);
    }
  };

  const activeMap = maps.find(m => m.id === activeMapId);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-primary/10"
            >
              <Icon name="ArrowLeft" size={24} className="text-primary" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold glow-cyan">Карты SS14</h1>
              <p className="text-muted-foreground text-sm">Интерактивный просмотр карт Space Station 14</p>
            </div>
          </div>

          {isAdmin && (
            <Button
              variant="outline"
              onClick={() => setShowAdmin(!showAdmin)}
              className="border-secondary text-secondary hover:bg-secondary/10"
            >
              <Icon name="Settings" size={16} className="mr-2" />
              {showAdmin ? 'Скрыть панель' : 'Управление картами'}
            </Button>
          )}
        </div>

        {showAdmin && isAdmin && (
          <div className="mb-6">
            <MapViewerAdmin maps={maps} onSave={handleSaveMaps} />
          </div>
        )}

        {maps.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Icon name="Map" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Карты еще не загружены</h2>
            <p className="text-muted-foreground mb-6">
              {isAdmin 
                ? 'Нажмите "Управление картами" чтобы добавить карты для просмотра'
                : 'Администратор еще не добавил карты для просмотра'}
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Tabs value={activeMapId || ''} onValueChange={setActiveMapId}>
              <div className="border-b border-border bg-card/50 px-4 py-2">
                <TabsList className="bg-transparent">
                  {maps.map(map => (
                    <TabsTrigger
                      key={map.id}
                      value={map.id}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Icon name="Map" size={16} className="mr-2" />
                      {map.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {maps.map(map => (
                <TabsContent key={map.id} value={map.id} className="m-0 p-0">
                  {map.description && (
                    <div className="px-6 py-4 bg-card/30 border-b border-border">
                      <p className="text-sm text-muted-foreground">{map.description}</p>
                    </div>
                  )}
                  <div className="relative w-full" style={{ height: 'calc(100vh - 400px)', minHeight: '600px' }}>
                    <iframe
                      src={map.url}
                      className="w-full h-full border-0"
                      title={`Карта: ${map.name}`}
                      allow="fullscreen"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        <div className="mt-6 bg-card/30 border border-border/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Управление просмотром:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Используйте колесо мыши для масштабирования</li>
                <li>Зажмите левую кнопку мыши для перемещения по карте</li>
                <li>Переключайтесь между картами с помощью вкладок сверху</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapViewer;
