"use client";
import { useState } from "react";
import { Facebook, Twitter, Linkedin, Instagram, Globe } from "lucide-react";
import EditingControls from "../editWebsite/EditingControls";

export type FooterProps = {
  content: {
    companyInfo: string;
    links: { label: string; href: string }[];
    socials: { type: string; href: string }[];
  };
  style: GenStyles;
  editMode: boolean;
  updateData: (section: string, content: any) => void;
};

// Helper to render the right icon
function SocialIcon({ type, ...props }: { type: string; className?: string }) {
  if (!type) {
    return <Globe {...props} />;
  }
  switch (type.toLowerCase()) {
    case "facebook":
      return <Facebook {...props} />;
    case "twitter":
      return <Twitter {...props} />;
    case "linkedin":
      return <Linkedin {...props} />;
    case "instagram":
      return <Instagram {...props} />;
    default:
      return <Globe {...props} />;
  }
}

export default function Footer({ content, style, editMode, updateData }: FooterProps) {
  if (!content) return null;

  const primary = style?.font.primary;
  const bodyFont = style?.font.body;

  // Track which field is being edited: "companyInfo", "link-0-label", "link-2-href", "social-1-type", "social-3-href", etc.
  const [editElement, setEditElement] = useState<string>("");

  const isEditing = (id: string) => editMode && editElement === id;

  function handleEditClick(id: string) {
    if (editMode) setEditElement(id);
  }

  function handleSave({ type, idx, subfield }: { type: "company" | "link" | "social"; idx?: number; subfield?: string }) {
    let newContent = { ...content };

    if (type === "company") {
      const el = document.getElementById("companyInfo");
      if (!el) return;
      newContent.companyInfo = el.textContent || "";
    } else if (type === "link" && typeof idx === "number" && subfield) {
      const el = document.getElementById(`link-${idx}-${subfield}`);
      if (!el) return;
      const newLinks = [...content.links];
      newLinks[idx] = { ...newLinks[idx], [subfield]: el.textContent || "" };
      newContent.links = newLinks;
    } else if (type === "social" && typeof idx === "number" && subfield) {
      const el = document.getElementById(`social-${idx}-${subfield}`);
      if (!el) return;
      const newSocials = [...content.socials];
      newSocials[idx] = { ...newSocials[idx], [subfield]: el.textContent || "" };
      newContent.socials = newSocials;
    }

    updateData("Footer", newContent);
    setEditElement("");
  }

  // Optional: Add/Delete links/socials (templates only)
  // function handleAddLink() { ... }
  // function handleDeleteLink(idx: number) { ... }
  // function handleAddSocial() { ... }
  // function handleDeleteSocial(idx: number) { ... }

  return (
    <footer className={`bg-neutral-900 text-neutral-200 py-10 px-8 md:px-16 ${bodyFont}`}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-8">

        {/* Company Info */}
        <div className="text-center md:text-left text-sm mb-4 md:mb-0">
          <span
            id="companyInfo"
            suppressContentEditableWarning
            contentEditable={isEditing("companyInfo")}
            className={`inline-block ${editMode ? "cursor-pointer outline-dashed px-1 transition" : ""} ${isEditing("companyInfo") ? "outline-blue-500 shadow-md" : ""}`}
            onClick={e => { e.stopPropagation(); handleEditClick("companyInfo"); }}
          >
            {content.companyInfo}
          </span>
          {isEditing("companyInfo") && (
            <EditingControls
              handleSave={() => handleSave({ type: "company" })}
              setEditElement={setEditElement}
            />
          )}
        </div>

        {/* Links */}
        <ul className="flex flex-wrap justify-center gap-6 text-base font-medium">
          {content.links.map((link, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span
                id={`link-${idx}-label`}
                suppressContentEditableWarning
                contentEditable={isEditing(`link-${idx}-label`)}
                className={`hover:text-blue-400 transition-colors duration-200 cursor-pointer ${editMode ? "cursor-pointer outline-dashed px-1 transition" : ""} ${isEditing(`link-${idx}-label`) ? "outline-blue-500 shadow-md" : ""}`}
                onClick={e => { e.stopPropagation(); handleEditClick(`link-${idx}-label`); }}
              >
                {link.label}
              </span>
              {isEditing(`link-${idx}-label`) && (
                <EditingControls
                  handleSave={() => handleSave({ type: "link", idx, subfield: "label" })}
                  setEditElement={setEditElement}
                />
              )}
              <span className="text-neutral-500 mx-1">|</span>
              <span
                id={`link-${idx}-href`}
                suppressContentEditableWarning
                contentEditable={isEditing(`link-${idx}-href`)}
                className={`text-xs underline cursor-pointer ${editMode ? "cursor-pointer outline-dashed px-1 transition" : ""} ${isEditing(`link-${idx}-href`) ? "outline-blue-500 shadow-md" : ""}`}
                style={{ minWidth: "70px" }}
                onClick={e => { e.stopPropagation(); handleEditClick(`link-${idx}-href`); }}
                title="Edit link URL"
              >
                {link.href}
              </span>
              {isEditing(`link-${idx}-href`) && (
                <EditingControls
                  handleSave={() => handleSave({ type: "link", idx, subfield: "href" })}
                  setEditElement={setEditElement}
                />
              )}
              {/* Optional delete (uncomment)
              {editMode && (
                <button className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleDeleteLink(idx)}>&times;</button>
              )} */}
            </li>
          ))}
          {/* Optional add link (uncomment)
          {editMode && (
            <li>
              <button className="text-blue-400 underline" onClick={handleAddLink}>+ Add Link</button>
            </li>
          )} */}
        </ul>

        {/* Socials */}
        <div className="flex gap-4 items-center">
          {content.socials.map((social, idx) => (
            <span key={idx} className="flex flex-col items-center group">
              {/* Editable Social Type (shows icon) */}
              <span
                id={`social-${idx}-type`}
                suppressContentEditableWarning
                contentEditable={isEditing(`social-${idx}-type`)}
                className={`text-neutral-400 hover:text-blue-400 transition-colors rounded-full cursor-pointer ${editMode ? "cursor-pointer outline-dashed px-1" : ""} ${isEditing(`social-${idx}-type`) ? "outline-blue-500 shadow-md" : ""}`}
                style={{ minHeight: 24, minWidth: 24, display: "inline-flex" }}
                onClick={e => { e.stopPropagation(); handleEditClick(`social-${idx}-type`); }}
                title="Edit social icon type (e.g. facebook, twitter...)"
              >
                <SocialIcon type={social.type} className="h-6 w-6" />
              </span>
              {isEditing(`social-${idx}-type`) && (
                <EditingControls
                  handleSave={() => handleSave({ type: "social", idx, subfield: "type" })}
                  setEditElement={setEditElement}
                />
              )}
              {/* Editable Social URL */}
              <span
                id={`social-${idx}-href`}
                suppressContentEditableWarning
                contentEditable={isEditing(`social-${idx}-href`)}
                className={`text-xs underline cursor-pointer mt-1 text-neutral-400 group-hover:text-blue-400 ${editMode ? "cursor-pointer outline-dashed px-1" : ""} ${isEditing(`social-${idx}-href`) ? "outline-blue-500 shadow-md" : ""}`}
                onClick={e => { e.stopPropagation(); handleEditClick(`social-${idx}-href`); }}
                title="Edit social URL"
                style={{ minWidth: "70px" }}
              >
                {social.href}
              </span>
              {isEditing(`social-${idx}-href`) && (
                <EditingControls
                  handleSave={() => handleSave({ type: "social", idx, subfield: "href" })}
                  setEditElement={setEditElement}
                />
              )}
              {/* Optional delete (uncomment)
              {editMode && (
                <button className="text-red-500 hover:text-red-700 text-xs" onClick={() => handleDeleteSocial(idx)}>&times;</button>
              )} */}
            </span>
          ))}
          {/* Optional add social (uncomment)
          {editMode && (
            <button className="ml-2 text-blue-400 underline" onClick={handleAddSocial}>+ Add Social</button>
          )} */}
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-neutral-400">
        {/* Also make companyInfo editable here (optional) */}
        {content.companyInfo} &mdash; All rights reserved.
      </div>
    </footer>
  );
}
