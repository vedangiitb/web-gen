"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { colorMap } from "./colorMap";

export type FAQProps = {
  content: {
    questions: { question: string; answer: string }[];
  };
  style: GenStyles;
};

export default function FAQ({ content, style }: FAQProps) {
  if (!content) return null;

  const bgColors = colorMap[style?.color || "zinc"];
  const mutedColors = colorMap[style?.muted || "gray"];

  const primary = style?.font.primary;
  const bodyFont = style?.font.body;

  return (
    <section className={`max-w-2xl mx-auto px-4 py-16 ${primary}`}>
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
            className={`rounded-lg border ${mutedColors.cardBgCol} ${mutedColors.cardBorderCol} ${mutedColors.cardTxtCol} shadow-sm overflow-hidden`}
          >
            <AccordionTrigger
              className={`text-lg font-semibold px-6 py-4 hover:${mutedColors.bgTo} transition-all`}
            >
              {q.question}
            </AccordionTrigger>
            <AccordionContent className={`px-6 py-4 ${mutedColors.accentText} ${bodyFont}`}>
              {q.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
