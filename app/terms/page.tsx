export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">Last updated: January 1, 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Grand Lodge, you accept and agree to be bound by the terms and provision of this
                agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily use Grand Lodge for personal, non-commercial transitory viewing
                only.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>This is the grant of a license, not a transfer of title</li>
                <li>You may not modify or copy the materials</li>
                <li>You may not use the materials for commercial purposes</li>
                <li>You may not reverse engineer any software</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Booking Terms</h2>
              <p className="text-gray-700 mb-4">
                All bookings are subject to availability and confirmation by the property owner.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Prices are subject to change without notice</li>
                <li>Cancellation policies vary by property</li>
                <li>Payment is required at time of booking</li>
                <li>Additional fees may apply</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                Users are responsible for maintaining the confidentiality of their account information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at legal@grandlodge.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
