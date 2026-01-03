import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MapData {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  description?: string;
  createdAt: string;
}

interface MapViewerAdminProps {
  maps: MapData[];
  onSave: (maps: MapData[]) => void;
}

const MapViewerAdmin = ({ maps, onSave }: MapViewerAdminProps) => {
  const [editingMap, setEditingMap] = useState<MapData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    thumbnail: ''
  });

  const handleAddNew = () => {
    setEditingMap({
      id: `map-${Date.now()}`,
      name: '',
      url: '',
      createdAt: new Date().toISOString()
    });
    setFormData({ name: '', url: '', description: '', thumbnail: '' });
  };

  const handleEdit = (map: MapData) => {
    setEditingMap(map);
    setFormData({
      name: map.name,
      url: map.url,
      description: map.description || '',
      thumbnail: map.thumbnail || ''
    });
  };

  const handleSave = () => {
    if (!editingMap || !formData.name || !formData.url) return;

    const updatedMap: MapData = {
      ...editingMap,
      name: formData.name,
      url: formData.url,
      description: formData.description || undefined,
      thumbnail: formData.thumbnail || undefined
    };

    const existingIndex = maps.findIndex(m => m.id === editingMap.id);
    const newMaps = existingIndex >= 0
      ? maps.map(m => m.id === editingMap.id ? updatedMap : m)
      : [...maps, updatedMap];

    onSave(newMaps);
    setEditingMap(null);
    setFormData({ name: '', url: '', description: '', thumbnail: '' });
  };

  const handleDelete = (mapId: string) => {
    if (confirm('Удалить эту карту?')) {
      onSave(maps.filter(m => m.id !== mapId));
    }
  };

  const handleCancel = () => {
    setEditingMap(null);
    setFormData({ name: '', url: '', description: '', thumbnail: '' });
  };

  return (
    <Card className="bg-card/50 border-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Settings" size={20} />
            <span>Управление картами</span>
          </div>
          {!editingMap && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddNew}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить карту
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {editingMap ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="map-name">Название карты *</Label>
              <Input
                id="map-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: Station Delta"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="map-url">URL просмотрщика карт *</Label>
              <Input
                id="map-url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://centcomm.spacestation14.com/maps/..."
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Используйте ссылку на интерактивный просмотрщик карт SS14
              </p>
            </div>

            <div>
              <Label htmlFor="map-description">Описание (опционально)</Label>
              <Textarea
                id="map-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Краткое описание карты..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="map-thumbnail">URL превью (опционально)</Label>
              <Input
                id="map-thumbnail"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                disabled={!formData.name || !formData.url}
                className="flex-1"
              >
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                <Icon name="X" size={16} className="mr-2" />
                Отмена
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {maps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Карты еще не добавлены</p>
                <p className="text-sm mt-2">Нажмите "Добавить карту" для начала</p>
              </div>
            ) : (
              maps.map(map => (
                <div
                  key={map.id}
                  className="flex items-center justify-between p-4 bg-card/30 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {map.thumbnail && (
                      <img
                        src={map.thumbnail}
                        alt={map.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{map.name}</h3>
                      {map.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {map.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(map.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(map)}
                      className="hover:bg-primary/10"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(map.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapViewerAdmin;
