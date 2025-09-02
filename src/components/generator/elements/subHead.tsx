// for subheadings text, mostly in hero section

import EditingControls from "@/components/editWebsite/contentEditor/EditingControls";import { AnimatePresence, motion } from "framer-motion";

export default function SubHeading({
  id,
  isEditing,
  editMode,
  color,
  renderText,
  handleClick,
  handleSave,
  rollBackEdit,
  replaceContent,
  font,
}: {
  id: string;
  isEditing: boolean;
  editMode: boolean;
  color: string;
  renderText: string;
  handleClick: (id: string) => void;
  handleSave: () => void;
  rollBackEdit: () => void;
  replaceContent: (newContent: string) => void;
  font?: string;
}) {
  return (
    <div className={`${font} relative group`}>
      {editMode && (
        <div className="absolute inset-0 bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 rounded" />
      )}
      {isEditing ? (
        <AnimatePresence mode="wait">
          <motion.p
            key={renderText}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(5px)" }}
            transition={{ duration: 0.45, type: "spring" }}
            className={`text-lg md:text-xl mb-8 ${color}
              ${editMode ? "cursor-pointer outline-dashed" : ""} ${
              isEditing ? "outline-blue-500 shadow-md" : ""
            }`}
            suppressContentEditableWarning={isEditing}
            contentEditable={isEditing}
            id={id}
            onClick={(e) => handleClick((e.target as HTMLElement).id)}
          >
            {renderText}
          </motion.p>
        </AnimatePresence>
      ) : (
        <p
          key={renderText}
          className={`text-lg md:text-xl mb-8 ${color}
              ${editMode ? "cursor-pointer hover:outline-dashed" : ""} ${
            isEditing ? "outline-blue-500 shadow-md" : ""
          }`}
          suppressContentEditableWarning={isEditing}
          contentEditable={isEditing}
          id={id}
          onClick={(e) => handleClick((e.target as HTMLElement).id)}
        >
          {renderText}
        </p>
      )}

      {isEditing && (
        <EditingControls
          handleSave={handleSave}
          setEditElement={rollBackEdit}
          content={renderText}
          replaceContent={replaceContent}
        />
      )}
    </div>
  );
}
