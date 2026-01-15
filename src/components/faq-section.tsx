import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What is Kyra CRM?",
    answer:
      "Kyra CRM is a smart chatbot-driven CRM platform that helps businesses turn website visitors into qualified leads through intelligent conversations, automated workflows, and real-time analytics — all from a single dashboard.",
  },
  {
    question: "How do smart chatbots work in Kyra?",
    answer:
      "Kyra’s smart chatbots engage visitors in real-time, ask the right questions, capture key details like name, email, phone, and intent, and automatically convert conversations into CRM leads.",
  },
  {
    question: "Do I need coding skills to build chatbots?",
    answer:
      "No. Kyra offers a no-code visual chatbot builder that allows you to design chatbot flows using drag-and-drop components without writing a single line of code.",
  },
  {
    question: "What information can Kyra chatbots capture?",
    answer:
      "Kyra chatbots can automatically capture visitor name, email, phone number, intent, and conversation context, ensuring every interaction becomes a structured lead in your CRM.",
  },
  {
    question: "How is Kyra different from traditional chat tools?",
    answer:
      "Unlike basic chat tools, Kyra follows a CRM-first approach where every conversation is instantly converted into a lead, tracked through pipeline stages, and analyzed for performance and conversions.",
  },
  {
    question: "What is the visual chatbot builder?",
    answer:
      "The visual chatbot builder lets you create intelligent chatbot flows with greeting messages, follow-ups, conditional logic, end-chat actions, and lead capture using a simple drag-and-drop interface.",
  },
  {
    question: "Can I track leads through different stages?",
    answer:
      "Yes. Kyra provides a clear sales pipeline where leads move through stages like Intake, Qualified, and Converted, giving full visibility from first conversation to final conversion.",
  },
  {
    question: "Is Kyra suitable for teams and agencies?",
    answer:
      "Absolutely. Kyra is built for teams and agencies, allowing you to manage multiple workspaces, chatbots, leads, and analytics from one centralized CRM dashboard.",
  },
  {
    question: "What are workspaces in Kyra?",
    answer:
      "Workspaces allow you to create separate environments for different teams, departments, or clients — each with its own chatbots, leads, analytics, and access controls.",
  },
  {
    question: "Can multiple team members collaborate in Kyra?",
    answer:
      "Yes. Kyra supports real-time team collaboration where members can manage conversations, assign leads, and work together using shared dashboards.",
  },
  {
    question: "Does Kyra support role-based access?",
    answer:
      "Yes. Kyra offers role-based access control, allowing you to assign admin, agent, or viewer permissions to ensure the right level of access for each team member.",
  },
  {
    question: "What kind of analytics does Kyra provide?",
    answer:
      "Kyra provides real-time analytics and shared dashboards that track chatbot performance, lead stages, conversions, and overall customer flow to help you make data-driven decisions.",
  },
  {
    question: "How does Kyra help improve conversions?",
    answer:
      "By automating customer conversations, capturing intent-driven leads, and tracking them through a structured pipeline, Kyra helps businesses reduce drop-offs and boost conversions.",
  },
  {
    question: "Can I get started without a credit card?",
    answer:
      "Yes. You can create your first chatbot and start using Kyra without a credit card. Setup takes only a few minutes and is designed for modern teams.",
  },
];

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    )
  }

  return (
    <section className="w-full bg-gray-50 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Everything you need to know about Kyra CRM and how it helps you
            convert conversations into revenue.
          </p>
        </div>

        {/* FAQ Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 divide-y">
          {faqData.map((item, index) => {
            const isOpen = openItems.includes(index)

            return (
              <div key={index} className="overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-medium text-gray-900">
                    {item.question}
                  </span>

                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#16A34A]" : ""
                      }`}
                  />
                </button>

                <div
                  className={`px-6 transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}