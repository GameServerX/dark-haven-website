import { useEffect, useRef, useState } from 'react';

interface SpaceBackgroundProps {
  activeSection?: string;
}

const SpaceBackground = ({ activeSection = 'home' }: SpaceBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('darkHavenSiteConfig');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
    }
  }, [activeSection]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;

    const stars: { x: number; y: number; size: number; speed: number; layer: number }[] = [];
    const starCount = 300;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
        layer: Math.random() < 0.3 ? 1 : Math.random() < 0.6 ? 2 : 3
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        const parallaxOffset = scrollY * (star.layer * 0.1);
        const adjustedY = (star.y - parallaxOffset + canvas.height) % canvas.height;

        const opacity = 1 - (star.layer - 1) * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.shadowBlur = 10 / star.layer;
        ctx.shadowColor = star.layer === 1 ? '#00d9ff' : '#ffffff';
        ctx.fillRect(star.x, adjustedY, star.size, star.size);
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scrollY]);

  const background = config?.backgrounds?.[activeSection];
  const hasParallax = background?.parallax === true;

  return (
    <>
      {background?.type === 'video' && background.url ? (
        <div className="fixed inset-0 z-0 overflow-hidden">
          <video
            className="absolute w-full h-full object-cover"
            style={{
              transform: hasParallax ? `translateY(${scrollY * 0.5}px)` : 'none',
              transition: 'transform 0.1s ease-out'
            }}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={background.url} type="video/mp4" />
          </video>
        </div>
      ) : background?.type === 'image' && background.url ? (
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${background.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: hasParallax ? `translateY(${scrollY * 0.5}px)` : 'none',
            transition: hasParallax ? 'transform 0.1s ease-out' : 'none',
            willChange: hasParallax ? 'transform' : 'auto'
          }}
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)'
          }}
        />
      )}
      {(background?.type === 'image' || background?.type === 'video') && (
        <div className="fixed inset-0 z-0 bg-black/40 pointer-events-none" />
      )}
    </>
  );
};

export default SpaceBackground;
