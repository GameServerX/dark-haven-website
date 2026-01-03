import EditorToolbar from '@/components/EditorToolbar';
import ElementEditor from '@/components/ElementEditor';
import { PageElement } from '@/types/editor';

interface IndexEditorToolsProps {
  isEditing: boolean;
  currentPageHeight: number;
  selectedElement: PageElement | null;
  handleToggleEdit: () => void;
  handleAddElement: (type: 'text' | 'button' | 'image' | 'video') => void;
  handleSaveElements: () => void;
  handlePageHeightChange: (height: number) => void;
  handleUpdateElement: (element: PageElement) => void;
  handleDeleteElement: () => void;
  setSelectedElement: (element: PageElement | null) => void;
}

const IndexEditorTools = ({
  isEditing,
  currentPageHeight,
  selectedElement,
  handleToggleEdit,
  handleAddElement,
  handleSaveElements,
  handlePageHeightChange,
  handleUpdateElement,
  handleDeleteElement,
  setSelectedElement
}: IndexEditorToolsProps) => {
  if (!isEditing) return null;

  return (
    <>
      <EditorToolbar
        isEditing={isEditing}
        onToggleEdit={handleToggleEdit}
        onAddElement={handleAddElement}
        onSave={handleSaveElements}
        pageHeight={currentPageHeight}
        onPageHeightChange={handlePageHeightChange}
      />

      <ElementEditor
        element={selectedElement}
        onUpdate={handleUpdateElement}
        onDelete={handleDeleteElement}
        onClose={() => setSelectedElement(null)}
      />
    </>
  );
};

export default IndexEditorTools;
