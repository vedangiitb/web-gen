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

  const bg = colorMap[style.background] || "white";
  const text = colorMap[style.text] || "gray";
  const accent = colorMap[style.accent] || "blue";

  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <h2 className={`text-3xl font-bold text-center mb-10 ${accent.accentText}`}>
        Frequently Asked Questions
      </h2>

      <Accordion type="single" collapsible className="space-y-4">
        {content.questions.map((q, idx) => (
          <AccordionItem
            key={idx}
            value={`faq-${idx}`}
            className={`rounded-lg border border-${style.background}-200 shadow-sm ${bg.bgFrom} overflow-hidden`}
          >
            <AccordionTrigger
              className={`text-lg font-semibold px-6 py-4 hover:${accent.bgFrom} transition-all ${text.accentText}`}
            >
              {q.question}
            </AccordionTrigger>
            <AccordionContent
              className={`px-6 py-4 ${accent.bgFrom} ${text.text}`}
            >
              {q.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
