import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { CustomTab } from '@/types/editor';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isAuthenticated: boolean;
  user: { username: string; isAdmin: boolean } | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onAdminClick: () => void;
  isEditing?: boolean;
  onToggleEdit?: () => void;
  onOpenSidebar: () => void;
  customTabs?: CustomTab[];
  onAddTab?: () => void;
  onDeleteTab?: (tabId: string) => void;
}

const Header = ({
  activeSection,
  setActiveSection,
  isAuthenticated,
  user,
  onLoginClick,
  onLogout,
  onAdminClick,
  isEditing = false,
  onToggleEdit,
  onOpenSidebar,
  customTabs = [],
  onAddTab,
  onDeleteTab
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
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenSidebar}
              className="hover:bg-primary/10"
            >
              <Icon name="Menu" size={24} className="text-primary" />
            </Button>

            <div className="flex flex-col">
              <div className="text-3xl font-bold glow-cyan">
                DARK HAVEN
              </div>
              <div className="hidden md:block text-xs text-muted-foreground">
                Space Station 14
              </div>
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

            {customTabs.map(tab => (
              <div key={tab.id} className="relative group inline-flex">
                <Button
                  variant={activeSection === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveSection(tab.id)}
                  className={`transition-all duration-300 ${
                    activeSection === tab.id 
                      ? 'animate-pulse-glow' 
                      : 'hover:text-secondary'
                  }`}
                >
                  <Icon name={tab.icon as any} size={16} className="mr-2" />
                  {tab.name}
                </Button>
                {isEditing && onDeleteTab && (
                  <button
                    onClick={() => onDeleteTab(tab.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:scale-110"
                  >
                    <Icon name="X" size={12} className="text-white" />
                  </button>
                )}
              </div>
            ))}

            {isEditing && onAddTab && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAddTab}
                className="border-primary hover:bg-primary/10 animate-pulse"
              >
                <Icon name="Plus" size={16} />
              </Button>
            )}
          </nav>

          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30">
                  <Icon name="User" size={16} className="text-primary" />
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
                
                {user?.isAdmin && onToggleEdit && (
                  <Button
                    variant={isEditing ? 'default' : 'outline'}
                    size="sm"
                    onClick={onToggleEdit}
                    className={isEditing ? 'border-accent bg-accent text-accent-foreground animate-pulse-glow' : 'border-accent text-accent hover:bg-accent/10'}
                  >
                    <Icon name={isEditing ? 'Eye' : 'Edit'} size={16} className="mr-2" />
                    {isEditing ? 'Редактор' : 'Режим правки'}
                  </Button>
                )}

                {user?.isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAdminClick}
                    className="border-secondary text-secondary hover:bg-secondary/10"
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    Панель
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