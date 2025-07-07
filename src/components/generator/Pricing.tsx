// components/Pricing.tsx
import { CheckCircle } from "lucide-react";

export default function Pricing({
  content,
}: {
  content: { plans: { name: string; price: string; features: string[] }[] };
}) {
  if (!content) return <div></div>;

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900">
        Pricing Plans
      </h2>
      <div className="flex flex-wrap gap-8 justify-center">
        {content.plans.map((plan, idx) => (
          <div
            key={idx}
            className="
              bg-white rounded-2xl shadow-lg p-8 w-full max-w-xs
              flex flex-col items-center
              hover:scale-105 hover:shadow-2xl transition
            "
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-800">
              {plan.name}
            </h3>
            <p className="text-3xl font-extrabold text-blue-700 mb-6">
              {plan.price}
            </p>
            <ul className="w-full space-y-3 mb-2">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-blue-900">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
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
