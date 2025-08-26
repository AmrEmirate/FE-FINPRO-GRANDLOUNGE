import { ContactHero } from "@/src/components/contact/contact-hero"
import { ContactInfo } from "@/src/components/contact/contact-info"
import { ContactForm } from "@/src/components/contact/contact-form"
import { ContactFAQ } from "@/src/components/contact/contact-faq"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ContactHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <ContactInfo />
          <ContactForm />
        </div>
        <ContactFAQ />
      </div>
    </div>
  )
}
