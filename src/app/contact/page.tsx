import Header from './../components/layout/Header'
import Footer from './../components/layout/Footer'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pt-10">
        {/* Page Header */}
        <section className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-6 py-14 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600">
              We’d love to hear from you. Reach out anytime.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Get in Touch
              </h2>

              <div className="space-y-6">
                {[
                  {
                    icon: EnvelopeIcon,
                    title: 'Email',
                    lines: ['hello@makhaana.com', 'support@makhaana.com'],
                  },
                  {
                    icon: PhoneIcon,
                    title: 'Phone',
                    lines: ['+91 98765 43210', 'Mon–Sat: 9 AM – 6 PM'],
                  },
                  {
                    icon: MapPinIcon,
                    title: 'Address',
                    lines: [
                      'Makhaana Foods Pvt. Ltd.',
                      'Ludhiana, Punjab – 141001',
                      'India',
                    ],
                  },
                ].map(({ icon: Icon, title, lines }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{title}</h3>
                      {lines.map((line, i) => (
                        <p key={i} className="text-sm text-gray-600">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Business Hours
                </h3>
                <p className="text-sm text-gray-600">
                  Monday – Friday: 9:00 AM – 6:00 PM
                </p>
                <p className="text-sm text-gray-600">
                  Saturday: 10:00 AM – 4:00 PM
                </p>
                <p className="text-sm text-gray-600">Sunday: Closed</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>

              <form className="space-y-4">
                {[
                  { label: 'Your Name', type: 'text', placeholder: 'John Doe' },
                  { label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                  { label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210' },
                  { label: 'Subject', type: 'text', placeholder: 'How can we help?' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help…"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
