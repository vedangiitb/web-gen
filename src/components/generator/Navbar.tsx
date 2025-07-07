// components/Navbar/minimal.tsx
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

export default function Navbar({
  content,
}: {
  content: { logoText: string; links: string[]; ctaText: string };
}) {
  if (!content) return <div></div>;

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
      {/* Logo */}
      <div className="font-extrabold text-2xl text-blue-700 tracking-tight">
        {content.logoText}
      </div>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
        {content.links.map((link, idx) => (
          <li
            key={idx}
            className="text-gray-700 hover:text-blue-700 font-medium cursor-pointer transition-colors"
          >
            {link}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button className="ml-6 bg-blue-700 text-white hover:bg-blue-800 transition">
        {content.ctaText}
      </Button>

      {/* Mobile menu placeholder (optional, for future expansion) */}
      <div className="md:hidden">
        <MenuIcon className="h-6 w-6 text-blue-700" />
      </div>
    </nav>
  );
}
