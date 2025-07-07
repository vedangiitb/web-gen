// pages/preview.tsx or wherever
"use client";
import { componentRegistry } from "@/components/generator/registry";
import { useEffect, useState } from "react";

interface Section {
  type: keyof typeof componentRegistry; // only keys present in registry
  props: Record<string, any>;
}

export default function PreviewPage() {
  const [layout, setLayout] = useState<Section[]>([
    {
      type: "LoadingPreview",
      props: {},
    },
  ]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        !event.data?.type ||
        event.data.type !== "previewData"
      ) {
        return;
      }

      console.log("Received data from parent:", event.data.payload);
      setLayout(event.data.payload);
    }

    window.addEventListener("message", handleMessage);

    console.log("hey there");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {layout.map((section, idx) => {
        console.log(section.type);
        console.log(section.props);
        const Component = componentRegistry[section.type];
        if (!Component) return null;
        return <Component key={idx} content={section.props} />;
      })}
    </main>
  );
}
