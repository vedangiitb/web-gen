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

  const bgColors = colorMap[style?.color || "zinc"];
  const primary = style?.font.primary;

  return (
    <nav
      className={`
        flex items-center justify-between px-8 md:px-16 py-4 
        ${bgColors.bgFrom} backdrop-blur  ${bgColors.bgTo} shadow-sm ${primary}
      `}
    >
      {/* Logo */}
      <div
        className={`font-extrabold text-2xl tracking-tight ${bgColors.text}`}
      >
        {content.logoText}
      </div>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
        {content.links.map((link, idx) => (
          <li
            key={idx}
            className={`
            ${bgColors.text} 
            ${bgColors.linkHover}
            font-medium cursor-pointer transition-colors
            relative overflow-hidden
            group
          `}
          >
            <span className="relative z-10">{link}</span>
            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-current transition-all duration-500 group-hover:w-full" />
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        className={`${bgColors.button} ${bgColors.buttonHover} ${bgColors.buttonTxt} transition`}
      >
        {content.ctaText}
      </Button>

      {/* Mobile menu icon */}
      <div className="md:hidden">
        <MenuIcon className={`h-6 w-6 ${bgColors.text}`} />
      </div>
    </nav>
  );
}
