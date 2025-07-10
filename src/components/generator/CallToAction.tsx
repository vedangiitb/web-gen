// app/components/CallToAction.tsx
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import { colorMap } from "./colorMap";
export type CallToActionProps = {
  content: {
    heading: string;
    subtext: string;
    buttonText: string;
    onClick?: () => void; // Optional: handle button click
  };
  style: GenStyles;
};

export default function CallToAction({ content, style }: CallToActionProps) {
  if (!content) return null;

  const mutedColors = colorMap[style?.muted || "gray"];
  const bgColors = colorMap[style?.color || "zinc"];

  const primary = style?.font.primary;
  const bodyFont = style?.font.body;

  return (
    <section
      className={`
        relative isolate overflow-hidden
        px-6 py-16 text-center
        flex flex-col items-center justify-center ${primary}
      `}
    >
      {/* Decorative background SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        aria-hidden="true"
        viewBox="0 0 1024 1024"
        fill="none"
      >
        <circle cx="512" cy="512" r="400" fill="url(#gradient)" />
        <defs>
          <radialGradient
            id="gradient"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(512 512) scale(400)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0.2" />
            <stop offset="1" stopColor="#0070f3" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <div className="relative z-10 max-w-2xl mx-auto">
        <h2
          className={`text-3xl md:text-4xl font-bold mb-4 ${bgColors.text} drop-shadow`}
        >
          {content.heading}
        </h2>
        <p className={`mb-8 text-lg md:text-xl ${bgColors.accentText}`}>
          {content.subtext}
        </p>
        <Button
          size="lg"
          className={`transition ${bgColors.button} ${bgColors.buttonTxt} ${bgColors.buttonHover} font-semibold `}
          onClick={content.onClick}
        >
          {content.buttonText}
        </Button>
      </div>
    </section>
  );
}
