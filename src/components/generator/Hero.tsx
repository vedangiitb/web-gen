"use client";
import { useEffect, useState } from "react";
import { colorMap } from "./colorMap";
import Btn from "./elements/btn1";
import Img from "./elements/img";
import SubHeading from "./elements/subHead";
import Title1 from "./elements/title1";

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
        <Title1
          id={"heading"}
          isEditing={isEditing("heading")}
          editMode={editMode}
          color={bgColors.text}
          renderText={localContent.heading}
          handleClick={handleClick}
          handleSave={handleSave}
          rollBackEdit={rollBackEdit}
          replaceContent={replaceContent}
          font={primary}
        />

        <SubHeading
          id={"subheading"}
          isEditing={isEditing("subheading")}
          editMode={editMode}
          color={bgColors.accentText}
          renderText={localContent.subheading}
          handleClick={handleClick}
          handleSave={handleSave}
          rollBackEdit={rollBackEdit}
          replaceContent={replaceContent}
          font={bodyFont}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          {localContent.primaryButton && (
            <Btn
              id={"primaryButton"}
              isEditing={isEditing("primaryButton")}
              editMode={editMode}
              txtcolor={bgColors.buttonTxt}
              bgColor={bgColors.button}
              hoverColor={bgColors.buttonHover}
              renderText={localContent.primaryButton}
              handleClick={handleClick}
              handleSave={handleSave}
              rollBackEdit={rollBackEdit}
              replaceContent={replaceContent}
              font={primary}
            />
          )}

          {localContent.secondaryButton && (
            <Btn
              id={"secondaryButton"}
              isEditing={isEditing("secondaryButton")}
              editMode={editMode}
              txtcolor={bgColors.secondaryButtonTxt}
              bgColor={bgColors.secondaryButtonBg}
              hoverColor={bgColors.secondaryButtonHover}
              outlineColor={bgColors.secondaryButtonOutline}
              renderText={localContent.secondaryButton}
              handleClick={handleClick}
              handleSave={handleSave}
              rollBackEdit={rollBackEdit}
              replaceContent={replaceContent}
              font={primary}
            />
          )}
        </div>
      </div>

      <Img
        heroImg={heroImg}
        editMode={editMode}
        setShowImgBox={setShowImgBox}
        alt={"hero"}
      />
    </section>
  );
}
