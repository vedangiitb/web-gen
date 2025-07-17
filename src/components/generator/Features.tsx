"use client";
import { CheckCircle } from "lucide-react"; // Lucide is used by shadcn/ui for icons
import { colorMap } from "./colorMap";
import { useState } from "react";
import EditingControls from "./EditingControls";

export type FeaturesProps = {
  content: {
    title: string;
    featureList: string[];
  };
  style: GenStyles;
  editMode: boolean;
  updateData: (section: string, data: any) => void;
};

export default function Features({
  content,
  style,
  editMode,
  updateData,
}: FeaturesProps) {
  if (!content) return null;

  const bgColors = colorMap[style?.color || "zinc"];
  const mutedColors = colorMap[style?.muted || "gray"];

  const primary = style?.font.primary;
  const bodyFont = style?.font.body;

  const [editElement, setEditElement] = useState<string>("");

  const isEditing = (id: string) => editMode && editElement === id;

  const handleClick = (id: string) => {
    if (editMode) setEditElement(id);
  };

  const handleSave = () => {
    const el = document.getElementById(editElement);
    if (!el) return;

    const newContent = { ...content };

    if (editElement === "title") {
      newContent.title = el.textContent || "";
    } else if (editElement.startsWith("feature-")) {
      const index = parseInt(editElement.split("-")[1]);
      newContent.featureList[index] = el.textContent || "";
    }

    updateData("Features", newContent);
    setEditElement("");
  };

  return (
    <section className={`py-16 px-8 md:px-16 ${primary}`}>
      <h2
        contentEditable={isEditing("title")}
        suppressContentEditableWarning
        id="title"
        className={`text-3xl md:text-4xl font-bold text-center mb-10 ${
          bgColors.text
        } ${
          editMode
            ? `outline-dashed ${
                isEditing("title") ? "outline-blue-500 shadow-md" : ""
              }`
            : ""
        }`}
        onClick={(e) => handleClick((e.target as HTMLElement).id)}
      >
        {content.title}
      </h2>
      {isEditing("title") && (
        <EditingControls
          handleSave={handleSave}
          setEditElement={setEditElement}
        />
      )}

      <ul className="max-w-4xl mx-auto space-y-6">
        {content.featureList.map((feature, idx) => {
          const id = `feature-${idx}`;
          return (
            <li
              key={idx}
              className={`flex items-start gap-3 ${mutedColors.cardBgCol} ${mutedColors.cardBorderCol} ${mutedColors.cardTxtCol} rounded-lg shadow-sm p-5 hover:shadow-md transition`}
            >
              <CheckCircle
                className={`h-6 w-6 ${mutedColors.text} mt-1 flex-shrink-0`}
                aria-hidden="true"
              />
              <span
                contentEditable={isEditing(id)}
                suppressContentEditableWarning
                id={id}
                className={`text-lg font-medium ${bodyFont} ${
                  editMode
                    ? `outline-dashed ${
                        isEditing(id) ? "outline-blue-500 shadow-md" : ""
                      }`
                    : ""
                }`}
                onClick={(e) => handleClick((e.target as HTMLElement).id)}
              >
                {feature}
              </span>
              {isEditing(id) && (
                <EditingControls
                  handleSave={handleSave}
                  setEditElement={setEditElement}
                />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
