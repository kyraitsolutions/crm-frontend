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
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="w-full flex flex-col justify-center items-start bg-white">

      <div className="w-full flex flex-col justify-center items-center gap-4 lg:py-20 py-10">
        <div className="w-full flex justify-center text-center text-[#49423D] font-semibold font-sans text-5xl">
          <span className="hidden md:block">Frequently Asked Questions</span>
          <span className="md:hidden">{"FAQ's"}</span>
        </div>
        <div className="w-full text-[#605A57] text-center text-lg font-normal leading-7 font-sans">
          Explore your data,{" "} build your dashboard,
          <br className="hidden md:block" />
          {" "}bring your team together.
        </div>
      </div>
      <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
        <div className="w-full flex flex-col">
          {faqData.map((item, index) => {
            const isOpen = openItems.includes(index)

            return (
              <div key={index} className="w-full border-b border-[rgba(73,66,61,0.16)] overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left hover:bg-[rgba(73,66,61,0.02)] transition-colors duration-200"
                  aria-expanded={isOpen}
                >
                  <div className="flex-1 text-[#49423D] text-md font-medium leading-6 font-sans">
                    {item.question}
                  </div>
                  <div className="flex justify-center items-center">
                    <ChevronDownIcon
                      className={`w-6 h-6 text-[rgba(73,66,61,0.60)] transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"
                        }`}
                    />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="px-5 pb-[18px] text-[#605A57] text-md leading-6 font-sans">
                    {item.answer}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
