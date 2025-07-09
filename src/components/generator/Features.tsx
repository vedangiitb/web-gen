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

  const bg = colorMap[style.background] || "white";
  const text = colorMap[style.text] || "gray";
  const accent = colorMap[style.accent] || "blue";

  return (
    <section
      className={`py-16 px-4 ${bg.bgFrom} ${bg.bgVia} ${bg.bgTo} bg-gradient-to-br`}
    >
      <h2
        className={`text-3xl md:text-4xl font-bold text-center mb-10 ${accent.accentText}`}
      >
        {content.title}
      </h2>
      <ul className="max-w-2xl mx-auto space-y-6">
        {content.featureList.map((feature, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition"
          >
            <CheckCircle
              className={`h-6 w-6 ${accent.button} mt-1 flex-shrink-0`}
              aria-hidden="true"
            />
            <span className={`text-lg ${text.accentText}`}>{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
