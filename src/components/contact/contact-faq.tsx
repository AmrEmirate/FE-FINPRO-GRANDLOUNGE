import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ContactFAQ() {
  const faqs = [
    {
      question: "How do I make a booking?",
      answer:
        "Simply search for your desired destination and dates, select a property, choose your room, and complete the booking process.",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "Most properties offer free cancellation up to 24 hours before check-in. Specific policies vary by property.",
    },
    {
      question: "How do I become a property owner?",
      answer:
        "Click 'Sign Up as Property Owner' to register your property. Our team will guide you through the listing process.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept bank transfers, credit cards, and various digital payment methods. Payment options are shown during booking.",
    },
  ]

  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Quick answers to common questions about our services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{faq.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
