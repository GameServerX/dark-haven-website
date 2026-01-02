import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { CustomTab } from '@/types/editor';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  isEditing: boolean;
  onAddTab: () => void;
}

const SidebarMenu = ({ isOpen, onClose, onSelectTab, isEditing, onAddTab }: SidebarMenuProps) => {
  const [sidebarTabs, setSidebarTabs] = useState<CustomTab[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('darkHavenSidebarTabs');
    if (saved) {
      setSidebarTabs(JSON.parse(saved));
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="bg-card/95 backdrop-blur-lg border-r-2 border-primary/50">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold glow-cyan flex items-center space-x-2">
            <Icon name="Menu" size={24} />
            <span>Меню</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-2">
          {sidebarTabs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {isEditing ? (
                <p>Нажмите "+" чтобы добавить вкладку</p>
              ) : (
                <p>Здесь будут дополнительные вкладки</p>
              )}
            </div>
          ) : (
            sidebarTabs.map(tab => (
              <Button
                key={tab.id}
                variant="ghost"
                className="w-full justify-start hover:bg-primary/10"
                onClick={() => {
                  onSelectTab(tab.id);
                  onClose();
                }}
              >
                <Icon name={tab.icon as any} size={20} className="mr-3" />
                {tab.name}
              </Button>
            ))
          )}

          {isEditing && (
            <Button
              variant="outline"
              className="w-full border-primary hover:bg-primary/10"
              onClick={onAddTab}
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить вкладку
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarMenu;
