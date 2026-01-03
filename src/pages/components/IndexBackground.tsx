import SpaceBackground from '@/components/SpaceBackground';
import AudioPlayer from '@/components/AudioPlayer';
import LogoEditor from '@/components/LogoEditor';

interface IndexBackgroundProps {
  activeSection: string;
  isEditing: boolean;
}

const IndexBackground = ({ activeSection, isEditing }: IndexBackgroundProps) => {
  return (
    <>
      <SpaceBackground activeSection={activeSection} />
      <AudioPlayer />
      <LogoEditor isEditing={isEditing} />
    </>
  );
};

export default IndexBackground;
