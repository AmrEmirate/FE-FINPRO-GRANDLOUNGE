"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FinalHelpSection() {
  return (
    <div className="bg-blue-50 rounded-lg p-8 text-center">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Still need help?</h3>
      <p className="text-gray-600 mb-6">
        Our property owner success team is here to help you maximize your earnings.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/contact">
          <Button size="lg">Contact Property Team</Button>
        </Link>
        <Button variant="outline" size="lg">Schedule a Call</Button>
      </div>
    </div>
  );
}