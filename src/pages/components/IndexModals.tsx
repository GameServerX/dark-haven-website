import AuthModal from '@/components/AuthModal';
import WireCaptcha from '@/components/WireCaptcha';
import AdminPanel from '@/components/AdminPanel';
import SidebarMenu from '@/components/SidebarMenu';
import TabManager from '@/components/TabManager';
import DatabaseExport from '@/components/DatabaseExport';

interface IndexModalsProps {
  showAuth: boolean;
  setShowAuth: (show: boolean) => void;
  showCaptcha: boolean;
  showAdmin: boolean;
  setShowAdmin: (show: boolean) => void;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  showTabManager: boolean;
  setShowTabManager: (show: boolean) => void;
  isEditing: boolean;
  user: { username: string; isAdmin: boolean } | null;
  handleAuthSuccess: (username: string, isAdmin: boolean) => void;
  handleCaptchaSuccess: () => void;
  handleToggleEdit: () => void;
  setActiveSection: (section: string) => void;
  handleDeleteTab: (tabId: string) => void;
  handleCreateTab: (name: string, icon: string, location: 'header' | 'sidebar') => void;
  setShowMapViewer: (show: boolean) => void;
}

const IndexModals = ({
  showAuth,
  setShowAuth,
  showCaptcha,
  showAdmin,
  setShowAdmin,
  showSidebar,
  setShowSidebar,
  showTabManager,
  setShowTabManager,
  isEditing,
  user,
  handleAuthSuccess,
  handleCaptchaSuccess,
  handleToggleEdit,
  setActiveSection,
  handleDeleteTab,
  handleCreateTab,
  setShowMapViewer
}: IndexModalsProps) => {
  return (
    <>
      <AuthModal 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />

      <WireCaptcha
        isOpen={showCaptcha}
        onClose={() => setShowAuth(false)}
        onSuccess={handleCaptchaSuccess}
      />

      {user?.isAdmin && (
        <>
          <AdminPanel 
            isOpen={showAdmin}
            onClose={() => setShowAdmin(false)}
            onToggleEdit={handleToggleEdit}
            isEditing={isEditing}
          />
          <DatabaseExport isAdmin={true} />
        </>
      )}

      <SidebarMenu
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onSelectTab={setActiveSection}
        isEditing={isEditing}
        onAddTab={() => setShowTabManager(true)}
        onDeleteTab={handleDeleteTab}
        onMapViewerClick={() => setShowMapViewer(true)}
      />

      <TabManager
        isOpen={showTabManager}
        onClose={() => setShowTabManager(false)}
        onCreateTab={handleCreateTab}
      />
    </>
  );
};

export default IndexModals;
