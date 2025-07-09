"use client";
import { componentRegistry } from "@/components/generator/registry";
import { useEffect, useState } from "react";

import type { CallToActionProps } from "@/components/generator/CallToAction";
import type { FAQProps } from "@/components/generator/FAQ";
import type { FeaturesProps } from "@/components/generator/Features";
import type { FooterProps } from "@/components/generator/Footer";
import type { HeroProps } from "@/components/generator/Hero";
import type { NavbarProps } from "@/components/generator/Navbar";
import type { PricingProps } from "@/components/generator/Pricing";
import type { TestimonialProps } from "@/components/generator/Testimonials";
import { colorMap } from "@/components/generator/colorMap";
type Section =
  | { type: "CallToAction"; props: CallToActionProps }
  | { type: "FAQ"; props: FAQProps }
  | { type: "Features"; props: FeaturesProps }
  | { type: "Footer"; props: FooterProps }
  | { type: "Hero"; props: HeroProps }
  | { type: "Navbar"; props: NavbarProps }
  | { type: "Pricing"; props: PricingProps }
  | { type: "Testimonials"; props: TestimonialProps }
  | { type: "LoadingPreview"; props: {} };

export default function PreviewPage() {
  const [layout, setLayout] = useState<Section[]>([
    {
      type: "LoadingPreview",
      props: {},
    },
  ]);

  const [styles, setStyles] = useState<GenStyles>({
    color: "rose",
    muted: "pink",
  });
  console.log(layout);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        !event.data?.type ||
        event.data.type !== "previewData"
      ) {
        return;
      }

      if (event.data.type === "previewData") {
        console.log("Received data from parent:", event.data.payload);
        setLayout(event.data.payload.content);
        setStyles(event.data.payload.styles);
      }
    }

    window.addEventListener("message", handleMessage);

    console.log("hey there");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const bgColors = colorMap[styles?.color || "zinc"];

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${bgColors.bgFrom} ${bgColors.bgVia} ${bgColors.bgTo} ${bgColors.text}`}
    >
      {layout.map((section, idx) => {
        console.log(section.type);
        console.log(section.props);
        const Component = componentRegistry[section.type];
        if (!Component) return null;
        return <Component key={idx} content={section.props} style={styles} />;
      })}
    </main>
  );
}
