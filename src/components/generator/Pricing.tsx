// components/Pricing.tsx
import { CheckCircle } from "lucide-react";
import { colorMap } from "./colorMap";
export type PricingProps = {
  content: { plans: { name: string; price: string; features: string[] }[] };
  style: GenStyles;
};

export default function Pricing({ content, style }: PricingProps) {
  if (!content) return null;

  const bgColors = colorMap[style?.color || "zinc"];
  const mutedColors = colorMap[style?.muted || "gray"];

  const primary = style?.font.primary;
  const bodyFont = style?.font.body;

  return (
    <section className={`py-16 px-4 ${primary}`}>
      <h2
        className={`text-3xl md:text-4xl font-bold text-center mb-12 ${bgColors.text}`}
      >
        Pricing Plans
      </h2>

      <div className="flex flex-wrap gap-8 justify-center">
        {content.plans.map((plan, idx) => (
          <div
            key={idx}
            className={`
              rounded-2xl shadow-lg p-8 w-full max-w-xs
              flex flex-col items-center
              hover:scale-105 hover:shadow-2xl transition
              border border-gray-200
               ${mutedColors.cardBgCol} ${mutedColors.cardBorderCol} ${mutedColors.cardTxtCol} shadow-sm
            `}
          >
            <h3 className={`text-xl font-semibold mb-2`}>{plan.name}</h3>
            <p
              className={`text-3xl font-bold ${bgColors.secondaryButtonBg} ${bgColors.secondaryTxtCol} mb-6 px-4 py-2 rounded-md`}
            >
              {plan.price}
            </p>
            <ul className="w-full space-y-3 mb-2">
              {plan.features.map((feat, i) => (
                <li key={i} className={`flex items-center gap-2 `}>
                  <CheckCircle className={`h-5 w-5`} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
