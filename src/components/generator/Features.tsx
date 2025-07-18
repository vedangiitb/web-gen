"use client";
import { CheckCircle, X } from "lucide-react"; // Lucide is used by shadcn/ui for icons
import { colorMap } from "./colorMap";
import { useState } from "react";
import EditingControls from "./EditingControls";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
  const [addingFeature, setAddingFeature] = useState(false);

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

  const addFeature = (text: string) => {
    let newFeatures = [...content.featureList];
    newFeatures.push(text);
    content.featureList = newFeatures;
    const newContent = { ...content, featureList: newFeatures };
    updateData("Features", newContent);
  };

  const deleteFeature = (idx: number) => {
    let newFeatures = [...content.featureList];
    newFeatures.splice(idx, 1);
    content.featureList = newFeatures;
    const newContent = { ...content, featureList: newFeatures };
    updateData("Features", newContent);
    setEditElement("")
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
            ? `cursor-pointer outline-dashed ${
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
                    ? `cursor-pointer outline-dashed ${
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
                  deleteElement={() => deleteFeature(idx)}
                />
              )}
            </li>
          );
        })}
      </ul>

      {editMode && (
        <Button onClick={() => setAddingFeature(true)}>Add Feature</Button>
      )}

      {addingFeature && (
        <AddFeature cancel={setAddingFeature} addFeature={addFeature} />
      )}
    </section>
  );
}

function AddFeature({ cancel, addFeature }: { cancel: any; addFeature: any }) {
  const [feature, setFeature] = useState("");
  return (
    <div className="absolute z-50 w-[300px] bg-muted border border-muted-foreground rounded-2xl p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Add New Feature
        </h2>
        <button
          onClick={() => cancel(false)}
          className="text-muted-foreground hover:text-foreground transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Name Input */}
      <div className="mb-3">
        <label className="text-sm font-medium text-muted-foreground">
          Name
        </label>
        <Input
          value={feature}
          onChange={(e) => setFeature(e.target.value)}
          placeholder="new feature"
          className="mt-1"
        />
      </div>

      {/* Action Button */}
      <Button
        className="w-full"
        onClick={() => {
          addFeature(feature);
          cancel(false);
        }}
        disabled={!feature}
      >
        Add Feature
      </Button>
    </div>
  );
}
