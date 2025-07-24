// Buttons

import EditingControls from "@/components/editingControls/EditingControls";
import { AnimatePresence, motion } from "framer-motion";

export default function Btn({
  id,
  isEditing,
  editMode,
  txtcolor,
  bgColor,
  hoverColor,
  renderText,
  handleClick,
  handleSave,
  rollBackEdit,
  replaceContent,
  font,
  outlineColor,
}: {
  id: string;
  isEditing: boolean;
  editMode: boolean;
  txtcolor: string;
  bgColor: string;
  hoverColor: string;
  renderText: string;
  handleClick: (id: string) => void;
  handleSave: () => void;
  rollBackEdit: () => void;
  replaceContent: (newContent: string) => void;
  font?: string;
  outlineColor?: string;
}) {
  return (
    <div className={`${font}`}>
      {renderText &&
        (isEditing ? (
          <AnimatePresence mode="wait">
            {renderText && (
              <motion.button
                key={renderText}
                layout // enable layout animation for changes
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.93 }}
                transition={{ duration: 0.35 }}
                className={`transition ${bgColor} ${txtcolor} ${hoverColor} ${outlineColor}
                  px-6 py-3 rounded-lg text-lg font-semibold
                  ${editMode ? "cursor-pointer outline-dashed" : ""} ${
                  isEditing ? "outline-blue-500 shadow-md" : ""
                }`}
                suppressContentEditableWarning={isEditing}
                contentEditable={isEditing}
                id={id}
                onClick={(e) => handleClick((e.target as HTMLElement).id)}
              >
                {renderText}
              </motion.button>
            )}
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait">
            {renderText && (
              <button
                key={renderText}
                className={`transition ${bgColor} ${txtcolor} ${hoverColor}
                  px-6 py-3 rounded-lg text-lg font-semibold
                  ${editMode ? "cursor-pointer outline-dashed" : ""} ${
                  isEditing ? "outline-blue-500 shadow-md" : ""
                }`}
                suppressContentEditableWarning={isEditing}
                contentEditable={isEditing}
                id={id}
                onClick={(e) => handleClick((e.target as HTMLElement).id)}
              >
                {renderText}
              </button>
            )}
          </AnimatePresence>
        ))}

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
