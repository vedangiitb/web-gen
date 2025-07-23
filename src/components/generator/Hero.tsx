"use client";
import { useEffect, useState } from "react";
import { colorMap } from "./colorMap";
import EditingControls from "../editingControls/EditingControls";
import { Pen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type HeroProps = {
  content: {
    heading: string;
    subheading: string;
    primaryButton: string;
    secondaryButton: string;
    imageUrl: string;
  };
  style: GenStyles;
  heroImg: string;
  editMode: boolean;
  updateData: any;
  setShowImgBox: any;
};

type EditableKey =
  | "heading"
  | "subheading"
  | "primaryButton"
  | "secondaryButton";

export default function Hero({
  content,
  style,
  heroImg,
  editMode,
  updateData,
  setShowImgBox,
}: HeroProps) {
  if (!content) return <div></div>;

  const [localContent, setLocalContent] = useState(content);
  const bgColors = colorMap[style?.color || "zinc"];
  const primary = style?.font.primary;
  const bodyFont = style?.font.body;

  const [editElement, setEditElement] = useState<EditableKey | "">("");
  const [isAIGenerating, setAIGenerating] = useState(false);
  const [backupContent, setBackupContent] = useState<
    Partial<Record<EditableKey, string>>
  >({});

  useEffect(() => {
    setLocalContent(content);
    setAIGenerating(false); // AI generation ends
  }, [content]);

  const handleClick = (id: string) => {
    if (
      [
        "heading",
        "subheading",
        "primaryButton",
        "secondaryButton",
        "",
      ].includes(id)
    ) {
      if (id !== "") {
        setBackupContent((prev) => ({
          ...prev,
          [id]: localContent[id as EditableKey],
        }));
      }
      setEditElement(id as EditableKey | "");
    }
  };

  const isEditing = (id: string) => editMode && editElement === id;

  const handleSave = () => {
    const val = document.getElementById(editElement);
    if (!val) return;

    const newVal = (val as HTMLInputElement).textContent || "";

    if (
      editElement === "heading" ||
      editElement === "subheading" ||
      editElement === "primaryButton" ||
      editElement === "secondaryButton"
    ) {
      const updatedLocalContent = {
        ...localContent,
        [editElement]: newVal,
      };

      setLocalContent(updatedLocalContent); // update local
      updateData("Hero", updatedLocalContent); // send to parent
    }

    setEditElement("");
  };

  const replaceContent = (newContent: string) => {
    if (
      editElement === "heading" ||
      editElement === "subheading" ||
      editElement === "primaryButton" ||
      editElement === "secondaryButton"
    ) {
      console.log(newContent);
      console.log(editElement);
      const updatedContent = { ...localContent, [editElement]: newContent };
      setLocalContent(updatedContent);
    }
  };

  const rollBackEdit = () => {
    if (
      (editElement === "heading" ||
        editElement === "subheading" ||
        editElement === "primaryButton" ||
        editElement === "secondaryButton") &&
      backupContent[editElement]
    ) {
      console.log("setting back...");
      console.log(backupContent[editElement]);
      console.log(localContent[editElement]);
      console.log(editElement);
      setLocalContent((prev) => {
        const updated = {
          ...prev,
          [editElement]: backupContent[editElement]!,
        };
        console.log("New localContent:", updated);
        return updated;
      });
      setEditElement("");
    }
  };

  return (
    <section
      className={`flex flex-col-reverse md:flex-row items-center gap-10 px-8 md:px-16 py-20 md:py-28 ${primary}`}
    >
      <div className="flex-1 w-full">
        {/* Heading */}

        {isEditing("heading") ? (
          <AnimatePresence mode="wait">
            <motion.h1
              key={localContent.heading}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.55, type: "spring" }}
              className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow ${
                bgColors.text
              }
              ${editMode ? "cursor-pointer outline-dashed" : ""} ${
                isEditing("heading") ? "outline-blue-500 shadow-md" : ""
              }`}
              suppressContentEditableWarning={isEditing("heading")}
              contentEditable={isEditing("heading")}
              id="heading"
              onClick={(e) => handleClick((e.target as HTMLElement).id)}
              style={{
                pointerEvents: editMode ? "auto" : "none",
                userSelect: editMode ? "text" : "none",
              }}
            >
              {localContent.heading}
            </motion.h1>
          </AnimatePresence>
        ) : (
          <h1
            key={localContent.heading}
            className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow ${
              bgColors.text
            }
              ${editMode ? "cursor-pointer outline-dashed" : ""} ${
              isEditing("heading") ? "outline-blue-500 shadow-md" : ""
            }`}
            suppressContentEditableWarning={isEditing("heading")}
            contentEditable={isEditing("heading")}
            id="heading"
            onClick={(e) => handleClick((e.target as HTMLElement).id)}
          >
            {localContent.heading}
          </h1>
        )}

        {isEditing("heading") && (
          <EditingControls
            handleSave={handleSave}
            setEditElement={rollBackEdit}
            content={localContent.heading}
            replaceContent={replaceContent}
          />
        )}

        {/* Subheading */}

        {isEditing("subheading") ? (
          <AnimatePresence mode="wait">
            <motion.p
              key={localContent.subheading}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(5px)" }}
              transition={{ duration: 0.45, type: "spring" }}
              className={`text-lg md:text-xl mb-8 ${
                bgColors.accentText
              } ${bodyFont}
              ${editMode ? "cursor-pointer outline-dashed" : ""} ${
                isEditing("subheading") ? "outline-blue-500 shadow-md" : ""
              }`}
              suppressContentEditableWarning={isEditing("subheading")}
              contentEditable={isEditing("subheading")}
              id="subheading"
              onClick={(e) => handleClick((e.target as HTMLElement).id)}
            >
              {localContent.subheading}
            </motion.p>
          </AnimatePresence>
        ) : (
          <p
            key={localContent.subheading}
            className={`text-lg md:text-xl mb-8 ${
              bgColors.accentText
            } ${bodyFont}
              ${editMode ? "cursor-pointer outline-dashed" : ""} ${
              isEditing("subheading") ? "outline-blue-500 shadow-md" : ""
            }`}
            suppressContentEditableWarning={isEditing("subheading")}
            contentEditable={isEditing("subheading")}
            id="subheading"
            onClick={(e) => handleClick((e.target as HTMLElement).id)}
          >
            {localContent.subheading}
          </p>
        )}

        {isEditing("subheading") && (
          <EditingControls
            handleSave={handleSave}
            setEditElement={rollBackEdit}
            content={localContent.subheading}
            replaceContent={replaceContent}
          />
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          {localContent.primaryButton &&
            (isEditing("primaryButton") ? (
              <AnimatePresence mode="wait">
                {localContent.primaryButton && (
                  <motion.button
                    key={localContent.primaryButton}
                    layout // enable layout animation for changes
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.93 }}
                    transition={{ duration: 0.35 }}
                    className={`transition ${bgColors.button} ${
                      bgColors.buttonTxt
                    } ${bgColors.buttonHover}
                  px-6 py-3 rounded-lg text-lg font-semibold
                  ${editMode ? "cursor-pointer outline-dashed" : ""} ${
                      isEditing("primaryButton")
                        ? "outline-blue-500 shadow-md"
                        : ""
                    }`}
                    suppressContentEditableWarning={isEditing("primaryButton")}
                    contentEditable={isEditing("primaryButton")}
                    id="primaryButton"
                    onClick={(e) => handleClick((e.target as HTMLElement).id)}
                  >
                    {localContent.primaryButton}
                  </motion.button>
                )}
              </AnimatePresence>
            ) : (
              <AnimatePresence mode="wait">
                {localContent.primaryButton && (
                  <button
                    key={localContent.primaryButton}
                    className={`transition ${bgColors.button} ${
                      bgColors.buttonTxt
                    } ${bgColors.buttonHover}
                  px-6 py-3 rounded-lg text-lg font-semibold
                  ${editMode ? "cursor-pointer outline-dashed" : ""} ${
                      isEditing("primaryButton")
                        ? "outline-blue-500 shadow-md"
                        : ""
                    }`}
                    suppressContentEditableWarning={isEditing("primaryButton")}
                    contentEditable={isEditing("primaryButton")}
                    id="primaryButton"
                    onClick={(e) => handleClick((e.target as HTMLElement).id)}
                  >
                    {localContent.primaryButton}
                  </button>
                )}
              </AnimatePresence>
            ))}
        </div>

        {localContent.secondaryButton &&
          (isEditing("secondaryButton") ? (
            <motion.button
              key={localContent.secondaryButton}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ duration: 0.35 }}
              className={`transition ${bgColors.secondaryButtonBg} ${
                bgColors.secondaryButtonTxt
              }
                  ${bgColors.secondaryButtonHover} ${
                bgColors.secondaryButtonOutline
              }
                  px-6 py-3 rounded-lg text-lg font-semibold
                  ${editMode ? "cursor-pointer outline-dashed" : ""} ${
                isEditing("secondaryButton") ? "outline-blue-500 shadow-md" : ""
              }`}
              suppressContentEditableWarning={isEditing("secondaryButton")}
              contentEditable={isEditing("secondaryButton")}
              id="secondaryButton"
              onClick={(e) => handleClick((e.target as HTMLElement).id)}
            >
              {localContent.secondaryButton}
            </motion.button>
          ) : (
            <button
              key={localContent.secondaryButton}
              className={`transition ${bgColors.secondaryButtonBg} ${
                bgColors.secondaryButtonTxt
              }
                  ${bgColors.secondaryButtonHover} ${
                bgColors.secondaryButtonOutline
              }
                  px-6 py-3 rounded-lg text-lg font-semibold
                  ${editMode ? "cursor-pointer outline-dashed" : ""} ${
                isEditing("secondaryButton") ? "outline-blue-500 shadow-md" : ""
              }`}
              suppressContentEditableWarning={isEditing("secondaryButton")}
              contentEditable={isEditing("secondaryButton")}
              id="secondaryButton"
              onClick={(e) => handleClick((e.target as HTMLElement).id)}
            >
              {localContent.secondaryButton}
            </button>
          ))}

        {(isEditing("primaryButton") || isEditing("secondaryButton")) && (
          <EditingControls
            handleSave={handleSave}
            setEditElement={rollBackEdit}
            content={
              isEditing("primaryButton")
                ? localContent.primaryButton
                : localContent.secondaryButton
            }
            replaceContent={replaceContent}
          />
        )}
      </div>

      {/* Image with Animated Transition */}
      <div className="flex-1 w-full flex justify-center items-center">
        <AnimatePresence mode="wait">
          {localContent.imageUrl && (
            <motion.div
              key={heroImg}
              initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.5, type: "spring" }}
              className="relative group"
              onClick={() => {
                if (!editMode) return;
                setShowImgBox();
              }}
            >
              <img
                src={
                  heroImg ||
                  "https://images.unsplash.com/photo-1510936111840-65e151ad71bb?auto=format&fit=cover&w=800&q=80"
                }
                alt="Hero"
                className={`w-full max-w-md rounded-2xl shadow-xl object-cover
                  ${
                    editMode
                      ? "transition duration-300 group-hover:brightness-75"
                      : ""
                  }`}
              />
              {editMode && (
                <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 group-hover:cursor-pointer transition duration-300">
                  {/* Pen icon here */}
                  <Pen />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
