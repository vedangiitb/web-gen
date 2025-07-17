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
import { updatedb } from "../generate/updateDb";
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
    color: "blue",
    muted: "slate",
    font: {
      primary: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
  });

  const [heroImg, setHeroImg] = useState(
    "https://images.unsplash.com/photo-1510936111840-65e151ad71bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0Mzk3Njh8MHwxfHNlYXJjaHwxfHxibGFua3xlbnwwfDB8fHwxNzUyMTY2NjU3fDA&ixlib=rb-4.1.0&q=85"
  );

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const loadPreviewData = () => {
      const dataJSON = localStorage.getItem("previewData");
      console.log(dataJSON);
      if (!dataJSON) return;

      try {
        const data = JSON.parse(dataJSON);
        console.log("📥 Loaded preview data:", data);

        if (Array.isArray(data.content)) setLayout(data.content);
        if (data.styles) setStyles(data.styles);
        if (data.heroImg) setHeroImg(data.heroImg);
      } catch (err) {
        console.error("Failed to parse preview data", err);
      }
    };

    // Load on mount
    loadPreviewData();

    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        (event.data?.type !== "previewDataUpdated" &&
          event.data?.type !== "editMode")
      )
        return;
      const { type, value } = event.data;

      if (type == "previewDataUpdated") {
        console.log("📬 Received previewDataUpdated via postMessage");
        loadPreviewData();
      } else if (type == "editMode") {
        setEditMode(value);
      }
    };

    // Optionally support tab-based sync as well
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "previewData") {
        console.log("📦 Storage event triggered");
        loadPreviewData();
      }
    };

    window.addEventListener("message", handleMessage);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const bgColors = colorMap[styles?.color || "blue"];

  const updateData = (sectionName: string, value: string) => {
    const ind = getSectionIndex(sectionName);
    if (ind == -1) return;
    let newLayout = [...layout];
    newLayout[ind].props = value;
    console.log("New content");
    console.log(newLayout);
    updatedb({
      content: newLayout,
    });

    localStorage.setItem(
      "previewData",
      JSON.stringify({
        content: newLayout,
        styles: styles,
        heroImg: heroImg,
      })
    );
  };

  const getSectionIndex = (sectionName: string): number => {
    for (var i = 0; i < layout.length; i++) {
      if (layout[i].type == sectionName) {
        return i;
      }
    }
    return -1;
  };

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${bgColors.bgFrom} ${bgColors.bgVia} ${bgColors.bgTo} ${bgColors.text}`}
    >
      {(layout || []).map((section, idx) => {
        console.log(section.type);
        console.log(section.props);
        const Component = componentRegistry[section.type];
        if (!Component) return null;
        if (section.type == "Hero")
          return (
            <Component
              key={idx}
              content={section.props}
              style={styles}
              heroImg={heroImg}
              editMode={editMode}
              updateData={updateData}
            />
          );
        else
          return <Component key={idx} content={section.props} style={styles} />;
      })}
    </main>
  );
}
