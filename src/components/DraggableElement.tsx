import { useState, useRef, useEffect } from 'react';
import { PageElement } from '@/types/editor';

interface DraggableElementProps {
  element: PageElement;
  isEditing: boolean;
  onUpdate: (element: PageElement) => void;
  onClick: () => void;
}

const DraggableElement = ({ element, isEditing, onUpdate, onClick }: DraggableElementProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditing) return;
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - element.position.x,
      y: e.clientY - element.position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !isEditing) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      onUpdate({
        ...element,
        position: { x: newX, y: newY }
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, element, onUpdate, isEditing]);

  const getHoverClass = () => {
    if (isEditing || !element.styles.hoverAnimation) return '';
    
    switch (element.styles.hoverAnimation) {
      case 'scale':
        return 'hover:scale-110';
      case 'glow':
        return 'hover:brightness-125';
      case 'lift':
        return 'hover:-translate-y-2';
      case 'tilt':
        return 'hover:rotate-2';
      case 'pulse':
        return 'hover:animate-pulse';
      default:
        return '';
    }
  };

  const getElementStyle = (): React.CSSProperties => {
    const hoverScale = isHovered && !isEditing ? (element.styles.hoverScale || 1) : 1;
    const hoverGlow = isHovered && !isEditing && element.styles.hoverGlow;
    
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.position.x,
      top: element.position.y,
      width: element.size.width,
      minHeight: element.size.height,
      backgroundColor: element.styles.backgroundColor,
      color: element.styles.textColor,
      fontSize: element.styles.fontSize,
      fontWeight: element.styles.fontWeight,
      borderRadius: element.styles.borderRadius,
      padding: element.styles.padding,
      cursor: isEditing ? 'move' : element.type === 'button' ? 'pointer' : 'default',
      border: isEditing ? '2px dashed rgba(0, 217, 255, 0.5)' : 'none',
      boxShadow: hoverGlow
        ? `0 0 30px ${element.styles.hoverColor || element.styles.glowColor || '#00d9ff'}`
        : element.styles.glowIntensity 
        ? `0 0 ${element.styles.glowIntensity}px ${element.styles.glowColor}`
        : 'none',
      backgroundImage: element.styles.backgroundImage 
        ? `url(${element.styles.backgroundImage})`
        : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transform: `scale(${hoverScale})`,
      transition: 'all 0.3s ease',
      zIndex: isDragging ? 1000 : 10
    };

    return baseStyle;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.stopPropagation();
      onClick();
    } else if (element.type === 'button' && element.link) {
      window.open(element.link, '_blank');
    }
  };

  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <div 
            className={element.styles.animation ? `animate-${element.styles.animation}` : ''}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {element.content || 'Двойной клик для редактирования'}
          </div>
        );

      case 'button':
        return (
          <button
            className={`w-full h-full flex items-center justify-center font-semibold ${
              element.styles.animation ? `animate-${element.styles.animation}` : ''
            }`}
          >
            {element.content || 'Кнопка'}
          </button>
        );

      case 'image':
        return (
          <img
            src={element.imageUrl || 'https://via.placeholder.com/300'}
            alt={element.content}
            className={`w-full h-full object-cover ${
              element.styles.animation ? `animate-${element.styles.animation}` : ''
            }`}
            style={{ borderRadius: element.styles.borderRadius }}
          />
        );

      case 'video':
        return (
          <video
            src={element.videoUrl}
            controls
            className={`w-full h-full object-cover ${
              element.styles.animation ? `animate-${element.styles.animation}` : ''
            }`}
            style={{ borderRadius: element.styles.borderRadius }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={elementRef}
      style={getElementStyle()}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`select-none ${getHoverClass()} ${
        isEditing ? 'hover:outline hover:outline-2 hover:outline-cyan-500 hover:shadow-lg hover:shadow-cyan-500/50 cursor-move' : ''
      }`}
    >
      {renderContent()}
    </div>
  );
};

export default DraggableElement;