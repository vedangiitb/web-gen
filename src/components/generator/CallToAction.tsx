"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import { colorMap } from "./colorMap";
import EditingControls from "./EditingControls";

export type CallToActionProps = {
  content: {
    ctaheading: string;
    subtext: string;
    buttonText: string;
    onClick?: () => void;
  };
  style: GenStyles;
  editMode: boolean;
  updateData: (section: string, newContent: any) => void;
};

export default function CallToAction({
  content,
  style,
  editMode,
  updateData,
}: CallToActionProps) {
  if (!content) return null;

  const mutedColors = colorMap[style?.muted || "gray"];
  const bgColors = colorMap[style?.color || "zinc"];
  const primary = style?.font.primary;
  const bodyFont = style?.font.body;

  // Track which field ("ctaheading", "subtext", "buttonText") is being edited
  const [editElement, setEditElement] = useState<string>("");

  const isEditing = (id: string) => editMode && editElement === id;

  function handleEditClick(id: string) {
    if (editMode) setEditElement(id);
  }

  function handleSave(field: "ctaheading" | "subtext" | "buttonText") {
    const el = document.getElementById(field);
    console.log(el)
    if (!el) return;
    const newContent = { ...content, [field]: el.textContent || "" };
    updateData("CallToAction", newContent);
    setEditElement("");
  }

  return (
    <section
      className={`
        relative isolate overflow-hidden
        px-8 md:px-16 py-16 text-center
        flex flex-col items-center justify-center ${primary}
      `}
    >
      {/* Decorative background SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        aria-hidden="true"
        viewBox="0 0 1024 1024"
        fill="none"
      >
        <circle cx="512" cy="512" r="400" fill="url(#gradient)" />
        <defs>
          <radialGradient
            id="gradient"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(512 512) scale(400)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0.2" />
            <stop offset="1" stopColor="#0070f3" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Heading */}
        <h2
          id="ctaheading"
          suppressContentEditableWarning
          contentEditable={isEditing("ctaheading")}
          className={`text-3xl md:text-4xl font-bold mb-4 ${
            bgColors.text
          } drop-shadow ${
            editMode
              ? `cursor-pointer outline-dashed px-1 transition ${
                  isEditing("ctaheading") ? "outline-blue-500 shadow-md" : ""
                }`
              : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleEditClick("ctaheading");
          }}
        >
          {content.ctaheading}
        </h2>
        {isEditing("ctaheading") && (
          <EditingControls
            handleSave={() => handleSave("ctaheading")}
            setEditElement={setEditElement}
          />
        )}

        {/* Subtext */}
        <p
          id="subtext"
          suppressContentEditableWarning
          contentEditable={isEditing("subtext")}
          className={`mb-8 text-lg md:text-xl ${
            bgColors.accentText
          } ${bodyFont} ${
            editMode
              ? `cursor-pointer outline-dashed px-1 transition ${
                  isEditing("subtext") ? "outline-blue-500 shadow-md" : ""
                }`
              : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleEditClick("subtext");
          }}
        >
          {content.subtext}
        </p>
        {isEditing("subtext") && (
          <EditingControls
            handleSave={() => handleSave("subtext")}
            setEditElement={setEditElement}
          />
        )}

        {/* Button */}
        <Button
          id="buttonText"
          size="lg"
          suppressContentEditableWarning
          contentEditable={isEditing("buttonText")}
          className={`transition ${bgColors.button} ${bgColors.buttonTxt} ${
            bgColors.buttonHover
          } font-semibold ${editMode ? "cursor-pointer outline-dashed px-1 transition" : ""} ${
            isEditing("buttonText") ? "outline-blue-500 shadow-md" : ""
          }`}
          onClick={(e) => {
            // Avoid accidental click during editing
            if (editMode) {
              e.preventDefault();
              e.stopPropagation();
              handleEditClick("buttonText");
            } else {
              content.onClick?.();
            }
          }}
          tabIndex={editMode ? -1 : 0}
        >
          {content.buttonText}
          {isEditing("buttonText") && (
            <EditingControls
              handleSave={() => handleSave("buttonText")}
              setEditElement={setEditElement}
            />
          )}
        </Button>
      </div>
    </section>
  );
}
