// src/components/layout/footer.tsx

import Link from "next/link";
import { FooterInfo } from "./FooterInfo";
import { FooterLinkColumn } from "./FooterLinkColumn";
import { FooterNewsletterAndSocials } from "./FooterNewsletterAndSocials";
import { popularDestinations, quickLinks, legalLinks } from "@/lib/constants/footer-data";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <FooterInfo />
          <FooterLinkColumn title={popularDestinations.title} links={popularDestinations.links} />
          <FooterLinkColumn title={quickLinks.title} links={quickLinks.links} />
          <FooterNewsletterAndSocials />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Grand Lodge. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              {legalLinks.map(link => (
                  <Link key={link.href} href={link.href} className="text-gray-400 hover:text-white text-sm">
                    {link.text}
                  </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}