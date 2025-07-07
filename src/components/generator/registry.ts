// components/registry.ts
import dynamic from "next/dynamic";

export const componentRegistry = {
  Navbar: dynamic(() => import("@/components/generator/Navbar")),
  Hero: dynamic(() => import("@/components/generator/Hero")),
  Features: dynamic(() => import("@/components/generator/Features")),
  Testimonials: dynamic(() => import("@/components/generator/Testimonials")),
  Pricing: dynamic(() => import("@/components/generator/Pricing")),
  CallToAction: dynamic(() => import("@/components/generator/CallToAction")),
  FAQ: dynamic(() => import("@/components/generator/FAQ")),
  Footer: dynamic(() => import("@/components/generator/Footer")),
  LoadingPreview: dynamic(() => import("@/components/generator/LoadingPreview")),
};
