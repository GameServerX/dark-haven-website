import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  label: string;
  accept: string;
  onUpload: (url: string) => void;
  currentUrl?: string;
}

const FileUploader = ({ label, accept, onUpload, currentUrl }: FileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        
        // Сохраняем файл в localStorage
        const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const fileData = {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          data: dataUrl,
          uploadedAt: new Date().toISOString()
        };
        
        // Получаем существующие файлы
        const existingFiles = localStorage.getItem('darkHaven_uploadedFiles');
        const files = existingFiles ? JSON.parse(existingFiles) : [];
        files.push(fileData);
        
        // Сохраняем обновленный список
        localStorage.setItem('darkHaven_uploadedFiles', JSON.stringify(files));
        
        onUpload(dataUrl);
        toast({
          title: 'Успешно!',
          description: 'Файл загружен'
        });
        setUploading(false);
      };

      reader.onerror = () => {
        toast({
          title: 'Ошибка загрузки',
          description: 'Не удалось прочитать файл',
          variant: 'destructive'
        });
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: String(error),
        variant: 'destructive'
      });
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center space-x-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1"
        >
          {uploading ? (
            <>
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
              Загрузка...
            </>
          ) : (
            <>
              <Icon name="Upload" size={16} className="mr-2" />
              Загрузить файл
            </>
          )}
        </Button>
      </div>
      {currentUrl && (
        <div className="text-xs text-muted-foreground truncate" title={currentUrl}>
          {currentUrl}
        </div>
      )}
    </div>
  );
};

export default FileUploader;