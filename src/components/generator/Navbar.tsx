"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import { colorMap } from "./colorMap";
import EditingControls from "../editWebsite/contentEditor/EditingControls";import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export type NavbarProps = {
  content: {
    logoText: string;
    links: string[];
    ctaText: string;
  };
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
        flex items-center sticky top-0 w-full z-30 justify-between px-8 md:px-16 py-4 
        ${bgColors.bgFrom} backdrop-blur  ${bgColors.bgTo} shadow-sm ${primary}
      `}
    >
      <div>
        <div
          id="logoText"
          suppressContentEditableWarning
          contentEditable={isEditing("logoText")}
          className={`font-extrabold text-2xl tracking-tight ${bgColors.text} ${
            editMode
              ? `cursor-pointer outline-dashed px-1 transition ${
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
      </div>

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
              ${editMode ? "cursor-pointer outline-dashed px-1 transition" : ""}
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
        {editMode && (
          <li key="add-new-link">
            <NewLink
              showAddLink={showAddLink}
              setShowAddLink={setShowAddLink}
              handleAddLink={handleAddLink}
            />
          </li>
        )}
      </ul>

      {/* CTA Button */}
      <div>
        <Button
          id="ctaText"
          suppressContentEditableWarning
          contentEditable={isEditing("ctaText")}
          className={`
          ${bgColors.button} ${bgColors.buttonHover} ${
            bgColors.buttonTxt
          } transition
          ${editMode ? "cursor-pointer outline-dashed px-1 transition" : ""}
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
      </div>

      {/* Mobile menu icon */}
      <div className="md:hidden">
        <MenuIcon className={`h-6 w-6 ${bgColors.text}`} />
      </div>
    </nav>
  );
}

function NewLink({
  showAddLink,
  setShowAddLink,
  handleAddLink,
}: {
  showAddLink: boolean;
  setShowAddLink: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddLink: any;
}) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  return (
    <Popover open={showAddLink} onOpenChange={setShowAddLink}>
      <PopoverTrigger>
        <Button className="outfit" onClick={() => setShowAddLink(true)}>
          + Add Link
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Add Link</h2>
            <button
              onClick={() => setShowAddLink(false)}
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
              handleAddLink(name, link);
              setShowAddLink(false);
            }}
            disabled={!name}
          >
            Add Link
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
