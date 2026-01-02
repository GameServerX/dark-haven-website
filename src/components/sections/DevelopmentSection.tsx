import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const DevelopmentSection = () => {
  const roadmap = [
    { title: 'Базовая механика', progress: 100, status: 'Завершено' },
    { title: 'Расширенные профессии', progress: 75, status: 'В разработке' },
    { title: 'Новые карты станций', progress: 50, status: 'В разработке' },
    { title: 'Система репутации', progress: 30, status: 'В планах' },
    { title: 'MMO функционал', progress: 10, status: 'В планах' }
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-4xl font-bold glow-cyan mb-2">Развитие</h2>
        <p className="text-muted-foreground">План развития проекта Dark Haven</p>
      </div>

      <div className="space-y-6">
        {roadmap.map((item, index) => (
          <Card key={index} className="bg-card/50 border-border backdrop-blur-sm hover:border-secondary transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="Rocket" size={24} className="text-secondary" />
                  <CardTitle>{item.title}</CardTitle>
                </div>
                <span className="text-sm text-muted-foreground">{item.status}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={item.progress} className="h-3" />
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
