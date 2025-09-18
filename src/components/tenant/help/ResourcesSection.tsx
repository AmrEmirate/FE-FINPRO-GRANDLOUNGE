"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resources } from "@/data/tenant-help-data";

export function ResourcesSection() {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Learning Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <resource.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{resource.title}</h3>
                  <Badge variant="secondary">{resource.category}</Badge>
                </div>
                <p className="text-gray-600 text-sm">{resource.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}