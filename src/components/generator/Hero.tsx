// components/Hero/modern.tsx
"use client";
import { Button } from "@/components/ui/button";
import { colorMap } from "./colorMap";
export type HeroProps = {
  content: {
    heading: string;
    subheading: string;
    primaryButton: string;
    secondaryButton: string;
    imageUrl: string;
  };
  style: GenStyles;
};

export default function Hero({ content, style }: HeroProps) {
  if (!content) return <div></div>;

  const colors = colorMap[style?.background || "zinc"];
  const accent = colorMap[style?.accent || "blue"];
  const text = colorMap[style?.text || "gray"];

  return (
    <section
      className={`
        flex flex-col-reverse md:flex-row items-center gap-10
        px-6 py-20 md:py-28
        bg-gradient-to-br ${colors.bgFrom} ${colors.bgVia} ${colors.bgTo}
      `}
    >
      {/* Text Content */}
      <div className="flex-1 w-full">
        <h1
          className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow ${accent.accentText}`}
        >
          {content.heading}
        </h1>
        <p className={`text-lg md:text-xl mb-8 ${text.text}`}>
          {content.subheading}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {content.primaryButton && (
            <Button
              size="lg"
              className={`transition ${accent.button} text-white ${accent.buttonHover}`}
            >
              {content.primaryButton}
            </Button>
          )}
          {content.secondaryButton && (
            <Button
              variant="outline"
              size="lg"
              className={`transition ${accent.buttonOutline}`}
            >
              {content.secondaryButton}
            </Button>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="flex-1 w-full flex justify-center items-center">
        {content.imageUrl && (
          <img
            src={content.imageUrl}
            alt="Hero Image"
            className="w-full max-w-md rounded-2xl shadow-xl object-cover"
          />
        )}
      </div>
    </section>
  );
}
