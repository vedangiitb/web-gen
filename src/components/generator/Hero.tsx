// components/Hero/modern.tsx
"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Hero({
  content,
}: {
  content: {
    heading: string;
    subheading: string;
    primaryButton: string;
    secondaryButton: string;
    imageUrl: string;
  };
}) {
  if (!content) return <div></div>;
  const [colors, setColors] = useState({
    bgGradient: "from-blue-50 via-white to-blue-100",
    headingCol: "text-blue-900",
    subHeadingCol: "text-blue-700",
    primarybtnCol: "bg-blue-700",
    primarybtnTxt: "text-white",
    primarybtnHover: "bg-blue-800",
    secondarybtnCol: "bg-blue-700",
    secondarybtnborder: "border-blue-700",
    secondarybtnTxt: "text-white",
    secondarybtnHover: "bg-blue-100",
  });

  // Generates a set of Tailwind color classes based on a base color (e.g., "red", "green", "indigo")
  const colorGen = (color: string) =>
    setColors({
      bgGradient: `from-${color}-50 via-white to-${color}-100`,
      headingCol: `text-${color}-900`,
      subHeadingCol: `text-${color}-700`,
      primarybtnCol: `bg-${color}-700`,
      primarybtnTxt: "text-white",
      primarybtnHover: `bg-${color}-800`,
      secondarybtnCol: `bg-${color}-700`,
      secondarybtnborder: `border-${color}-700`,
      secondarybtnTxt: "text-white",
      secondarybtnHover: `bg-${color}-100`,
    });

    
  return (
    <section
      className={`
        flex flex-col-reverse md:flex-row items-center gap-10
        px-6 py-20 md:py-28 bg-gradient-to-br 
        rounded-3xl shadow-lg max-w-6xl mx-auto ${colors.bgGradient}
      `}
    >
      {/* Text Content */}
      <div className="flex-1 w-full">
        <h1
          className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow ${colors.headingCol}`}
        >
          {content.heading}
        </h1>
        <p className={`text-lg md:text-xl mb-8 ${colors.subHeadingCol}`}>
          {content.subheading}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {content.primaryButton ? (
            <Button
              size="lg"
              className={`transition ${colors.primarybtnCol} ${colors.primarybtnTxt} hover:${colors.primarybtnHover}`}
            >
              {content.primaryButton}
            </Button>
          ) : null}

          {content.secondaryButton && (
            <Button
              variant="outline"
              size="lg"
              className={`transition ${colors.secondarybtnCol} ${colors.secondarybtnTxt} hover:${colors.secondarybtnHover}`}
            >
              {content.secondaryButton}
            </Button>
          )}
        </div>
      </div>
      {/* Image */}
      <div className="flex-1 w-full flex justify-center items-center">
        {content.imageUrl ? (
          <img
            src={content.imageUrl}
            alt={content.imageUrl ? "Hero Image" : "Loading..."}
            className="w-full max-w-md rounded-2xl shadow-xl object-cover"
          />
        ) : null}
      </div>
    </section>
  );
}
