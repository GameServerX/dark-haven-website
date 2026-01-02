import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface EditorToolbarProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  onAddElement: (type: 'text' | 'button' | 'image' | 'video') => void;
  onSave: () => void;
}

const EditorToolbar = ({ isEditing, onToggleEdit, onAddElement, onSave }: EditorToolbarProps) => {
  const { toast } = useToast();

  const handleSave = () => {
    onSave();
    toast({
      title: 'Сохранено!',
      description: 'Все изменения успешно сохранены'
    });
  };

  if (!isEditing) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card/95 backdrop-blur-lg border-2 border-primary/50 rounded-2xl shadow-2xl p-4 animate-fade-in">
        <div className="flex items-center space-x-2">
          <div className="px-3 py-2 bg-primary/20 rounded-lg">
            <span className="text-sm font-bold text-primary">Режим редактирования</span>
          </div>

          <div className="h-8 w-px bg-border" />

          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddElement('text')}
            className="border-primary/30 hover:bg-primary/10"
          >
            <Icon name="Type" size={16} className="mr-2" />
            Текст
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddElement('button')}
            className="border-secondary/30 hover:bg-secondary/10"
          >
            <Icon name="Square" size={16} className="mr-2" />
            Кнопка
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddElement('image')}
            className="border-accent/30 hover:bg-accent/10"
          >
            <Icon name="Image" size={16} className="mr-2" />
            Картинка
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddElement('video')}
            className="border-accent/30 hover:bg-accent/10"
          >
            <Icon name="Video" size={16} className="mr-2" />
            Видео
          </Button>

          <div className="h-8 w-px bg-border" />

          <Button
            size="sm"
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 animate-pulse-glow"
          >
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={onToggleEdit}
          >
            <Icon name="X" size={16} className="mr-2" />
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
