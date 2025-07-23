import { AIButtonWithPopover } from "./AIButtonWithPopover";
import { CancelButton } from "./CancelButton";
import { DeleteButton } from "./DeleteButton";
import { SaveButton } from "./SaveButton";

export default function EditingControls({
  handleSave,
  setEditElement,
  deleteElement,
  content,
  replaceContent,
}: {
  handleSave: any;
  setEditElement: any;
  deleteElement?: any;
  content?: string;
  replaceContent?: (content: string) => void;
}) {
  return (
    <div className="absolute z-30 flex gap-1 outfit mt-2">
      <SaveButton onClick={handleSave} />
      <CancelButton onClick={() => setEditElement("")} />
      <AIButtonWithPopover content={content} replaceContent={replaceContent} />
      {deleteElement && <DeleteButton onClick={deleteElement} />}
    </div>
  );
}
