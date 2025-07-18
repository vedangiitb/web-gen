"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import { colorMap } from "./colorMap";
import EditingControls from "./EditingControls";
import { Input } from "../ui/input";

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

  const [editElement, setEditElement] = useState<string>("");
  const [showAddLink, setShowAddLink] = useState(false);

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

  function handleAddLink(name: string, link: string) {
    const newLinks = [...content.links, name];
    content.links = newLinks;
    const newContent = { ...content, links: newLinks };

    updateData("Navbar", newContent);
    setEditElement("");
  }

  function handleDeleteLink(idx: number) {
    let newLinks = [...content.links];
    newLinks.splice(idx, 1);
    content.links = newLinks;
    const newContent = { ...content, links: newLinks };
    updateData("Navbar", newContent);
    setEditElement("");
  }

  return (
    <nav
      className={`
        flex items-center justify-between px-8 md:px-16 py-4 
        ${bgColors.bgFrom} backdrop-blur  ${bgColors.bgTo} shadow-sm ${primary}
      `}
    >
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
      </div>
      {isEditing("logoText") && (
        <EditingControls
          handleSave={() => handleSave("logoText")}
          setEditElement={setEditElement}
        />
      )}

      {/* Links */}
      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
        {content.links.map((link, idx) => (
          <div>
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
            </li>
            {isEditing(`link-${idx}`) && (
              <EditingControls
                handleSave={() => handleSave("link-" + idx, idx)}
                setEditElement={setEditElement}
                deleteElement={() => handleDeleteLink(idx)}
              />
            )}
          </div>
        ))}
        {/* Uncomment for Add Link */}
        {editMode && (
          <li>
            <button
              onClick={() => setShowAddLink(true)}
              className="text-blue-600 underline ml-2"
            >
              + Add Link
            </button>
            {showAddLink && (
              <AddLink cancel={setShowAddLink} addLink={handleAddLink} />
            )}
          </li>
        )}
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
      </Button>
      {isEditing("ctaText") && (
        <EditingControls
          handleSave={() => handleSave("ctaText")}
          setEditElement={setEditElement}
        />
      )}

      {/* Mobile menu icon */}
      <div className="md:hidden">
        <MenuIcon className={`h-6 w-6 ${bgColors.text}`} />
      </div>
    </nav>
  );
}

function AddLink({
  cancel,
  addLink,
}: {
  cancel: React.Dispatch<React.SetStateAction<boolean>>;
  addLink: (name: string, url: string) => void;
}) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  return (
    <div className="absolute z-50 w-[300px] bg-muted border border-muted-foreground rounded-2xl p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Add Link</h2>
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., GitHub"
          className="mt-1"
        />
      </div>

      {/* Link Input */}
      <div className="mb-4">
        <label className="text-sm font-medium text-muted-foreground">
          URL (Optional)
        </label>
        <Input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="e.g., https://github.com"
          className="mt-1"
        />
      </div>

      {/* Action Button */}
      <Button
        className="w-full"
        onClick={() => {
          addLink(name, link);
          cancel(false);
        }}
        disabled={!name}
      >
        Add Link
      </Button>
    </div>
  );
}
