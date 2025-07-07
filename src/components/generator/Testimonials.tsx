// components/Testimonials.tsx
import { Star } from "lucide-react";

export default function Testimonials({
  content,
}: {
  content: { userReviews: string[]; userRatings: number[] };
}) {
  if (!content) return <div></div>;

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900">
        What Our Users Say
      </h2>
      <div className="flex gap-8 overflow-x-auto pb-4">
        {content.userReviews.map((review, idx) => (
          <div
            key={idx}
            className="
              flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg p-6
              flex flex-col justify-between
              hover:shadow-2xl transition
            "
          >
            <p className="text-blue-900 text-lg italic mb-6">"{review}"</p>
            <div className="flex items-center gap-2 mt-auto">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < content.userRatings[idx]
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill={i < content.userRatings[idx] ? "currentColor" : "none"}
                />
              ))}
              <span className="ml-2 text-blue-700 font-semibold">
                ({content.userRatings[idx]}/5)
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
