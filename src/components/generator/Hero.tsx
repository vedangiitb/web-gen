"use client";
import { colorMap } from "./colorMap";
import Btn from "./elements/btn1";
import Img from "./elements/img";
import SubHeading from "./elements/subHead";
import Title1 from "./elements/title1";
import { useSectionEditor } from "./lib/useSectionEditor";
import { EditableHeroKeys, HeroContent, HeroProps } from "./types/Hero";

const editableKeys: EditableHeroKeys[] = [
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
  if (!content) return
  const bgColors = colorMap[style?.color || "zinc"];
  const { primary, body } = style?.font || {};

  const {
    state: { localContent, isEditing },
    handlers: { handleClick, handleSave, rollBackEdit, replaceContent },
  } = useSectionEditor<HeroContent, EditableHeroKeys>(
    "Hero",
    content,
    updateData,
    editableKeys,
    editMode
  );

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
          renderText={localContent.heading || ""}
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
          renderText={localContent.subheading || ""}
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
