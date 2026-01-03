import Header from '@/components/Header';
import EditableHero from '@/components/EditableHero';
import MainContent from '@/components/MainContent';
import DraggableElement from '@/components/DraggableElement';
import AIChat from '@/components/AIChat';
import MapViewer from './MapViewer';
import IndexBackground from './components/IndexBackground';
import IndexModals from './components/IndexModals';
import IndexEditorTools from './components/IndexEditorTools';
import { useIndexState } from './hooks/useIndexState';

const Index = () => {
  const {
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
    selectedElement,
    setSelectedElement,
    showSidebar,
    setShowSidebar,
    showTabManager,
    setShowTabManager,
    customTabs,
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
  } = useIndexState();

  if (showMapViewer) {
    return <MapViewer isAdmin={user?.isAdmin || false} onBack={() => setShowMapViewer(false)} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background" onClick={handlePageClick}>
      <IndexBackground activeSection={activeSection} isEditing={isEditing} />
      
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

      <main className="relative z-10 page-transition transition-all duration-700 ease-in-out" style={{ paddingTop: '80px', minHeight: `${currentPageHeight}vh` }} key={activeSection}>
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

      <IndexModals
        showAuth={showAuth}
        setShowAuth={setShowAuth}
        showCaptcha={showCaptcha}
        showAdmin={showAdmin}
        setShowAdmin={setShowAdmin}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        showTabManager={showTabManager}
        setShowTabManager={setShowTabManager}
        isEditing={isEditing}
        user={user}
        handleAuthSuccess={handleAuthSuccess}
        handleCaptchaSuccess={handleCaptchaSuccess}
        handleToggleEdit={handleToggleEdit}
        setActiveSection={setActiveSection}
        handleDeleteTab={handleDeleteTab}
        handleCreateTab={handleCreateTab}
        setShowMapViewer={setShowMapViewer}
      />

      <IndexEditorTools
        isEditing={isEditing}
        currentPageHeight={currentPageHeight}
        selectedElement={selectedElement}
        handleToggleEdit={handleToggleEdit}
        handleAddElement={handleAddElement}
        handleSaveElements={handleSaveElements}
        handlePageHeightChange={handlePageHeightChange}
        handleUpdateElement={handleUpdateElement}
        handleDeleteElement={handleDeleteElement}
        setSelectedElement={setSelectedElement}
      />

      <AIChat />
    </div>
  );
};

export default Index;
