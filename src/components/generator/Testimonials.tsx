// components/Testimonials.tsx
import { Star } from "lucide-react";
import { colorMap } from "./colorMap";
export type TestimonialProps = {
  content: { userReviews: string[]; userRatings: number[] };
  style: GenStyles;
};

export default function Testimonials({ content, style }: TestimonialProps) {
  if (!content) return null;

  const bg = colorMap[style.background] || "white";
  const text = colorMap[style.text] || "gray";
  const accent = colorMap[style.accent] || "blue";

  return (
    <section
      className={`py-16 px-4 ${bg.bgFrom} ${bg.bgVia} ${bg.bgTo} bg-gradient-to-br`}
    >
      <h2
        className={`text-3xl md:text-4xl font-bold text-center mb-12 ${accent.accentText}`}
      >
        What Our Users Say
      </h2>

      <div className="flex gap-8 overflow-x-auto pb-4">
        {content.userReviews.map((review, idx) => (
          <div
            key={idx}
            className={`
              flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg p-6
              flex flex-col justify-between
              hover:shadow-2xl transition border border-gray-200
            `}
          >
            <p className={`text-lg italic mb-6 ${text.accentText}`}>
              "{review}"
            </p>

            <div className="flex items-center gap-2 mt-auto">
              {[...Array(5)].map((_, i) => {
                const filled = i < content.userRatings[idx];
                return (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      filled
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill={filled ? "currentColor" : "none"}
                  />
                );
              })}
              <span className={`ml-2 font-semibold ${accent.text}`}>
                ({content.userRatings[idx]}/5)
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
