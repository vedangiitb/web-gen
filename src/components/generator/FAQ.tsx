"use client";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { colorMap } from "./colorMap";
import EditingControls from "../editWebsite/contentEditor/EditingControls";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Input } from "../ui/input";

export type FAQProps = {
  content: {
    questions: { question: string; answer: string }[];
  };
  style: GenStyles;
  editMode: boolean;
  updateData: (section: string, content: any) => void;
};

export default function FAQ({
  content,
  style,
  editMode,
  updateData,
}: FAQProps) {
  if (!content) return null;

  const bgColors = colorMap[style?.color || "zinc"];
  const mutedColors = colorMap[style?.muted || "gray"];
  const primary = style?.font.primary;
  const bodyFont = style?.font.body;

  const [editElement, setEditElement] = useState<string>("");
  const [addFaq, setAddFaq] = useState(false);

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

  const handleAdd = (faq: string, answer: string) => {
    const newQuestions = [
      ...content.questions,
      { question: faq, answer: answer },
    ];
    content.questions = newQuestions;
    updateData("FAQ", { ...content, questions: newQuestions });
    setEditElement("");
  };
  const handleDelete = (idx: number) => {
    const newQuestions = content.questions.filter((_, qidx) => qidx !== idx);
    content.questions = newQuestions;
    updateData("FAQ", { ...content, questions: newQuestions });
    setEditElement("");
  };

  return (
    <section className={`max-w-4xl mx-auto px-8 md:px-16 py-16 ${primary}`}>
      <h2
        className={`text-3xl font-bold text-center mb-10 ${bgColors.textColors}`}
      >
        Frequently Asked Questions
      </h2>

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
                    ? `cursor-pointer outline-dashed rounded-sm px-1 transition ${
                        isEditing(`q-${idx}-question`)
                          ? "outline-blue-500 shadow-md"
                          : ""
                      }`
                    : ""
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(`q-${idx}-question`);
                }}
              >
                {q.question}
              </span>
              {isEditing(`q-${idx}-question`) && (
                <EditingControls
                  handleSave={() => handleSave(idx, "question")}
                  setEditElement={setEditElement}
                  deleteElement={() => handleDelete(idx)}
                />
              )}
            </AccordionTrigger>
            <AccordionContent
              className={`px-6 py-4 ${mutedColors.accentText} ${bodyFont}`}
            >
              <div
                suppressContentEditableWarning
                contentEditable={isEditing(`q-${idx}-answer`)}
                id={`q-${idx}-answer`}
                className={
                  editMode
                    ? `cursor-pointer outline-dashed min-h-[30px] rounded-sm px-1 transition ${
                        isEditing(`q-${idx}-answer`)
                          ? "outline-blue-500 shadow-md"
                          : ""
                      }`
                    : ""
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(`q-${idx}-answer`);
                }}
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
          </AccordionItem>
        ))}
      </Accordion>

      {editMode && (
        <Button onClick={() => setAddFaq(true)}>Add Question</Button>
      )}

      {addFaq && <AddFAQ cancel={setAddFaq} addFaq={handleAdd} />}
    </section>
  );
}

function AddFAQ({
  cancel,
  addFaq,
}: {
  cancel: React.Dispatch<React.SetStateAction<boolean>>;
  addFaq: (faq: string, answer: string) => void;
}) {
  const [faq, setFaq] = useState("");
  const [answer, setAnswer] = useState("");

  return (
    <div className="absolute z-50 w-[300px] bg-muted border border-muted-foreground rounded-2xl p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Add FAQ</h2>
        <button
          onClick={() => cancel(false)}
          className="text-muted-foreground hover:text-foreground transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Name Input */}
      <div className="mb-3">
        <label className="text-sm font-medium text-muted-foreground">FAQ</label>
        <Input
          value={faq}
          onChange={(e) => setFaq(e.target.value)}
          placeholder="Question"
          className="mt-1"
        />
      </div>

      {/* Link Input */}
      <div className="mb-4">
        <label className="text-sm font-medium text-muted-foreground">
          Answer
        </label>
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="answer"
          className="mt-1"
        />
      </div>

      {/* Action Button */}
      <Button
        className="w-full"
        onClick={() => {
          addFaq(faq, answer);
          cancel(false);
        }}
        disabled={!faq || !answer}
      >
        Add Link
      </Button>
    </div>
  );
}
