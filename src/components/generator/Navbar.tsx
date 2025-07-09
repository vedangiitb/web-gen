// components/Navbar/minimal.tsx
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { colorMap } from "./colorMap";

export type NavbarProps = {
  content: { logoText: string; links: string[]; ctaText: string };
  style: GenStyles;
};

export default function Navbar({ content, style }: NavbarProps) {
  if (!content) return <div></div>;

  const bgColors = colorMap[style?.background || "zinc"];
  const textColors = colorMap[style?.accent || "blue"];
  const accentColors = colorMap[style?.text || "gray"];


  return (
    <nav
      className={`
        flex items-center justify-between px-6 py-4 
        ${bgColors.bgFrom} backdrop-blur border-b ${bgColors.bgTo} shadow-sm
      `}
    >
      {/* Logo */}
      <div
        className={`font-extrabold text-2xl tracking-tight ${accentColors.accentText}`}
      >
        {content.logoText}
      </div>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
        {content.links.map((link, idx) => (
          <li
            key={idx}
            className={`
              ${textColors.text} 
              ${textColors.linkHover}
              font-medium cursor-pointer transition-colors
            `}
          >
            {link}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        className={`${accentColors.button} ${accentColors.buttonHover} ${accentColors.buttonTxt} transition`}
      >
        {content.ctaText}
      </Button>

      {/* Mobile menu icon */}
      <div className="md:hidden">
        <MenuIcon className={`h-6 w-6 ${accentColors.accentText}`} />
      </div>
    </nav>
  );
}
