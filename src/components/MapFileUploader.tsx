import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MapFileUploaderProps {
  onMapUploaded: (mapData: any) => void;
}

const MapFileUploader = ({ onMapUploaded }: MapFileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processMapFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const mapData = JSON.parse(text);

      if (!mapData.grids && !mapData.tilemap) {
        throw new Error('Неверный формат файла карты SS14');
      }

      const processedMap = {
        id: `uploaded-${Date.now()}`,
        name: file.name.replace('.yml', '').replace('.json', ''),
        file: file,
        data: mapData,
        uploadedAt: new Date().toISOString()
      };

      onMapUploaded(processedMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обработке файла');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processMapFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processMapFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <Card className="bg-card/50 border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon name="Upload" size={20} />
          <span>Загрузка файла карты</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Icon name="Info" size={16} className="mr-2" />
          <AlertDescription>
            Поддерживаются файлы карт SS14 в форматах .yml и .json
          </AlertDescription>
        </Alert>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin">
                <Icon name="Loader2" size={32} className="text-primary" />
              </div>
              <p className="text-muted-foreground">Обработка файла...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <Icon name="FileUp" size={48} className="text-muted-foreground" />
              <div>
                <p className="text-lg font-medium mb-1">
                  Перетащите файл карты сюда
                </p>
                <p className="text-sm text-muted-foreground">
                  или нажмите кнопку ниже для выбора файла
                </p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4"
              >
                <Icon name="Upload" size={16} className="mr-2" />
                Выбрать файл
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".yml,.yaml,.json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <Icon name="AlertCircle" size={16} className="mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-semibold">Как получить файл карты SS14:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Найдите карту в репозитории SS14 (Resources/Maps/)</li>
            <li>Экспортируйте карту из редактора игры</li>
            <li>Скачайте готовый файл карты с сервера</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapFileUploader;
