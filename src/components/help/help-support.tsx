import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HelpSupport() {
  return (
    <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Still need help?</h3>
      <p className="text-gray-600 mb-6">Can't find what you're looking for? Our support team is here to help.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/contact">
          <Button size="lg">Contact Support</Button>
        </Link>
      </div>
    </div>
  )
}
