// General body text for most purposes

import EditingControls from "@/components/editWebsite/contentEditor/EditingControls";import { AnimatePresence, motion } from "framer-motion";

export default function LstElement({
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
  deleteElement,
}: {
  id: string;
  isEditing: boolean;
  editMode: boolean;
  color: string;
  renderText: string;
  handleClick: (id: string, content: string) => void;
  handleSave: () => void;
  rollBackEdit: () => void;
  replaceContent: (newContent: string) => void;
  font?: string;
  deleteElement: () => void;
}) {
  console.log(isEditing);
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
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.55, type: "spring" }}
            className={`text-lg font-medium mb-2 leading-tight drop-shadow ${color}
          ${editMode ? "cursor-pointer outline-dashed" : ""} ${
              isEditing ? "outline-blue-500 shadow-md" : ""
            } relative z-20`}
            suppressContentEditableWarning={isEditing}
            contentEditable={isEditing}
            id={id}
            onClick={(e) =>
              handleClick((e.target as HTMLElement).id, renderText)
            }
            style={{
              pointerEvents: editMode ? "auto" : "none",
              userSelect: editMode ? "text" : "none",
            }}
          >
            {renderText}
          </motion.p>
        </AnimatePresence>
      ) : (
        <p
          key={renderText}
          className={`text-lg font-medium mb-2 leading-tight drop-shadow ${color}
          ${editMode ? "cursor-pointer hover:outline-dashed" : ""} ${
            isEditing ? "outline-blue-500 shadow-md" : ""
          } relative z-20`}
          id={id}
          onClick={(e) => handleClick((e.target as HTMLElement).id, renderText)}
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
          deleteElement={deleteElement}
        />
      )}
    </div>
  );
}
