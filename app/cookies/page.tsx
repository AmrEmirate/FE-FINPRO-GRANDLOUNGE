export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">Last updated: January 1, 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies</h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our
                website. They are widely used to make websites work more efficiently and provide information to website
                owners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">We use cookies for several purposes:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Essential cookies: Required for the website to function properly</li>
                <li>Performance cookies: Help us understand how visitors interact with our website</li>
                <li>Functionality cookies: Remember your preferences and settings</li>
                <li>Marketing cookies: Used to deliver relevant advertisements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
              <p className="text-gray-700 mb-4">
                You can control and manage cookies in various ways. Please note that removing or blocking cookies can
                impact your user experience and parts of our website may no longer be fully accessible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">
                We may also use third-party cookies from trusted partners for analytics and advertising purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about our use of cookies, please contact us at cookies@grandlodge.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
