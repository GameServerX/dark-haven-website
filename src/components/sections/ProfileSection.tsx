import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useEffect, useState } from 'react';

interface UserData {
  username: string;
  isAdmin: boolean;
  role: string;
  avatar?: string;
  bio?: string;
}

interface UserInSystem {
  username: string;
  role: string;
  registeredAt: string;
  avatar?: string;
  bio?: string;
}

const ProfileSection = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [allUsers, setAllUsers] = useState<UserInSystem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [editedAvatar, setEditedAvatar] = useState('');
  const [showUsers, setShowUsers] = useState(false);
  const [stats] = useState({ onlineUsers: 12, totalUsers: 156, dbSize: '2.3 MB', siteSize: '15.7 MB' });

  useEffect(() => {
    const loadUser = async () => {
      const { fileDB } = await import('@/lib/fileDB');
      const savedUser = await fileDB.getUser();
      if (savedUser) {
        setUser(savedUser);
        setEditedBio(savedUser.bio || '');
        setEditedAvatar(savedUser.avatar || '');
      }

      const savedUsers = localStorage.getItem('darkHavenAllUsers');
      if (savedUsers) {
        setAllUsers(JSON.parse(savedUsers));
      } else {
        const defaultUsers = [
          { username: 'admin', role: 'Администратор', registeredAt: new Date().toISOString(), bio: 'Главный администратор' },
          { username: 'user1', role: 'Участник', registeredAt: new Date().toISOString() }
        ];
        setAllUsers(defaultUsers);
        localStorage.setItem('darkHavenAllUsers', JSON.stringify(defaultUsers));
      }
    };
    loadUser();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    const updated = { ...user, bio: editedBio, avatar: editedAvatar };
    setUser(updated);
    const { fileDB } = await import('@/lib/fileDB');
    await fileDB.setUser(updated);
    localStorage.setItem('darkHavenUser', JSON.stringify(updated));
    setIsEditing(false);
  };

  const handleLogout = async () => {
    const { fileDB } = await import('@/lib/fileDB');
    await fileDB.setUser(null);
    localStorage.removeItem('darkHavenUser');
    setUser(null);
  };

  const handleRoleChange = (username: string, newRole: string) => {
    const updated = allUsers.map(u => u.username === username ? {...u, role: newRole} : u);
    setAllUsers(updated);
    localStorage.setItem('darkHavenAllUsers', JSON.stringify(updated));
  };

  const filteredUsers = allUsers.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!user) {
    return (
      <div className="animate-fade-in text-center py-20">
        <Icon name="UserX" size={64} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Войдите в систему</h3>
        <p className="text-muted-foreground">Чтобы просмотреть профиль, необходимо авторизоваться</p>
      </div>
    );
  }

  if (showUsers && user.isAdmin) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold glow-cyan mb-2">Пользователи</h2>
            <p className="text-muted-foreground">Управление пользователями системы</p>
          </div>
          <Button onClick={() => setShowUsers(false)} variant="outline">
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Назад
          </Button>
        </div>

        <Input
          placeholder="Поиск по никнейму..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-6"
        />

        <div className="space-y-3">
          {filteredUsers.map(u => (
            <Card key={u.username} className="bg-card/50 border-border backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      {u.avatar ? <AvatarImage src={u.avatar} /> : <AvatarFallback>{u.username[0].toUpperCase()}</AvatarFallback>}
                    </Avatar>
                    <div>
                      <h3 className="font-bold">{u.username}</h3>
                      <p className="text-sm text-muted-foreground">{u.bio || 'Нет описания'}</p>
                    </div>
                  </div>
                  <Select value={u.role} onValueChange={(val) => handleRoleChange(u.username, val)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Участник">Участник</SelectItem>
                      <SelectItem value="Модератор">Модератор</SelectItem>
                      <SelectItem value="Администратор">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold glow-cyan mb-2">Профиль</h2>
          <p className="text-muted-foreground">Информация об игроке</p>
        </div>
        <Button onClick={handleLogout} variant="destructive">
          <Icon name="LogOut" size={16} className="mr-2" />
          Выйти
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-card/50 border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Информация</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              {editedAvatar ? <AvatarImage src={editedAvatar} /> : <AvatarFallback className="text-4xl bg-primary/20 text-primary">{user.username[0].toUpperCase()}</AvatarFallback>}
            </Avatar>
            {isEditing && <Input placeholder="URL аватарки" value={editedAvatar} onChange={(e) => setEditedAvatar(e.target.value)} />}
            <div className="text-center w-full">
              <h3 className="text-2xl font-bold">{user.username}</h3>
              <div className="mt-2 inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">
                <Icon name="Shield" size={14} />
                <span>{user.role || 'Участник'}</span>
              </div>
              {isEditing ? (
                <Textarea placeholder="Расскажите о себе..." value={editedBio} onChange={(e) => setEditedBio(e.target.value)} className="mt-4" />
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">{user.bio || 'Нет описания'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card/50 border-border backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{user.isAdmin ? 'Статистика сервера' : 'Действия'}</CardTitle>
          </CardHeader>
          <CardContent>
            {user.isAdmin && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <Icon name="Users" size={24} className="text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.onlineUsers}</div>
                  <div className="text-xs text-muted-foreground">Онлайн</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                  <Icon name="UserCheck" size={24} className="text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <div className="text-xs text-muted-foreground">Всего</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <Icon name="Database" size={24} className="text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.dbSize}</div>
                  <div className="text-xs text-muted-foreground">БД</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <Icon name="HardDrive" size={24} className="text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.siteSize}</div>
                  <div className="text-xs text-muted-foreground">Сайт</div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {isEditing ? (
                <>
                  <Button className="w-full" onClick={handleSaveProfile}>
                    <Icon name="Save" size={16} className="mr-2" />
                    Сохранить
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => setIsEditing(false)}>
                    Отмена
                  </Button>
                </>
              ) : (
                <Button className="w-full" variant="outline" onClick={() => setIsEditing(true)}>
                  <Icon name="Edit" size={16} className="mr-2" />
                  Редактировать профиль
                </Button>
              )}
              {user.isAdmin && (
                <Button className="w-full" variant="outline" onClick={() => setShowUsers(true)}>
                  <Icon name="Users" size={16} className="mr-2" />
                  Управление пользователями
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSection;