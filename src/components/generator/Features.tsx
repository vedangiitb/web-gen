import { CheckCircle } from "lucide-react"; // Lucide is used by shadcn/ui for icons
import { colorMap } from "./colorMap";
export type FeaturesProps = {
  content: {
    title: string;
    featureList: string[];
  };
  style: GenStyles;
};

export default function Features({ content, style }: FeaturesProps) {
  if (!content) return null;

  const bgColors = colorMap[style?.color || "zinc"];
  const mutedColors = colorMap[style?.muted || "gray"];

  const primary = style?.font.primary;
  const bodyFont = style?.font.body;

  return (
    <section className={`py-16 px-8 md:px-16 ${primary}`}>
      <h2
        className={`text-3xl md:text-4xl font-bold text-center mb-10 ${bgColors.text}`}
      >
        {content.title}
      </h2>
      <ul className="max-w-4xl mx-auto space-y-6">
        {content.featureList.map((feature, idx) => (
          <li
            key={idx}
            className={`flex items-start gap-3 ${mutedColors.cardBgCol} ${mutedColors.cardBorderCol} ${mutedColors.cardTxtCol} rounded-lg shadow-sm p-5 hover:shadow-md transition`}
          >
            <CheckCircle
              className={`h-6 w-6 ${mutedColors.text} mt-1 flex-shrink-0`}
              aria-hidden="true"
            />
            <span className={`text-lg font-medium ${bodyFont}`}>{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
