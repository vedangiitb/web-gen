// components/Hero/modern.tsx
"use client";
import { useState } from "react";
import { colorMap } from "./colorMap";
import EditingControls from "./EditingControls";
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
};

export default function Hero({
  content,
  style,
  heroImg,
  editMode,
  updateData,
}: HeroProps) {
  if (!content) return <div></div>;

  const bgColors = colorMap[style?.color || "zinc"];
  const primary = style?.font.primary;
  const bodyFont = style?.font.body;

  const [editElement, setEditElement] = useState<
    "heading" | "subheading" | "primaryButton" | "secondaryButton" | ""
  >("");

  const handleClick = (id: string) => {
    if (
      [
        "heading",
        "subheading",
        "primaryButton",
        "secondaryButton",
        "",
      ].includes(id)
    )
      setEditElement(id as typeof editElement);
  };

  const isEditing = (id: string) => editMode && editElement === id;

  const handleSave = () => {
    const val = document.getElementById(editElement);
    if (!val) return;

    const newContent = { ...content };

    if (
      editElement === "heading" ||
      editElement === "subheading" ||
      editElement === "primaryButton" ||
      editElement === "secondaryButton"
    ) {
      newContent[editElement] = (val as HTMLInputElement).textContent || "";
      updateData("Hero", newContent);
    }

    console.log("Updated content:", newContent);
    setEditElement("");
  };

  return (
    <section
      className={`flex flex-col-reverse md:flex-row items-center gap-10 px-8 md:px-16 py-20 md:py-28 ${primary}`}
    >
      <div className="flex-1 w-full">
        {/* Heading */}
        <h1
          suppressContentEditableWarning
          contentEditable={isEditing("heading")}
          id="heading"
          className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow ${
            bgColors.text
          }
            ${
              editMode
                ? `outline-dashed ${
                    isEditing("heading") ? "outline-blue-500 shadow-md" : ""
                  }`
                : ""
            }
          `}
          onClick={(e) => handleClick((e.target as HTMLElement).id)}
        >
          {content.heading}
        </h1>
        {isEditing("heading") && (
          <EditingControls
            handleSave={handleSave}
            setEditElement={setEditElement}
          />
        )}

        {/* Subheading */}
        <p
          contentEditable={isEditing("subheading")}
          id="subheading"
          className={`text-lg md:text-xl mb-8 ${bgColors.accentText} ${bodyFont}
            ${
              editMode
                ? `outline-dashed ${
                    isEditing("subheading") ? "outline-blue-500 shadow-md" : ""
                  }`
                : ""
            }
          `}
          onClick={(e) => handleClick((e.target as HTMLElement).id)}
        >
          {content.subheading}
        </p>

        {isEditing("subheading") && (
          <EditingControls
            handleSave={handleSave}
            setEditElement={setEditElement}
          />
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {content.primaryButton && (
            <button
              contentEditable={isEditing("primaryButton")}
              id="primaryButton"
              className={`transition ${bgColors.button} ${bgColors.buttonTxt} ${
                bgColors.buttonHover
              } px-6 py-3 rounded-lg text-lg font-semibold 
                ${
                  editMode
                    ? `outline-dashed ${
                        isEditing("primaryButton")
                          ? "outline-blue-500 shadow-md"
                          : ""
                      }`
                    : ""
                }
              `}
              onClick={(e) => handleClick((e.target as HTMLElement).id)}
            >
              {content.primaryButton}
            </button>
          )}

          {content.secondaryButton && (
            <button
              contentEditable={isEditing("secondaryButton")}
              id="secondaryButton"
              className={`transition ${bgColors.secondaryButtonBg} ${
                bgColors.secondaryButtonTxt
              } ${bgColors.secondaryButtonHover} ${
                bgColors.secondaryButtonOutline
              }
                px-6 py-3 rounded-lg text-lg font-semibold
                ${
                  editMode
                    ? `outline-dashed ${
                        isEditing("secondaryButton")
                          ? "outline-blue-500 shadow-md"
                          : ""
                      }`
                    : ""
                }
              `}
              onClick={(e) => handleClick((e.target as HTMLElement).id)}
            >
              {content.secondaryButton}
            </button>
          )}
        </div>

        {(isEditing("primaryButton") || isEditing("secondaryButton")) && (
          <EditingControls
            handleSave={handleSave}
            setEditElement={setEditElement}
          />
        )}
      </div>

      {/* Image */}
      <div className="flex-1 w-full flex justify-center items-center">
        {content.imageUrl && (
          <img
            src={
              heroImg ||
              "https://images.unsplash.com/photo-1510936111840-65e151ad71bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0Mzk3Njh8MHwxfHNlYXJjaHwxfHxibGFua3xlbnwwfDB8fHwxNzUyMTY2NjU3fDA&ixlib=rb-4.1.0&q=85"
            }
            alt="Hero Image"
            className="w-full max-w-md rounded-2xl shadow-xl object-cover"
          />
        )}
      </div>
    </section>
  );
}
