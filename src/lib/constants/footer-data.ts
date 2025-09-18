// src/lib/constants/footer-data.ts
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export const contactInfo = [
  { icon: Phone, text: "+62 21 1234 5678" },
  { icon: Mail, text: "info@grandlodge.com" },
  { icon: MapPin, text: "Jakarta, Indonesia" },
];

export const popularDestinations = {
  title: "Popular Destinations",
  links: [
    { href: "/properties?category=Vila&location=Bali", text: "Vila in Bali" },
    { href: "/properties?category=Hotel&location=Jakarta", text: "Hotel in Jakarta" },
    { href: "/properties?category=Apartemen&location=Bandung", text: "Apartment in Bandung" },
    { href: "/properties?category=Vila&location=Yogyakarta", text: "Vila in Yogyakarta" },
  ],
};

export const quickLinks = {
  title: "Quick Links",
  links: [
    { href: "/properties", text: "All Properties" },
    { href: "/about", text: "About Us" },
    { href: "/contact", text: "Contact Us" },
    { href: "/help", text: "Help Center" },
  ],
};

export const socialLinks = [
  { href: "#", label: "Facebook", icon: Facebook },
  { href: "#", label: "Instagram", icon: Instagram },
  { href: "#", label: "Twitter", icon: Twitter },
];

export const legalLinks = [
    { href: "/privacy", text: "Privacy Policy" },
    { href: "/terms", text: "Terms of Service" },
    { href: "/cookies", text: "Cookie Policy" },
];