// src/data/tenant-help-data.ts

import { BookOpen, MessageCircle, Phone, Mail, Video, FileText, Users, TrendingUp } from "lucide-react";

export const quickActions = [
  {
    icon: MessageCircle,
    title: "Live Chat Support",
    description: "Get instant help from our property owner support team",
    action: "Start Chat",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Phone,
    title: "Property Owner Hotline",
    description: "Call our dedicated property owner support line",
    action: "+62 21 1234 5679",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send detailed questions to our property team",
    action: "owners@grandlodge.com",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Video,
    title: "Video Tutorial",
    description: "Watch step-by-step guides for property management",
    action: "Watch Now",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

export const resources = [
  {
    icon: BookOpen,
    title: "Property Owner Guide",
    description: "Complete guide to listing and managing your properties",
    category: "Getting Started",
  },
  {
    icon: TrendingUp,
    title: "Pricing Optimization",
    description: "Learn how to set competitive prices for maximum bookings",
    category: "Revenue",
  },
  {
    icon: Users,
    title: "Guest Communication",
    description: "Best practices for communicating with guests",
    category: "Management",
  },
  {
    icon: FileText,
    title: "Legal & Compliance",
    description: "Understanding regulations and requirements",
    category: "Legal",
  },
];

export const faqs = [
  {
    question: "How do I list my first property?",
    answer: "To list your property, go to 'Add Property' in your dashboard...",
  },
  {
    question: "What commission does Grand Lodge charge?",
    answer: "Grand Lodge charges a competitive commission of 15% on each successful booking...",
  },
  // ... (pertanyaan dan jawaban lainnya) ...
];