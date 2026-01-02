import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SpaceBackground from '@/components/SpaceBackground';
import Hero from '@/components/Hero';
import MainContent from '@/components/MainContent';
import AudioPlayer from '@/components/AudioPlayer';
import AuthModal from '@/components/AuthModal';
import AdminPanel from '@/components/AdminPanel';
import WireCaptcha from '@/components/WireCaptcha';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('darkHavenUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
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
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <SpaceBackground />
      <AudioPlayer />
      
      <Header 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isAuthenticated={isAuthenticated}
        user={user}
        onLoginClick={() => setShowAuth(true)}
        onLogout={handleLogout}
        onAdminClick={() => setShowAdmin(true)}
      />

      <main className="relative z-10">
        {activeSection === 'home' && <Hero />}
        <MainContent activeSection={activeSection} />
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
        />
      )}
    </div>
  );
};

export default Index;
