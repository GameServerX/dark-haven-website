import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { useEffect, useState } from 'react';

const ProfileSection = () => {
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null);
  const [stats] = useState({
    playTime: '24ч 35м',
    sessions: 15,
    achievements: 8
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('darkHavenUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="animate-fade-in text-center py-20">
        <Icon name="UserX" size={64} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Войдите в систему</h3>
        <p className="text-muted-foreground">Чтобы просмотреть профиль, необходимо авторизоваться</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-4xl font-bold glow-cyan mb-2">Профиль</h2>
        <p className="text-muted-foreground">Информация об игроке</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-card/50 border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Информация</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarFallback className="text-4xl bg-primary/20 text-primary">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-2xl font-bold">{user.username}</h3>
              {user.isAdmin && (
                <div className="mt-2 inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">
                  <Icon name="Shield" size={14} />
                  <span>Администратор</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card/50 border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-primary/10 border border-primary/30">
                <Icon name="Clock" size={32} className="text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold mb-1">{stats.playTime}</div>
                <div className="text-sm text-muted-foreground">Время игры</div>
              </div>

              <div className="text-center p-6 rounded-lg bg-secondary/10 border border-secondary/30">
                <Icon name="Activity" size={32} className="text-secondary mx-auto mb-2" />
                <div className="text-3xl font-bold mb-1">{stats.sessions}</div>
                <div className="text-sm text-muted-foreground">Сессий</div>
              </div>

              <div className="text-center p-6 rounded-lg bg-accent/10 border border-accent/30">
                <Icon name="Award" size={32} className="text-accent mx-auto mb-2" />
                <div className="text-3xl font-bold mb-1">{stats.achievements}</div>
                <div className="text-sm text-muted-foreground">Достижений</div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button className="w-full" variant="outline">
                <Icon name="Edit" size={16} className="mr-2" />
                Редактировать профиль
              </Button>
              <Button className="w-full" variant="outline">
                <Icon name="Settings" size={16} className="mr-2" />
                Настройки
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSection;
