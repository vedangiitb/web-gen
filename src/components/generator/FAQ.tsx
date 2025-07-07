"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQProps = {
  content: {
    questions: { question: string; answer: string }[];
  };
};

export default function FAQ({ content }: FAQProps) {
  if (!content) return null;

  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-10">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="space-y-4">
        {content.questions.map((q, idx) => (
          <AccordionItem
            key={idx}
            value={`faq-${idx}`}
            className="rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden"
          >
            <AccordionTrigger className="text-lg font-semibold px-6 py-4 hover:bg-blue-50 transition-all">
              {q.question}
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-blue-50 text-gray-700">
              {q.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
