// Large texts for section headings

import EditingControls from "@/components/editWebsite/contentEditor/EditingControls";import { AnimatePresence, motion } from "framer-motion";

export default function Title2({
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
          <motion.h2
            key={renderText}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.55, type: "spring" }}
            className={`text-center text-3xl md:text-4xl font-bold mb-6 leading-tight drop-shadow ${color}
          ${editMode ? "cursor-pointer outline-dashed" : ""} ${
              isEditing ? "outline-blue-500 shadow-md" : ""
            } relative z-20`}
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
          </motion.h2>
        </AnimatePresence>
      ) : (
        <h2
          key={renderText}
          className={`text-center text-3xl md:text-4xl font-bold mb-6 leading-tight drop-shadow ${color}
          ${editMode ? "cursor-pointer hover:outline-dashed" : ""} ${
            isEditing ? "outline-blue-500 shadow-md" : ""
          } relative z-20`}
          id={id}
          onClick={(e) => handleClick((e.target as HTMLElement).id)}
        >
          {renderText}
        </h2>
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
