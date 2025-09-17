// File asli Anda, sekarang sudah di-refactor
"use client";

import { HelpHeader } from "@/components/tenant/help/HelpHeader";
import { QuickActionsSection } from "@/components/tenant/help/QuickActionsSection";
import { ResourcesSection } from "@/components/tenant/help/ResourcesSection";
import { FaqSection } from "@/components/tenant/help/FaqSection";
import { FinalHelpSection } from "@/components/tenant/help/FinalHelpSection";

export default function TenantHelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HelpHeader />
        <QuickActionsSection />
        <ResourcesSection />
        <FaqSection />
        <FinalHelpSection />
      </div>
    </div>
  );
}