// For extra large texts mostly in hero sections

import EditingControls from "@/components/editingControls/EditingControls";
import { AnimatePresence, motion } from "framer-motion";

export default function Title1({
  id,
  isEditing,
  editMode,
  color,
  renderText,
  handleClick,
  handleSave,
  rollBackEdit,
  replaceContent,
  font
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
  font?:string
}) {
  return (
    <div className={`${font}`}>
      {isEditing ? (
        <AnimatePresence mode="wait">
          <motion.h1
            key={renderText}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.55, type: "spring" }}
            className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow ${color}
              ${editMode ? "cursor-pointer outline-dashed" : ""} ${
              isEditing ? "outline-blue-500 shadow-md" : ""
            }`}
            suppressContentEditableWarning={isEditing}
            contentEditable={isEditing}
            id={id}
            onClick={(e) => handleClick((e.target as HTMLElement).id)}
            style={{
              pointerEvents: editMode ? "auto" : "none",
              userSelect: editMode ? "text" : "none",
            }}
          >
            {renderText}
          </motion.h1>
        </AnimatePresence>
      ) : (
        <h1
          key={renderText}
          className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow ${color}
              ${editMode ? "cursor-pointer outline-dashed" : ""} ${
            isEditing ? "outline-blue-500 shadow-md" : ""
          }`}
          suppressContentEditableWarning={isEditing}
          contentEditable={isEditing}
          id={id}
          onClick={(e) => handleClick((e.target as HTMLElement).id)}
        >
          {renderText}
        </h1>
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
