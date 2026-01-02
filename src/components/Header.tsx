import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isAuthenticated: boolean;
  user: { username: string; isAdmin: boolean } | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onAdminClick: () => void;
}

const Header = ({
  activeSection,
  setActiveSection,
  isAuthenticated,
  user,
  onLoginClick,
  onLogout,
  onAdminClick
}: HeaderProps) => {
  const sections = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'news', label: 'Новости', icon: 'Newspaper' },
    { id: 'development', label: 'Развитие', icon: 'Rocket' },
    { id: 'wiki', label: 'Вики', icon: 'BookOpen' },
    { id: 'rules', label: 'Правила', icon: 'ScrollText' },
    { id: 'chat', label: 'Чат', icon: 'MessageSquare' },
    { id: 'profile', label: 'Профиль', icon: 'User' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold glow-cyan">
              DARK HAVEN
            </div>
            <div className="hidden md:block text-sm text-muted-foreground">
              Space Station 14
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            {sections.map(section => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className={`relative transition-all duration-300 ${
                  activeSection === section.id 
                    ? 'animate-pulse-glow' 
                    : 'hover:text-primary'
                }`}
              >
                <Icon name={section.icon as any} size={16} className="mr-2" />
                {section.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30">
                  <Icon name="User" size={16} className="text-primary" />
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
                {user?.isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAdminClick}
                    className="border-accent text-accent hover:bg-accent/10"
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    Админ
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                >
                  <Icon name="LogOut" size={16} />
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={onLoginClick}
                className="animate-pulse-glow"
              >
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
