// hooks/useSectionEditor.ts
import { useEffect, useState } from "react";

// TODO: Passing types for sections

type EditableContent = Record<string, string>;

export function useSectionEditor<T extends EditableContent>(
  sectionName: string,
  initialContent: T,
  updateSection: (section: string, content: T) => void
) {
  const [localContent, setLocalContent] = useState<T>(initialContent);
  const [editingKey, setEditingKey] = useState<keyof T | "">("");
  const [backupContent, setBackupContent] = useState<Partial<T>>({});

  useEffect(() => {
    setLocalContent(initialContent);
  }, [initialContent]);

  const handleClick = (key: string) => {
    if (key !== "") {
      setBackupContent((prev) => ({
        ...prev,
        [key]: localContent[key],
      }));
    }
    setEditingKey(key);
  };

  const isEditing = (key: keyof T) => editingKey === key;

  const handleSave = () => {
    const el = document.getElementById(editingKey as string);
    if (!el) return;

    const newVal = el.textContent || "";

    if (editingKey !== "") {
      const updated = {
        ...localContent,
        [editingKey]: newVal,
      };
      setLocalContent(updated);
      updateSection(sectionName, updated);
      setEditingKey("");
    }
  };

  const replaceContent = (newText: string) => {
    if (editingKey !== "") {
      setLocalContent((prev) => ({
        ...prev,
        [editingKey]: newText,
      }));
    }
  };

  const rollBackEdit = () => {
    if (editingKey !== "" && backupContent[editingKey]) {
      setLocalContent((prev) => ({
        ...prev,
        [editingKey]: backupContent[editingKey]!,
      }));
      setEditingKey("");
    }
  };

  return {
    localContent,
    editingKey,
    isEditing,
    handleClick,
    handleSave,
    rollBackEdit,
    replaceContent,
    setEditingKey,
  };
}
