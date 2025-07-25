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
  updateData: (key: string, value: any) => void;
  setShowImgBox: (show: boolean) => void;
};

type EditableKey = keyof Pick<
  HeroProps["content"],
  "heading" | "subheading" | "primaryButton" | "secondaryButton"
>;

const editableKeys: EditableKey[] = [
  "heading",
  "subheading",
  "primaryButton",
  "secondaryButton",
];

export default function Hero({
  content,
  style,
  heroImg,
  editMode,
  updateData,
  setShowImgBox,
}: HeroProps) {
  const [localContent, setLocalContent] = useState(content);
  const [editKey, setEditKey] = useState<EditableKey | "">("");
  const [backupContent, setBackupContent] = useState<
    Partial<Record<EditableKey, string>>
  >({});

  const bgColors = colorMap[style?.color || "zinc"];
  const { primary, body } = style?.font || {};

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleClick = (key: string) => {
    if (editableKeys.includes(key as EditableKey)) {
      setBackupContent((prev) => ({
        ...prev,
        [key]: localContent[key as EditableKey],
      }));
      setEditKey(key as EditableKey);
    } else {
      setEditKey("");
    }
  };

  const isEditing = (key: string) => editMode && editKey === key;

  const handleSave = () => {
    const element = document.getElementById(editKey);
    if (!element) return;

    const newValue = element.textContent || "";
    if (editableKeys.includes(editKey as EditableKey)) {
      const updated = { ...localContent, [editKey]: newValue };
      setLocalContent(updated);
      updateData("Hero", updated);
      setEditKey("");
    }
  };

  const replaceContent = (newContent: string) => {
    if (editableKeys.includes(editKey as EditableKey)) {
      setLocalContent((prev) => ({
        ...prev,
        [editKey]: newContent,
      }));
    }
  };

  const rollBackEdit = () => {
    if (
      editableKeys.includes(editKey as EditableKey) &&
      editKey !== "" &&
      backupContent[editKey as EditableKey]
    ) {
      setLocalContent((prev) => ({
        ...prev,
        [editKey as EditableKey]: backupContent[editKey as EditableKey]!,
      }));
      setEditKey("");
    }
  };

  return (
    <section
      className={`flex flex-col-reverse md:flex-row items-center gap-10 px-8 md:px-16 py-20 md:py-28 ${primary}`}
    >
      <div className="flex-1 w-full">
        <Title1
          id="heading"
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
          id="subheading"
          isEditing={isEditing("subheading")}
          editMode={editMode}
          color={bgColors.accentText}
          renderText={localContent.subheading}
          handleClick={handleClick}
          handleSave={handleSave}
          rollBackEdit={rollBackEdit}
          replaceContent={replaceContent}
          font={body}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          {localContent.primaryButton && (
            <Btn
              id="primaryButton"
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
              id="secondaryButton"
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
        alt="hero"
      />
    </section>
  );
}
