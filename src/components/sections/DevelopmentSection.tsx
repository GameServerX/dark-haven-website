import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';

interface RoadmapItem {
  id: number;
  title: string;
  progress: number;
  status: string;
}

const DevelopmentSection = () => {
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('darkHavenRoadmap');
    if (saved) {
      setRoadmap(JSON.parse(saved));
    } else {
      const defaultRoadmap = [
        { id: 1, title: 'Базовая механика', progress: 100, status: 'Завершено' },
        { id: 2, title: 'Расширенные профессии', progress: 75, status: 'В разработке' },
        { id: 3, title: 'Новые карты станций', progress: 50, status: 'В разработке' },
        { id: 4, title: 'Система репутации', progress: 30, status: 'В планах' },
        { id: 5, title: 'MMO функционал', progress: 10, status: 'В планах' }
      ];
      setRoadmap(defaultRoadmap);
      localStorage.setItem('darkHavenRoadmap', JSON.stringify(defaultRoadmap));
    }
  }, []);

  const handleSave = () => {
    if (editingItem) {
      const updated = roadmap.map(r => r.id === editingItem.id ? editingItem : r);
      setRoadmap(updated);
      localStorage.setItem('darkHavenRoadmap', JSON.stringify(updated));
    }
    setEditingItem(null);
  };

  const handleAdd = () => {
    const newItem = { id: Date.now(), title: 'Новая функция', progress: 0, status: 'В планах' };
    const updated = [...roadmap, newItem];
    setRoadmap(updated);
    localStorage.setItem('darkHavenRoadmap', JSON.stringify(updated));
  };

  const handleDelete = (id: number) => {
    const updated = roadmap.filter(r => r.id !== id);
    setRoadmap(updated);
    localStorage.setItem('darkHavenRoadmap', JSON.stringify(updated));
  };

  const adjustProgress = (item: RoadmapItem, delta: number) => {
    const newProgress = Math.max(0, Math.min(100, item.progress + delta));
    const updated = roadmap.map(r => r.id === item.id ? {...r, progress: newProgress} : r);
    setRoadmap(updated);
    localStorage.setItem('darkHavenRoadmap', JSON.stringify(updated));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold glow-cyan mb-2">Развитие</h2>
          <p className="text-muted-foreground">План развития проекта Dark Haven</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'default' : 'outline'}>
            <Icon name="Edit" size={16} className="mr-2" />
            {isEditing ? 'Готово' : 'Редактировать'}
          </Button>
          {isEditing && (
            <Button onClick={handleAdd}>
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {roadmap.map((item) => (
          <Card key={item.id} className="bg-card/50 border-border backdrop-blur-sm hover:border-secondary transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <Icon name="Rocket" size={24} className="text-secondary" />
                  {editingItem?.id === item.id ? (
                    <Input value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} className="max-w-md" />
                  ) : (
                    <CardTitle>{item.title}</CardTitle>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingItem?.id === item.id ? (
                    <Input value={editingItem.status} onChange={(e) => setEditingItem({...editingItem, status: e.target.value})} className="w-32" />
                  ) : (
                    <span className="text-sm text-muted-foreground">{item.status}</span>
                  )}
                  {isEditing && (
                    <div className="flex gap-1">
                      {editingItem?.id === item.id ? (
                        <>
                          <Button size="sm" onClick={handleSave}><Icon name="Save" size={14} /></Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}><Icon name="X" size={14} /></Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}><Icon name="Edit" size={14} /></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}><Icon name="Trash2" size={14} /></Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {isEditing && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => adjustProgress(item, -5)}>
                        <Icon name="Minus" size={14} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => adjustProgress(item, 5)}>
                        <Icon name="Plus" size={14} />
                      </Button>
                    </>
                  )}
                  <Progress value={item.progress} className="h-3 flex-1" />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Прогресс</span>
                  <span>{item.progress}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DevelopmentSection;
