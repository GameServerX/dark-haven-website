import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MapCanvasProps {
  mapData: any;
  mapName: string;
}

interface ViewportState {
  x: number;
  y: number;
  scale: number;
}

const MapCanvas = ({ mapData, mapName }: MapCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewport, setViewport] = useState<ViewportState>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const tileColors: Record<string, string> = {
    'floor': '#4a5568',
    'wall': '#2d3748',
    'space': '#1a202c',
    'plating': '#718096',
    'window': '#63b3ed',
    'door': '#f6ad55',
    'default': '#a0aec0'
  };

  const renderMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(viewport.x, viewport.y);
    ctx.scale(viewport.scale, viewport.scale);

    const tileSize = 32;

    if (mapData.grids && Array.isArray(mapData.grids)) {
      mapData.grids.forEach((grid: any) => {
        if (!grid.tiles) return;

        grid.tiles.forEach((tile: any) => {
          const x = tile.x * tileSize;
          const y = tile.y * tileSize;

          const tileType = tile.tile?.toLowerCase() || 'default';
          let color = tileColors.default;

          for (const [key, value] of Object.entries(tileColors)) {
            if (tileType.includes(key)) {
              color = value;
              break;
            }
          }

          ctx.fillStyle = color;
          ctx.fillRect(x, y, tileSize, tileSize);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, tileSize, tileSize);
        });

        if (grid.entities && Array.isArray(grid.entities)) {
          grid.entities.forEach((entity: any) => {
            if (!entity.pos) return;

            const x = entity.pos.x * tileSize;
            const y = entity.pos.y * tileSize;

            ctx.fillStyle = '#48bb78';
            ctx.beginPath();
            ctx.arc(x + tileSize / 2, y + tileSize / 2, tileSize / 4, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      });
    } else if (mapData.tilemap) {
      const rows = mapData.tilemap.length;
      const cols = mapData.tilemap[0]?.length || 0;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const tile = mapData.tilemap[y][x];
          const color = tile === 0 ? tileColors.space : tileColors.floor;

          ctx.fillStyle = color;
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    }

    ctx.restore();
  };

  useEffect(() => {
    renderMap();
  }, [viewport, mapData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        renderMap();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(5, viewport.scale * delta));

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - viewport.x) / viewport.scale;
    const worldY = (mouseY - viewport.y) / viewport.scale;

    const newX = mouseX - worldX * newScale;
    const newY = mouseY - worldY * newScale;

    setViewport({ x: newX, y: newY, scale: newScale });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setViewport({
      ...viewport,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setViewport({ x: 0, y: 0, scale: 1 });
  };

  const handleZoomIn = () => {
    setViewport({ ...viewport, scale: Math.min(5, viewport.scale * 1.2) });
  };

  const handleZoomOut = () => {
    setViewport({ ...viewport, scale: Math.max(0.1, viewport.scale * 0.8) });
  };

  return (
    <div className="relative w-full h-full bg-background/50">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <div className="absolute top-4 right-4 flex flex-col space-y-2 bg-card/90 backdrop-blur-sm p-2 rounded-lg border border-border">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomIn}
          title="Увеличить"
        >
          <Icon name="ZoomIn" size={20} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomOut}
          title="Уменьшить"
        >
          <Icon name="ZoomOut" size={20} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleReset}
          title="Сбросить вид"
        >
          <Icon name="Maximize2" size={20} />
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
        <div className="text-sm space-y-1">
          <p className="font-semibold">{mapName}</p>
          <p className="text-muted-foreground text-xs">
            Масштаб: {(viewport.scale * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapCanvas;
