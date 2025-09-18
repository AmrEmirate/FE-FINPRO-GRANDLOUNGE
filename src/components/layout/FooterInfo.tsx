// src/components/layout/FooterInfo.tsx
import Link from "next/link";
import { contactInfo } from "@/lib/constants/footer-data";

export const FooterInfo = () => (
  <div>
    <Link href="/" className="flex items-center mb-4">
      <img src="/assets/LONGE.png" alt="Logo" className="h-12 w-auto" />
    </Link>
    <p className="text-gray-400 mb-4 text-sm leading-relaxed">
      Your trusted partner for finding the perfect accommodation.
    </p>
    <div className="space-y-3">
      {contactInfo.map(({ icon: Icon, text }) => (
        <div key={text} className="flex items-center text-gray-400 hover:text-white transition-colors">
          <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
          <span className="text-sm">{text}</span>
        </div>
      ))}
    </div>
  </div>
);