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
      reader.onload = async () => {
        const base64 = reader.result as string;

        const response = await fetch('https://functions.poehali.dev/955752de-69c7-412d-af62-a1201c69a014', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: base64,
            fileName: file.name,
            fileType: file.type
          })
        });

        const result = await response.json();

        if (result.success) {
          onUpload(result.url);
          toast({
            title: 'Успешно!',
            description: 'Файл загружен на сервер'
          });
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: String(error),
        variant: 'destructive'
      });
    } finally {
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
