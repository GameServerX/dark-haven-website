import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SpaceBackground from '@/components/SpaceBackground';
import EditableHero from '@/components/EditableHero';
import MainContent from '@/components/MainContent';
import AudioPlayer from '@/components/AudioPlayer';
import AuthModal from '@/components/AuthModal';
import AdminPanel from '@/components/AdminPanel';
import WireCaptcha from '@/components/WireCaptcha';
import EditorToolbar from '@/components/EditorToolbar';
import ElementEditor from '@/components/ElementEditor';
import DraggableElement from '@/components/DraggableElement';
import SidebarMenu from '@/components/SidebarMenu';
import TabManager from '@/components/TabManager';
import AIChat from '@/components/AIChat';
import { PageElement, CustomTab } from '@/types/editor';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [elements, setElements] = useState<Record<string, PageElement[]>>({});
  const [selectedElement, setSelectedElement] = useState<PageElement | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showTabManager, setShowTabManager] = useState(false);
  const [customTabs, setCustomTabs] = useState<CustomTab[]>([]);
  const [sidebarTabs, setSidebarTabs] = useState<CustomTab[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('darkHavenUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }

    const savedElements = localStorage.getItem('darkHavenElements');
    if (savedElements) {
      setElements(JSON.parse(savedElements));
    }

    const savedCustomTabs = localStorage.getItem('darkHavenCustomTabs');
    if (savedCustomTabs) {
      setCustomTabs(JSON.parse(savedCustomTabs));
    }

    const savedSidebarTabs = localStorage.getItem('darkHavenSidebarTabs');
    if (savedSidebarTabs) {
      setSidebarTabs(JSON.parse(savedSidebarTabs));
    }
  }, []);

  const handleAuthSuccess = (username: string, isAdmin: boolean) => {
    setUser({ username, isAdmin });
    setShowCaptcha(true);
  };

  const handleCaptchaSuccess = () => {
    const userData = { username: user?.username || 'Guest', isAdmin: user?.isAdmin || false };
    localStorage.setItem('darkHavenUser', JSON.stringify(userData));
    setIsAuthenticated(true);
    setShowCaptcha(false);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('darkHavenUser');
    setUser(null);
    setIsAuthenticated(false);
    setIsEditing(false);
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    setSelectedElement(null);
  };

  const handleAddElement = (type: 'text' | 'button' | 'image' | 'video') => {
    const newElement: PageElement = {
      id: `${type}-${Date.now()}`,
      type,
      content: type === 'text' ? 'Новый текст' : type === 'button' ? 'Кнопка' : '',
      position: { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 50 },
      size: { 
        width: type === 'text' ? 300 : type === 'button' ? 200 : 400, 
        height: type === 'text' ? 100 : type === 'button' ? 50 : 300 
      },
      styles: {
        backgroundColor: type === 'button' ? '#00d9ff' : 'rgba(26, 26, 46, 0.8)',
        textColor: '#ffffff',
        fontSize: 16,
        fontWeight: 'normal',
        borderRadius: 8,
        padding: 16,
        glowColor: '#00d9ff',
        glowIntensity: 0,
        animation: 'none'
      }
    };

    const currentElements = elements[activeSection] || [];
    setElements({
      ...elements,
      [activeSection]: [...currentElements, newElement]
    });
    setSelectedElement(newElement);
  };

  const handleUpdateElement = (updatedElement: PageElement) => {
    const currentElements = elements[activeSection] || [];
    const updated = currentElements.map(el => 
      el.id === updatedElement.id ? updatedElement : el
    );
    setElements({
      ...elements,
      [activeSection]: updated
    });
    setSelectedElement(updatedElement);
  };

  const handleDeleteElement = () => {
    if (!selectedElement) return;
    
    const currentElements = elements[activeSection] || [];
    const filtered = currentElements.filter(el => el.id !== selectedElement.id);
    setElements({
      ...elements,
      [activeSection]: filtered
    });
    setSelectedElement(null);
  };

  const handleSaveElements = () => {
    localStorage.setItem('darkHavenElements', JSON.stringify(elements));
  };

  const handleCreateTab = (name: string, icon: string, location: 'header' | 'sidebar') => {
    const newTab: CustomTab = {
      id: `custom-${Date.now()}`,
      name,
      icon,
      elements: [],
      isCustom: true
    };

    if (location === 'header') {
      const updated = [...customTabs, newTab];
      setCustomTabs(updated);
      localStorage.setItem('darkHavenCustomTabs', JSON.stringify(updated));
    } else {
      const updated = [...sidebarTabs, newTab];
      setSidebarTabs(updated);
      localStorage.setItem('darkHavenSidebarTabs', JSON.stringify(updated));
    }
  };

  const handleDeleteTab = (tabId: string) => {
    const updatedCustomTabs = customTabs.filter(tab => tab.id !== tabId);
    const updatedSidebarTabs = sidebarTabs.filter(tab => tab.id !== tabId);
    
    setCustomTabs(updatedCustomTabs);
    setSidebarTabs(updatedSidebarTabs);
    
    localStorage.setItem('darkHavenCustomTabs', JSON.stringify(updatedCustomTabs));
    localStorage.setItem('darkHavenSidebarTabs', JSON.stringify(updatedSidebarTabs));
    
    if (activeSection === tabId) {
      setActiveSection('home');
    }
  };

  const handlePageClick = (e: React.MouseEvent) => {
    if (isEditing && e.target === e.currentTarget) {
      setSelectedElement(null);
    }
  };

  const currentElements = elements[activeSection] || [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background" onClick={handlePageClick}>
      <SpaceBackground activeSection={activeSection} />
      <AudioPlayer />
      
      <Header 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isAuthenticated={isAuthenticated}
        user={user}
        onLoginClick={() => setShowAuth(true)}
        onLogout={handleLogout}
        onAdminClick={() => setShowAdmin(true)}
        isEditing={isEditing}
        onToggleEdit={user?.isAdmin ? handleToggleEdit : undefined}
        onOpenSidebar={() => setShowSidebar(true)}
        customTabs={customTabs}
        onAddTab={isEditing ? () => setShowTabManager(true) : undefined}
        onDeleteTab={handleDeleteTab}
      />

      <main className="relative z-10 min-h-screen page-transition" style={{ paddingTop: '80px' }} key={activeSection}>
        {activeSection === 'home' && <EditableHero isEditing={isEditing} />}
        {activeSection !== 'home' && <MainContent activeSection={activeSection} />}
        
        {currentElements.map(element => (
          <DraggableElement
            key={element.id}
            element={element}
            isEditing={isEditing}
            onUpdate={handleUpdateElement}
            onClick={() => setSelectedElement(element)}
          />
        ))}
      </main>

      <AuthModal 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />

      <WireCaptcha
        isOpen={showCaptcha}
        onClose={() => setShowCaptcha(false)}
        onSuccess={handleCaptchaSuccess}
      />

      {user?.isAdmin && (
        <AdminPanel 
          isOpen={showAdmin}
          onClose={() => setShowAdmin(false)}
          onToggleEdit={handleToggleEdit}
          isEditing={isEditing}
        />
      )}

      {isEditing && (
        <>
          <EditorToolbar
            isEditing={isEditing}
            onToggleEdit={handleToggleEdit}
            onAddElement={handleAddElement}
            onSave={handleSaveElements}
          />

          <ElementEditor
            element={selectedElement}
            onUpdate={handleUpdateElement}
            onDelete={handleDeleteElement}
            onClose={() => setSelectedElement(null)}
          />
        </>
      )}

      <SidebarMenu
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onSelectTab={setActiveSection}
        isEditing={isEditing}
        onAddTab={() => setShowTabManager(true)}
        onDeleteTab={handleDeleteTab}
      />

      <TabManager
        isOpen={showTabManager}
        onClose={() => setShowTabManager(false)}
        onCreateTab={handleCreateTab}
      />

      <AIChat />
    </div>
  );
};

export default Index;