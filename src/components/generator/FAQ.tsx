"use client";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { colorMap } from "./colorMap";
import EditingControls from "./EditingControls";

export type FAQProps = {
  content: {
    questions: { question: string; answer: string }[];
  };
  style: GenStyles;
  editMode: boolean;
  updateData: (section: string, content: any) => void;
};

export default function FAQ({ content, style, editMode, updateData }: FAQProps) {
  if (!content) return null;

  const bgColors = colorMap[style?.color || "zinc"];
  const mutedColors = colorMap[style?.muted || "gray"];
  const primary = style?.font.primary;
  const bodyFont = style?.font.body;

  // Track which field (e.g. "q-0-question", "q-2-answer") is being edited
  const [editElement, setEditElement] = useState<string>("");

  const isEditing = (id: string) => editMode && editElement === id;

  const handleEditClick = (id: string) => {
    if (editMode) setEditElement(id);
  };

  // Save logic for both question and answer
  const handleSave = (idx: number, field: "question" | "answer") => {
    const id = `q-${idx}-${field}`;
    const el = document.getElementById(id);
    if (!el) return;
    const newQuestions = [...content.questions];
    newQuestions[idx] = {
      ...newQuestions[idx],
      [field]: el.textContent || "",
    };
    updateData("FAQ", { ...content, questions: newQuestions });
    setEditElement("");
  };

  // Optional: Add/Remove Q/A
  // const handleAdd = () => {
  //   const newQuestions = [...content.questions, { question: "New question", answer: "Answer here" }];
  //   updateData("FAQ", { ...content, questions: newQuestions });
  // };
  // const handleDelete = (idx: number) => {
  //   const newQuestions = content.questions.filter((_, qidx) => qidx !== idx);
  //   updateData("FAQ", { ...content, questions: newQuestions });
  // };

  return (
    <section className={`max-w-4xl mx-auto px-8 md:px-16 py-16 ${primary}`}>
      <h2
        className={`text-3xl font-bold text-center mb-10 ${bgColors.textColors}`}
      >
        Frequently Asked Questions
      </h2>

      {/* Uncomment if you want add button */}
      {/* {editMode && (
        <button
          onClick={handleAdd}
          className="mb-6 px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
        >
          Add Question
        </button>
      )} */}

      <Accordion type="single" collapsible className="space-y-4">
        {content.questions.map((q, idx) => (
          <AccordionItem
            key={idx}
            value={`faq-${idx}`}
            className={`rounded-lg border ${mutedColors.cardBgCol} ${mutedColors.cardBorderCol} ${mutedColors.cardTxtCol} shadow-sm overflow-hidden relative`}
          >
            <AccordionTrigger
              className={`text-lg font-semibold px-6 py-4 hover:${mutedColors.bgTo} transition-all cursor-pointer select-none`}
            >
              <span
                suppressContentEditableWarning
                contentEditable={isEditing(`q-${idx}-question`)}
                id={`q-${idx}-question`}
                className={
                  editMode
                    ? `outline-dashed rounded-sm px-1 transition ${
                        isEditing(`q-${idx}-question`) ? "outline-blue-500 shadow-md" : ""
                      }`
                    : ""
                }
                onClick={e => { e.stopPropagation(); handleEditClick(`q-${idx}-question`); }}
              >
                {q.question}
              </span>
              {isEditing(`q-${idx}-question`) && (
                <EditingControls
                  handleSave={() => handleSave(idx, "question")}
                  setEditElement={setEditElement}
                />
              )}
            </AccordionTrigger>
            <AccordionContent className={`px-6 py-4 ${mutedColors.accentText} ${bodyFont}`}>
              <div
                suppressContentEditableWarning
                contentEditable={isEditing(`q-${idx}-answer`)}
                id={`q-${idx}-answer`}
                className={
                  editMode
                    ? `outline-dashed min-h-[30px] rounded-sm px-1 transition ${
                        isEditing(`q-${idx}-answer`) ? "outline-blue-500 shadow-md" : ""
                      }`
                    : ""
                }
                onClick={e => { e.stopPropagation(); handleEditClick(`q-${idx}-answer`); }}
              >
                {q.answer}
              </div>
              {isEditing(`q-${idx}-answer`) && (
                <EditingControls
                  handleSave={() => handleSave(idx, "answer")}
                  setEditElement={setEditElement}
                />
              )}
            </AccordionContent>
            {/* Uncomment if you want per-item delete button */}
            {/* {editMode && (
              <button
                onClick={() => handleDelete(idx)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            )} */}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
