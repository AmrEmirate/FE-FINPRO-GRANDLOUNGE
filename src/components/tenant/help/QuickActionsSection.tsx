"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quickActions } from "@/data/tenant-help-data";

export function QuickActionsSection() {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Get Help Now</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className={`${action.bgColor} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                <action.icon className={`h-8 w-8 ${action.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{action.description}</p>
              <Button variant="outline" className="w-full bg-transparent">{action.action}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}