import { useEffect, useRef, useState } from 'react';

interface SpaceBackgroundProps {
  activeSection?: string;
}

const SpaceBackground = ({ activeSection = 'home' }: SpaceBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [pageBackground, setPageBackground] = useState<any>(null);

  useEffect(() => {
    const savedBackgrounds = localStorage.getItem('darkHavenPageBackgrounds');
    if (savedBackgrounds) {
      const backgrounds = JSON.parse(savedBackgrounds);
      setPageBackground(backgrounds[activeSection]);
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

  const getBackgroundStyle = () => {
    if (pageBackground?.type === 'video' && pageBackground.url) {
      return {};
    }
    
    if (pageBackground?.type === 'static' && pageBackground.url) {
      return {
        backgroundImage: `url(${pageBackground.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: pageBackground.type === 'parallax' ? 'fixed' : 'scroll'
      };
    }

    return {
      background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)'
    };
  };

  return (
    <>
      {pageBackground?.type === 'video' && pageBackground.url ? (
        <video
          className="fixed inset-0 z-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={pageBackground.url} type="video/mp4" />
        </video>
      ) : (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 z-0"
          style={getBackgroundStyle()}
        />
      )}
    </>
  );
};

export default SpaceBackground;
