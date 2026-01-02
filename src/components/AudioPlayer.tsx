import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-card/90 backdrop-blur-lg border border-primary/30 rounded-lg shadow-lg transition-all duration-300 ${
        isExpanded ? 'w-80 p-4' : 'w-14 h-14'
      }`}>
        {isExpanded ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Music" size={20} className="text-primary" />
                <span className="text-sm font-medium">Космическая музыка</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                <Icon name="ChevronDown" size={16} />
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
                className="border-primary hover:bg-primary/10"
              >
                {isPlaying ? (
                  <Icon name="Pause" size={16} />
                ) : (
                  <Icon name="Play" size={16} />
                )}
              </Button>

              <div className="flex-1 flex items-center space-x-2">
                <Icon name="Volume2" size={16} className="text-muted-foreground" />
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(true)}
            className="w-full h-full animate-pulse-glow"
          >
            <Icon name="Music" size={20} className="text-primary" />
          </Button>
        )}
      </div>

      <audio
        ref={audioRef}
        loop
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      />
    </div>
  );
};

export default AudioPlayer;
