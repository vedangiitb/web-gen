"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { colorMap } from "./colorMap";
import EditingControls from "./EditingControls";

export type NavbarProps = {
  content: { logoText: string; links: string[]; ctaText: string };
  style: GenStyles;
  editMode: boolean;
  updateData: (section: string, content: any) => void;
};

export default function Navbar({
  content,
  style,
  editMode,
  updateData,
}: NavbarProps) {
  if (!content) return <div></div>;

  const bgColors = colorMap[style?.color || "zinc"];
  const primary = style?.font.primary;

  // Track which field is being edited: 'logoText', 'ctaText', or 'link-0', 'link-1', etc.
  const [editElement, setEditElement] = useState<string>("");

  const isEditing = (id: string) => editMode && editElement === id;

  function handleEditClick(id: string) {
    if (editMode) setEditElement(id);
  }

  function handleSave(field: string, linkIdx?: number) {
    let newContent = { ...content };
    if (field === "logoText" || field === "ctaText") {
      const el = document.getElementById(field);
      if (!el) return;
      newContent[field] = el.textContent || "";
    } else if (field.startsWith("link-") && typeof linkIdx === "number") {
      const el = document.getElementById(`link-${linkIdx}`);
      if (!el) return;
      const newLinks = [...content.links];
      newLinks[linkIdx] = el.textContent || "";
      newContent.links = newLinks;
    }
    updateData("Navbar", newContent);
    setEditElement("");
  }

  // Optional: Add/Edit/Delete links (logic provided as comments)
  // function handleAddLink() { ... }
  // function handleDeleteLink(idx: number) { ... }

  return (
    <nav
      className={`
        flex items-center justify-between px-8 md:px-16 py-4 
        ${bgColors.bgFrom} backdrop-blur  ${bgColors.bgTo} shadow-sm ${primary}
      `}
    >
      {/* Logo */}
      <div
        id="logoText"
        suppressContentEditableWarning
        contentEditable={isEditing("logoText")}
        className={`font-extrabold text-2xl tracking-tight ${bgColors.text} ${
          editMode
            ? `outline-dashed px-1 transition ${
                isEditing("logoText") ? "outline-blue-500 shadow-md" : ""
              }`
            : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          handleEditClick("logoText");
        }}
      >
        {content.logoText}
        {isEditing("logoText") && (
          <EditingControls
            handleSave={() => handleSave("logoText")}
            setEditElement={setEditElement}
          />
        )}
      </div>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
        {content.links.map((link, idx) => (
          <li
            key={idx}
            id={`link-${idx}`}
            suppressContentEditableWarning
            contentEditable={isEditing(`link-${idx}`)}
            className={`
              ${bgColors.text} 
              ${bgColors.linkHover}
              font-medium cursor-pointer transition-colors
              relative overflow-hidden
              group
              ${editMode ? "outline-dashed px-1 transition" : ""}
              ${isEditing(`link-${idx}`) ? "outline-blue-500 shadow-md" : ""}
            `}
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(`link-${idx}`);
            }}
          >
            <span className="relative z-10">{link}</span>
            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-current transition-all duration-500 group-hover:w-full" />
            {isEditing(`link-${idx}`) && (
              <EditingControls
                handleSave={() => handleSave("link-" + idx, idx)}
                setEditElement={setEditElement}
              />
            )}
            {/* Uncomment for Delete button:
            {editMode && (
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => handleDeleteLink(idx)}
              >
                &times;
              </button>
            )} */}
          </li>
        ))}
        {/* Uncomment for Add Link
        {editMode && (
          <li>
            <button
              onClick={handleAddLink}
              className="text-blue-600 underline ml-2"
            >
              + Add Link
            </button>
          </li>
        )} */}
      </ul>

      {/* CTA Button */}
      <Button
        id="ctaText"
        suppressContentEditableWarning
        contentEditable={isEditing("ctaText")}
        className={`
          ${bgColors.button} ${bgColors.buttonHover} ${
          bgColors.buttonTxt
        } transition
          ${editMode ? "outline-dashed px-1 transition" : ""}
          ${isEditing("ctaText") ? "outline-blue-500 shadow-md" : ""}
        `}
        onClick={(e) => {
          if (editMode) {
            e.preventDefault();
            e.stopPropagation();
            handleEditClick("ctaText");
          }
        }}
        tabIndex={editMode ? -1 : 0}
      >
        {content.ctaText}
        {isEditing("ctaText") && (
          <EditingControls
            handleSave={() => handleSave("ctaText")}
            setEditElement={setEditElement}
          />
        )}
      </Button>

      {/* Mobile menu icon */}
      <div className="md:hidden">
        <MenuIcon className={`h-6 w-6 ${bgColors.text}`} />
      </div>
    </nav>
  );
}
