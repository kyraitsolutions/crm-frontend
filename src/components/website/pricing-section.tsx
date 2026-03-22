import { Check } from "lucide-react"
import { useState } from "react"

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly")

  const pricing = {
    starter: { monthly: "0", annually: "0" },
    professional: { monthly: "999", annually: "699" },
    enterprise: { monthly: "1,999", annually: "1,499" },
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
          <span className="inline-block mb-4 px-4 py-1 text-sm font-medium text-primary bg-primary/20 rounded-full">
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
            {["monthly", "annually"].map((type) => (
              <button
                key={type}
                onClick={() => setBillingPeriod(type as any)}
                className={`px-6 py-2 text-sm font-semibold rounded-full transition
                  ${billingPeriod === type
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {type === "annually" ? "Annually ( Save 30% )" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Starter */}
          <PricingCard
            title="Free Forever"
            period="Forever"
            desc="Best to get started with CRM Chatbot"
            price={pricing.starter[billingPeriod]}
            button="Start for free"
            features={[
              "1 Account",
              "3 Chatbot",
              "Basic CRM & Contacts",
              "Limited Chatbot Automation",
              "Manual Campaigns",
              "Basic Dashboard"
            ]}
            addons={
              ["Email Marketing (Pay per email)"]
            }
          />

          {/* Professional (Featured) */}
          <PricingCard
            featured
            title="Professional"
            desc="Perfect for growing teams & agencies"
            price={pricing.professional[billingPeriod]}
            period="/month"
            button="Get started"
            features={[
              "3 Account",
              "3 Chatbot per account",
              "Advanced CRM",
              "Full Chatbot Automation",
              "Campaign Scheduler",
              "Team Access",
              "Analytics Dashboard",
              "AI Lead Summary"
            ]}
            addons={
              ["Email Marketing (Pay per email)"]
            }
          />

          {/* Enterprise */}
          <PricingCard
            title="Enterprise"
            desc="Built for brands & high-volume businesses"
            price={pricing.enterprise[billingPeriod]}
            period="/month"
            button="Contact sales"
            features={[
              "Unlimited Account",
              "3 Chatbot per account",
              "Advanced CRM",
              "Campaign Scheduler",
              "Team Access",
              "Analytics Dashboard",
              "Unlimited Automation",
              "Monthly Auto Reports",
              "Revenue & Data Reports via Email",
              "Priority Support",
              "Dedicated Account Manager",
              "AI Lead Summary",
              "AI Summary Reports"
            ]}
            addons={
              [
                "Email Marketing (Pay per email)",
              ]
            }
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
  button,
  features,
  featured = false,
  addons,
}: any) {
  return (
    <div
      className={`rounded-[10px] p-8 flex flex-col border border-gray-300 justify-between shadow-sm transition
        ${featured
          ? "bg-white scale-[1.02]"
          : "bg-white"
        }`}
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className={`mb-6 text-gray-600`}>
          {desc}
        </p>

        <div className="mb-6">
          <span className="text-4xl font-bold">
            ₹{price}
          </span>
          <span className={`ml-1 text-sm text-gray-500`}>
            /month
            {/* {billingPeriod === "monthly" ? "month" : "year"} */}
          </span>
        </div>

        <button
          className={`w-full py-3 mb-8 rounded-[10px] font-semibold transition
          ${featured
              ? "bg-primary text-white hover:bg-[#15803D] cursor-pointer"
              : "bg-white border-2 border-gray-600 text-gray-600 hover:shadow-md cursor-pointer"
            }`}
        >
          {button}
        </button>

        <ul className="space-y-3 ">
          {features.map((f: string, i: number) => (
            <li key={i} className="flex items-center gap-3">
              <Check className={`w-4 h-4 text-primary`} />
              {/* <span className={`w-2 h-2 rounded-full ${featured ? "bg-white" : "bg-[#16A34A]"}`} /> */}
              <span className="text-gray-700">
                {f}
              </span>
            </li>
          ))}
        </ul>
        <div>
          <p className="font-medium mt-4 mb-2">Paid Add-ons</p>
          <ul className="space-y-3 mb-8 text-gray-600">
            {addons?.map((addon: string) => (
              <li key={addon} className="flex items-center gap-3">
                <Check className={`w-4 h-4 text-primary`} />
                <span className="text-gray-700">{addon}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>


    </div>
  )
}
