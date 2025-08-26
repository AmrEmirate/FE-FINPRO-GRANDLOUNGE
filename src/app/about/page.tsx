"use client"
import { Users, Building2, Star, Award, Shield, Heart } from "lucide-react"
import { AboutHero } from "@/components/about/about-hero"
import { AboutStats } from "@/components/about/about-stats"
import { AboutStory } from "@/components/about/about-story"
import { AboutValues } from "@/components/about/about-values"
import { AboutTeam } from "@/components/about/about-team"
import { AboutMission } from "@/components/about/about-mission"

const stats = [
  { label: "Properties Listed", value: "10,000+", icon: Building2 },
  { label: "Happy Guests", value: "50,000+", icon: Users },
  { label: "Average Rating", value: "4.8/5", icon: Star },
  { label: "Years of Service", value: "5+", icon: Award },
]

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "We prioritize the safety and security of our guests and property owners through verified listings and secure payment processing.",
  },
  {
    icon: Heart,
    title: "Exceptional Service",
    description:
      "Our dedicated team provides 24/7 support to ensure every stay exceeds expectations and every host succeeds.",
  },
  {
    icon: Star,
    title: "Quality Assurance",
    description:
      "Every property is carefully vetted and regularly reviewed to maintain our high standards of quality and comfort.",
  },
]

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "/team-ceo.png",
    description: "Hospitality industry veteran with 15+ years of experience.",
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "/team-cto.png",
    description: "Technology leader focused on creating seamless user experiences.",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Operations",
    image: "/team-operations.png",
    description: "Ensures smooth operations and exceptional customer service.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AboutHero />
      <AboutStats />
      <AboutStory />
      <AboutValues />
      <AboutTeam />
      <AboutMission />
    </div>
  )
}
