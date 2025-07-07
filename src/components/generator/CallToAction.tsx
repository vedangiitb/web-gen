// app/components/CallToAction.tsx
import { Button } from "@/components/ui/button"; // shadcn/ui Button

type CallToActionProps = {
  content: {
    heading: string;
    subtext: string;
    buttonText: string;
    onClick?: () => void; // Optional: handle button click
  };
};

export default function CallToAction({ content }: CallToActionProps) {
  if (!content) return null;

  return (
    <section
      className="
        relative isolate overflow-hidden rounded-xl
        bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400
        px-6 py-16 text-center shadow-lg
        flex flex-col items-center justify-center
      "
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
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow">
          {content.heading}
        </h2>
        <p className="mb-8 text-lg md:text-xl text-blue-100">
          {content.subtext}
        </p>
        <Button
          size="lg"
          className="bg-white text-blue-700 font-semibold hover:bg-blue-50 transition"
          onClick={content.onClick}
        >
          {content.buttonText}
        </Button>
      </div>
    </section>
  );
}
