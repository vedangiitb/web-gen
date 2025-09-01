import { useEffect, useState } from "react";

export function useSectionEditor<
  SectionContent extends Record<string, any>,
  Key extends string = string
>(
  sectionName: string,
  initialContent: SectionContent,
  updateSection: (section: string, updatedContent: SectionContent) => void,
  editableKeys: readonly Key[],
  editMode: boolean
) {
  const [localContent, setLocalContent] = useState(initialContent);
  const [editingKey, setEditingKey] = useState<Key | "">("");
  const [backupContent, setBackupContent] = useState<Partial<SectionContent>>(
    {}
  );

  useEffect(() => {
    setLocalContent(initialContent);
  }, [initialContent]);

  const isValidKey = (key: any): key is Key => editableKeys.includes(key);

  const handleClick = (key: string | "",content?:string) => {
    console.log(key, editableKeys);
    if (!editMode || key === "" || !isValidKey(key)) return;
    setBackupContent((prev) => ({
      ...prev,
      [key]: content || localContent[key],
    }));
    setEditingKey(key);
  };

  const isEditing = (key: Key) => {
    console.log(key, editMode, editingKey);
    return editMode && editingKey === key;
  };

  const handleSave = () => {
    if (!editMode || !editingKey || !isValidKey(editingKey)) return;

    const el = document.getElementById(editingKey as string);
    console.log(el)
    if (!el) return;

    const newVal = el.textContent || "";

    const updated = {
      ...localContent,
      [editingKey]: newVal,
    };

    setLocalContent(updated);
    updateSection(sectionName, updated);
    setEditingKey("");
  };

  const replaceContent = (newText: string) => {
    if (!editMode || !editingKey || !isValidKey(editingKey)) return;
    setLocalContent((prev) => ({
      ...prev,
      [editingKey]: newText,
    }));
  };

  const rollBackEdit = () => {
    console.log(backupContent);
    if (!editMode || !editingKey || !isValidKey(editingKey)) return;

    const backup = backupContent[editingKey];
    if (backup !== undefined) {
      setLocalContent((prev) => ({
        ...prev,
        [editingKey]: backup,
      }));
      setEditingKey("");
    }
  };

  return {
    state: {
      localContent,
      isEditing,
      setEditingKey,
    },
    handlers: {
      handleClick,
      handleSave,
      rollBackEdit,
      replaceContent,
    },
  };
}
