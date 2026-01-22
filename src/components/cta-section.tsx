export default function CTASection() {
  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-20 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200">

          {/* Soft Glow Accent */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#16A34A]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#16A34A]/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center px-6 sm:px-10 py-14 sm:py-16">

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ready to transform your business?
            </h2>

            {/* Subheading */}
            <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
              Join thousands of businesses capturing leads, automating conversations,
              and growing revenue with Kyra CRM.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  window.location.href =
                    "https://crm-backend-7lf9.onrender.com/api/auth/google";
                }}
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                Start for FREE →
              </button>

              {/* <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors">
                Join Live Demo
              </button> */}
            </div>

            {/* Trust Line */}
            <p className="text-sm text-gray-500 mt-6">
              No credit card required · Setup in minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
