import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { MusicTrack } from '@/types/editor';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const defaultTracks: MusicTrack[] = [
    {
      id: '1',
      title: 'Space Ambient 1',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      id: '2',
      title: 'Space Ambient 2',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
      id: '3',
      title: 'Space Ambient 3',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    }
  ];

  useEffect(() => {
    const savedTracks = localStorage.getItem('darkHavenTracks');
    if (savedTracks) {
      setTracks(JSON.parse(savedTracks));
    } else {
      setTracks(defaultTracks);
      localStorage.setItem('darkHavenTracks', JSON.stringify(defaultTracks));
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      audioRef.current.src = tracks[currentTrackIndex].url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, tracks]);

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

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  if (tracks.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className={`bg-card/90 backdrop-blur-lg border border-primary/30 rounded-lg shadow-lg transition-all duration-300 ${
        isExpanded ? 'w-80 p-4' : 'w-14 h-14'
      }`}>
        {isExpanded ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Music" size={20} className="text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {tracks[currentTrackIndex].title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentTrackIndex + 1} / {tracks.length}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                <Icon name="ChevronDown" size={16} />
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTrack}
                className="border-primary/30 hover:bg-primary/10"
              >
                <Icon name="SkipBack" size={16} />
              </Button>

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

              <Button
                variant="outline"
                size="sm"
                onClick={nextTrack}
                className="border-primary/30 hover:bg-primary/10"
              >
                <Icon name="SkipForward" size={16} />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Icon name="Volume2" size={16} className="text-muted-foreground" />
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8">{volume}%</span>
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
        onEnded={handleTrackEnd}
        src={tracks[currentTrackIndex]?.url}
      />
    </div>
  );
};

export default AudioPlayer;