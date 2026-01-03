import { useState, useEffect } from 'react';
import { PageElement, CustomTab } from '@/types/editor';
import { localDB } from '@/lib/localDB';
import { fileDB } from '@/lib/fileDB';

export const useIndexState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null);
  const [showMapViewer, setShowMapViewer] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [elements, setElements] = useState<Record<string, PageElement[]>>({});
  const [selectedElement, setSelectedElement] = useState<PageElement | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showTabManager, setShowTabManager] = useState(false);
  const [customTabs, setCustomTabs] = useState<CustomTab[]>([]);
  const [sidebarTabs, setSidebarTabs] = useState<CustomTab[]>([]);
  const [pageHeights, setPageHeights] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadData = async () => {
      const savedUser = await fileDB.getUser();
      if (savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
      }

      const savedElements = await fileDB.getElements();
      if (savedElements) {
        setElements(savedElements as Record<string, PageElement[]>);
      }

      const savedCustomTabs = await fileDB.getCustomTabs();
      if (savedCustomTabs) {
        setCustomTabs(savedCustomTabs);
      }

      const savedSidebarTabs = await fileDB.getSidebarTabs();
      if (savedSidebarTabs) {
        setSidebarTabs(savedSidebarTabs);
      }

      const savedPageHeights = await fileDB.getPageHeights();
      if (savedPageHeights) {
        setPageHeights(savedPageHeights);
      }
    };

    loadData();
  }, []);

  const handleAuthSuccess = (username: string, isAdmin: boolean) => {
    setUser({ username, isAdmin });
    setShowCaptcha(true);
  };

  const handleCaptchaSuccess = async () => {
    const userData = { username: user?.username || 'Guest', isAdmin: user?.isAdmin || false };
    await fileDB.setUser(userData);
    localDB.setUser(userData);
    setIsAuthenticated(true);
    setShowCaptcha(false);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    await fileDB.setUser(null);
    localDB.setUser(null);
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

  const handleSaveElements = async () => {
    await fileDB.updateAllElements(elements);
    await fileDB.updateAllPageHeights(pageHeights);
    localDB.updateAllElements(elements);
    localDB.updateAllPageHeights(pageHeights);
  };

  const handlePageHeightChange = (height: number) => {
    setPageHeights({
      ...pageHeights,
      [activeSection]: height
    });
  };

  const currentPageHeight = pageHeights[activeSection] || 100;

  const handleCreateTab = async (name: string, icon: string, location: 'header' | 'sidebar') => {
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
      await fileDB.setCustomTabs(updated);
      localDB.setCustomTabs(updated);
    } else {
      const updated = [...sidebarTabs, newTab];
      setSidebarTabs(updated);
      await fileDB.setSidebarTabs(updated);
      localDB.setSidebarTabs(updated);
    }
  };

  const handleDeleteTab = async (tabId: string) => {
    const updatedCustomTabs = customTabs.filter(tab => tab.id !== tabId);
    const updatedSidebarTabs = sidebarTabs.filter(tab => tab.id !== tabId);
    
    setCustomTabs(updatedCustomTabs);
    setSidebarTabs(updatedSidebarTabs);
    
    await fileDB.setCustomTabs(updatedCustomTabs);
    await fileDB.setSidebarTabs(updatedSidebarTabs);
    localDB.setCustomTabs(updatedCustomTabs);
    localDB.setSidebarTabs(updatedSidebarTabs);
    
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

  return {
    isAuthenticated,
    showAuth,
    setShowAuth,
    showCaptcha,
    showAdmin,
    setShowAdmin,
    activeSection,
    setActiveSection,
    user,
    showMapViewer,
    setShowMapViewer,
    isEditing,
    elements,
    selectedElement,
    setSelectedElement,
    showSidebar,
    setShowSidebar,
    showTabManager,
    setShowTabManager,
    customTabs,
    sidebarTabs,
    currentPageHeight,
    currentElements,
    handleAuthSuccess,
    handleCaptchaSuccess,
    handleLogout,
    handleToggleEdit,
    handleAddElement,
    handleUpdateElement,
    handleDeleteElement,
    handleSaveElements,
    handlePageHeightChange,
    handleCreateTab,
    handleDeleteTab,
    handlePageClick
  };
};
