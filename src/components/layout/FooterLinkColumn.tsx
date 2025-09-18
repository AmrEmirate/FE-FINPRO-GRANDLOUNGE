// src/components/layout/FooterLinkColumn.tsx
import Link from "next/link";

interface LinkItem {
  href: string;
  text: string;
}

interface FooterLinkColumnProps {
  title: string;
  links: LinkItem[];
}

export const FooterLinkColumn = ({ title, links }: FooterLinkColumnProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-5 tracking-wide">{title}</h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);