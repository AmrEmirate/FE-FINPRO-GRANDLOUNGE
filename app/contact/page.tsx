import { ContactHero } from "@/components/contact/contact-hero"
import { ContactInfo } from "@/components/contact/contact-info"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactFAQ } from "@/components/contact/contact-faq"

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
