"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FAQ {
  category: string
  question: string
  answer: string
}

interface HelpFAQProps {
  faqs: FAQ[]
  selectedCategory: string
  onClearCategory: () => void
}

export function HelpFAQ({ faqs, selectedCategory, onClearCategory }: HelpFAQProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        {selectedCategory !== "all" && (
          <Button variant="outline" onClick={onClearCategory}>
            Show All Categories
          </Button>
        )}
      </div>

      {faqs.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="px-6">
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or browse our categories above.</p>
            <Button onClick={onClearCategory}>Clear Search</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
