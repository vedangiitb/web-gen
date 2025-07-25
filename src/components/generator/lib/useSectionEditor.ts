import { useEffect, useState } from "react";

export function useSectionEditor<
  SectionContent extends Record<string, string>,
  Key extends keyof SectionContent = keyof SectionContent
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

  const handleClick = (key: string | "") => {
    if (!editMode || key === "" || !isValidKey(key)) return;
    setBackupContent((prev) => ({
      ...prev,
      [key]: localContent[key],
    }));
    setEditingKey(key);
  };

  const isEditing = (key: Key) => editMode && editingKey === key;

  const handleSave = () => {
    if (!editMode || !editingKey || !isValidKey(editingKey)) return;

    const el = document.getElementById(editingKey as string);
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
    },
    handlers: {
      handleClick,
      handleSave,
      rollBackEdit,
      replaceContent,
    },
  };
}
