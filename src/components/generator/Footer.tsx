import { Facebook, Twitter, Linkedin, Instagram, Globe } from "lucide-react";

export type FooterProps = {
  content: {
    companyInfo: string;
    links: { label: string; href: string }[];
    socials: { type: string; href: string }[];
  };
  style: GenStyles;
};

// Helper to render the right icon
function SocialIcon({ type, ...props }: { type: string; className?: string }) {
  if (!type) {
    return <Globe {...props} />;
  }
  switch (type.toLowerCase()) {
    case "facebook":
      return <Facebook {...props} />;
    case "twitter":
      return <Twitter {...props} />;
    case "linkedin":
      return <Linkedin {...props} />;
    case "instagram":
      return <Instagram {...props} />;
    default:
      return <Globe {...props} />;
  }
}

export default function Footer({ content,style }: FooterProps) {
  if (!content) return null;

  return (
    <footer className="bg-neutral-900 text-neutral-200 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-8">
        {/* Company Info */}
        <div className="text-center md:text-left text-sm mb-4 md:mb-0">
          <p>{content.companyInfo}</p>
        </div>
        {/* Links */}
        <ul className="flex flex-wrap justify-center gap-6 text-base font-medium">
          {content.links.map((link, idx) => (
            <li key={idx}>
              <a
                href={link.href}
                className="hover:text-blue-400 transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        {/* Socials */}
        <div className="flex gap-4">
          {content.socials.map((social, idx) => (
            <a
              key={idx}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.type}
              className="text-neutral-400 hover:text-blue-400 transition-colors"
            >
              <SocialIcon type={social.type} className="h-6 w-6" />
            </a>
          ))}
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-neutral-400">
        {content.companyInfo} &mdash; All
        rights reserved.
      </div>
    </footer>
  );
}
