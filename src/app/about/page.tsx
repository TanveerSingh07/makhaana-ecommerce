import Header from './../components/layout/Header'
import Footer from './../components/layout/Footer'

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="pt-10 bg-gray-50 min-h-screen">
        {/* Page Header */}
        <section className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-bold text-gray-900">
              About Makhaana
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Premium quality fox nuts crafted for healthy, delicious snacking.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-6 py-14 bg-white mt-8 rounded-xl shadow-sm">
          <div className="space-y-8 text-gray-700 leading-relaxed">
            
            <p className="text-lg">
              Welcome to <span className="font-semibold text-gray-900">Makhaana</span>, 
              your trusted source for premium-quality fox nuts (makhana). 
              We believe healthy snacking should be both nutritious and enjoyable.
            </p>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Our Story
              </h2>
              <p>
                Makhaana was founded with a simple mission — to make healthy 
                snacking accessible without compromising on taste. We carefully 
                source high-quality fox nuts and process them using methods that 
                preserve their natural goodness.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why Choose Makhaana?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: '100% Natural',
                    desc: 'No artificial additives or preservatives.',
                  },
                  {
                    title: 'Quality Assured',
                    desc: 'Every batch is carefully tested for freshness.',
                  },
                  {
                    title: 'Delicious Flavours',
                    desc: 'From classic to bold flavours for every taste.',
                  },
                  {
                    title: 'Health Benefits',
                    desc: 'Low-calorie, high-protein, nutrient-rich snack.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="border rounded-lg p-6 bg-emerald-50"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Our Commitment
              </h2>
              <p>
                We are committed to sustainability, ethical sourcing, 
                and customer satisfaction. From farm to packaging, 
                every step reflects our dedication to quality.
              </p>
            </div>

            <div className="bg-emerald-50 rounded-lg p-6 text-center">
              <p className="font-semibold text-gray-900">
                Thank you for choosing Makhaana.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Let’s make healthy snacking a delicious habit.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
