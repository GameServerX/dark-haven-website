import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { fileDB } from '@/lib/fileDB';

interface DatabaseExportProps {
  isAdmin?: boolean;
}

export default function DatabaseExport({ isAdmin = false }: DatabaseExportProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    try {
      setLoading(true);
      await fileDB.downloadBackup();
      setMessage('База данных экспортирована успешно!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Ошибка экспорта');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        setLoading(true);
        const text = await file.text();
        const success = await fileDB.importData(text);
        
        if (success) {
          setMessage('База данных импортирована! Обновите страницу.');
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setMessage('Ошибка импорта: неверный формат');
        }
      } catch (error) {
        setMessage('Ошибка чтения файла');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    input.click();
  };

  const handleClear = async () => {
    if (!confirm('Вы уверены? Все данные будут удалены!')) return;

    try {
      setLoading(true);
      await fileDB.clearAll();
      setMessage('База данных очищена! Обновите страницу.');
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setMessage('Ошибка очистки');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Icon name="Database" size={16} />
        Управление БД
      </h3>
      
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleExport}
          disabled={loading}
          className="justify-start"
        >
          <Icon name="Download" size={14} className="mr-2" />
          Экспорт
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleImport}
          disabled={loading}
          className="justify-start"
        >
          <Icon name="Upload" size={14} className="mr-2" />
          Импорт
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={handleClear}
          disabled={loading}
          className="justify-start"
        >
          <Icon name="Trash2" size={14} className="mr-2" />
          Очистить
        </Button>
      </div>

      {message && (
        <p className="text-xs mt-3 text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
