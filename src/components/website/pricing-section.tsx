import { useState } from "react"

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("annually")

  const pricing = {
    starter: { monthly: 0, annually: 0 },
    professional: { monthly: "7,000", annually: "84,000" },
    enterprise: { monthly: "14,000", annually: "168,000" },
  }

  return (
    <section className="w-full bg-gray-50 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          {/* <Badge
            icon={<span className="w-2 h-2 bg-[#16A34A] rounded-full inline-block" />}
            text="Social Proof"
          /> */}
          <span className="inline-block mb-4 px-4 py-1 text-sm font-medium text-[#16A34A] bg-green-100 rounded-full">
            Plans & Pricing
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pay for growth, not software
          </h2>

          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Start free and upgrade as your revenue grows
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-14">
          <div className="flex items-center gap-2 p-1 bg-white rounded-full shadow-sm border">
            {["annually", "monthly"].map((type) => (
              <button
                key={type}
                onClick={() => setBillingPeriod(type as any)}
                className={`px-6 py-2 text-sm font-semibold rounded-full transition
                  ${billingPeriod === type
                    ? "bg-[#16A34A] text-white"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {type === "annually" ? "Annually (Save 20%)" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Starter */}
          <PricingCard
            title="Starter"
            desc="For individuals getting started"
            price={pricing.starter[billingPeriod]}
            billingPeriod={billingPeriod}
            button="Start for free"
            features={[
              "Up to 3 chatbots",
              "Basic lead capture",
              "Community support",
              "Standard analytics",
            ]}
          />

          {/* Professional (Featured) */}
          <PricingCard
            featured
            title="Professional"
            desc="Best for growing teams"
            price={pricing.professional[billingPeriod]}
            billingPeriod={billingPeriod}
            button="Get started"
            features={[
              "Unlimited chatbots",
              "Advanced lead qualification",
              "CRM pipeline",
              "Team collaboration",
              "Priority support",
              "API access",
            ]}
          />

          {/* Enterprise */}
          <PricingCard
            title="Enterprise"
            desc="For large organizations"
            price={pricing.enterprise[billingPeriod]}
            billingPeriod={billingPeriod}
            button="Contact sales"
            features={[
              "Everything in Professional",
              "Dedicated account manager",
              "Custom integrations",
              "SSO & security controls",
              "White-labeling",
            ]}
          />

        </div>
      </div>
    </section>
  )
}

/* ---------------- COMPONENT ---------------- */

function PricingCard({
  title,
  desc,
  price,
  billingPeriod,
  button,
  features,
  featured = false,
}: any) {
  return (
    <div
      className={`rounded-2xl p-8 flex flex-col justify-between shadow-sm transition
        ${featured
          ? "bg-[#16A34A] text-white scale-[1.02]"
          : "bg-white"
        }`}
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className={`mb-6 ${featured ? "text-green-100" : "text-gray-600"}`}>
          {desc}
        </p>

        <div className="mb-6">
          <span className="text-4xl font-bold">
            ₹{price}
          </span>
          <span className={`ml-1 text-sm ${featured ? "text-green-100" : "text-gray-500"}`}>
            /{billingPeriod === "monthly" ? "month" : "year"}
          </span>
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((f: string, i: number) => (
            <li key={i} className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${featured ? "bg-white" : "bg-[#16A34A]"}`} />
              <span className={`${featured ? "text-green-50" : "text-gray-700"}`}>
                {f}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        className={`w-full py-3 rounded-lg font-semibold transition
          ${featured
            ? "bg-white text-[#16A34A] hover:bg-green-50"
            : "bg-[#16A34A] text-white hover:bg-[#15803D]"
          }`}
      >
        {button}
      </button>
    </div>
  )
}
