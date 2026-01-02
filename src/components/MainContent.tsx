import NewsSection from './sections/NewsSection';
import DevelopmentSection from './sections/DevelopmentSection';
import WikiSection from './sections/WikiSection';
import RulesSection from './sections/RulesSection';
import ChatSection from './sections/ChatSection';
import ProfileSection from './sections/ProfileSection';
import AIChatSection from './sections/AIChatSection';

interface MainContentProps {
  activeSection: string;
}

const MainContent = ({ activeSection }: MainContentProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {activeSection === 'news' && <NewsSection />}
      {activeSection === 'development' && <DevelopmentSection />}
      {activeSection === 'wiki' && <WikiSection />}
      {activeSection === 'rules' && <RulesSection />}
      {activeSection === 'chat' && <ChatSection />}
      {activeSection === 'ai-chat' && <AIChatSection />}
      {activeSection === 'profile' && <ProfileSection />}
    </div>
  );
};

export default MainContent;