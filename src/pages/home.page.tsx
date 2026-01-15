import type React from "react";
import { useState, useEffect, useRef } from "react";
import SmartSimpleBrilliant from "../components/smart-simple-brilliant";
import EffortlessIntegration from "../components/effortless-integration-updated";
import DocumentationSection from "../components/documentation-section";
import TestimonialsSection from "../components/testimonials-section";
import FAQSection from "../components/faq-section";
import CTASection from "../components/cta-section";
import FooterSection from "../components/footer-section";
import { ArrowRight } from "lucide-react";
// import DashboardImage2 from "../assets/image2.png";
import DashboardImage3 from "../assets/image3.png";
import KyraChatbotPreview from "../components/your-work-in-sync";
import Header from "@/components/website/Header";
import ContactForm from "@/components/website/ContactForm";
import { CountUp } from "@/components/website/Number";
import PricingSection from "@/components/website/pricing-section";
// import DashboardImage4 from "../assets/image4.png";
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full border border-gray-200">
      <div className="w-3 h-3 flex items-center justify-center text-gray-600">
        {icon}
      </div>
      <span className="text-gray-700 text-xs font-medium">
        {text}
      </span>
    </div>
  );
}

export function HomePage() {
  // const [activeCard, setActiveCard] = useState(0);
  const [activeCard, setActiveCard] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // console.log(activeCard);
  useEffect(() => {
    // Prevent double interval in Strict Mode
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100));
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (progress >= 100) {
      setActiveCard((prev) => (prev + 1) % 3);
      setProgress(0);
    }
  }, [progress]);
  // const handleCardClick = (index: number) => {
  //   setActiveCard(index);
  //   setProgress(0);
  // };

  return (
    <div className="w-full min-h-screen relative bg-white overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Modern Navigation */}
        <Header />

        {/* Hero Section */}
        <section className="w-full bg-white py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Award Badge */}
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full mb-8">
                <span className="text-purple-600">🏆</span>
                <span className="text-sm font-medium text-purple-700">CTX Growth Champion Year 2025</span>
              </div> */}

              {/* Main Heading - Colorful */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-[#16A34A]">3X Your Revenue</span>
                <br />
                <span className="text-gray-900">with Smart Chatbots & Lead Capture</span>
              </h1>

              {/* Subheading */}
              <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Build intelligent chatbots that capture leads, qualify users, and convert conversations into revenue — all from one powerful CRM dashboard. Powered by AI ✨
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => {
                    window.location.href =
                      "https://crm-backend-7lf9.onrender.com/api/auth/google";
                  }}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white cursor-pointer font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  Try Kyra for FREE <ArrowRight size={18} />
                </button>
                <button className="border-2 border-gray-300 hover:border-gray-400 cursor-pointer text-gray-700 font-semibold px-8 py-2.5 rounded-lg transition-colors">
                  Join Live Demo →
                </button>
              </div>

              <p className="text-sm text-gray-500">
                No credit card required · Setup in minutes · Built for modern teams
              </p>
            </div>
          </div>
        </section>

        <section className="w-full bg-gray-50 py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                One Platform. Real Conversations. Real Results.
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-gray-600">
                Kyra CRM helps businesses turn website visitors into qualified leads
                using smart chatbots, automated workflows, and real-time analytics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "No-Code Chatbots",
                  desc: "Design chatbot flows visually without writing any code.",
                },
                {
                  title: "Auto Lead Capture",
                  desc: "Capture name, email, phone, and intent automatically.",
                },
                {
                  title: "CRM-First Approach",
                  desc: "Every conversation instantly becomes a lead.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#16A34A]/20 p-8 hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>



        <section className="w-full bg-white py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

              {/* Content */}
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Visual Chatbot Builder
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Create intelligent chatbot flows using a simple drag-and-drop interface.
                  Perfect for sales, support, and onboarding.
                </p>

                <ul className="space-y-4 text-gray-700">
                  {[
                    "Greeting messages & follow-ups",
                    "Name, email & phone capture",
                    "Conditional logic & options",
                    "End-chat actions",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 bg-[#16A34A] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image */}
              <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                <img
                  src={DashboardImage3}
                  alt="Chatbot Builder"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>



        <section className="w-full bg-gray-50 py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                A Sales Pipeline That Makes Sense
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Track every lead from first conversation to final conversion with clear pipeline stages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Intake",
                  desc: "New leads captured via chatbot or forms",
                },
                {
                  title: "Qualified",
                  desc: "High-intent leads ready for action",
                },
                {
                  title: "Converted",
                  desc: "Successfully closed customers",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#16A34A]/20   p-8 hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>



        <section className="w-full bg-white py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Built for Teams & Agencies
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-gray-600">
                Manage multiple accounts, chatbots, and leads — all from one powerful CRM dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Multiple Workspaces",
                  desc: "Create separate workspaces for teams, departments, or clients — each with its own chatbots and leads.",
                },
                {
                  title: "Team Collaboration",
                  desc: "Allow multiple team members to manage conversations and assign leads in real time.",
                },
                {
                  title: "Role-Based Access",
                  desc: "Control what each user can view or edit with flexible permissions.",
                },
                {
                  title: "Shared Analytics",
                  desc: "Shared dashboards showing chatbot performance and conversions.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative bg-gray-50 rounded-2xl p-8 border  border-[#16A34A]/20  hover:bg-white hover:shadow-md transition"
                >
                  {/* <div className="absolute -top-2 -right-2 w-22 h-22 bg-[#16A34A]/10 rounded-full blur-3xl" /> */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>



        <DocumentationSection />

        {/* Social Proof Section */}
        <section className="w-full bg-white py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge
                icon={<span className="w-2 h-2 bg-[#16A34A] rounded-full inline-block" />}
                text="Social Proof"
              />
              <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                Confidence backed by results
              </h2>

              <p className="mt-4 text-lg text-gray-600">
                Teams trust Kyra CRM to capture more leads, move faster, and convert
                conversations into real revenue.
              </p>
            </div>

            {/* Demo Client Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl hover:bg-white hover:shadow-md transition"
                >
                  {/* Logo Placeholder */}
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                    <span className="text-[#16A34A] font-bold text-lg">
                      D{index + 1}
                    </span>
                  </div>

                  {/* Demo Client Name */}
                  <div className="text-gray-700 font-medium text-sm">
                    Demo Client {index + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Caption */}
            <p className="text-center text-sm text-gray-500 mt-12">
              Used by growing startups, agencies, and sales teams worldwide
            </p>

          </div>
        </section>

        {/* Bento Grid Section */}
        <section className="w-full bg-gray-50 py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section Header */}
            <div className="text-center mb-16">
              <Badge
                icon={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="1" y="1" width="4" height="4" stroke="currentColor" />
                    <rect x="7" y="1" width="4" height="4" stroke="currentColor" />
                    <rect x="1" y="7" width="4" height="4" stroke="currentColor" />
                    <rect x="7" y="7" width="4" height="4" stroke="currentColor" />
                  </svg>
                }
                text="Features"
              />

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">
                Built for absolute clarity and focused work
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Stay focused with tools that organize, connect, and turn information
                into confident decisions.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Card */}
              {[
                {
                  title: "Smart. Simple. Brilliant.",
                  desc: "Your data is beautifully organized so you see everything clearly without the clutter.",
                  component: <SmartSimpleBrilliant theme="light" className="scale-75" />,
                },
                {
                  title: "Your work, in sync",
                  desc: "Every update flows instantly across your team and keeps collaboration effortless.",
                  component: <KyraChatbotPreview />,
                },
                {
                  title: "Effortless integration",
                  desc: "All your favorite tools connect in one place and work together seamlessly.",
                  component: <EffortlessIntegration className="scale-90" />,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 hover:shadow-md border border-[#16A34A]/20 transition"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{item.desc}</p>

                  <div className="w-full rounded-xl  flex items-center justify-center overflow-hidden">
                    {item.component}
                  </div>
                </div>
              ))}

              {/* Numbers That Speak */}
              <div className="bg-white h-full rounded-2xl border border-[#16A34A]/20 p-8 hover:shadow-md transition">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Numbers that speak
                </h3>
                <p className="text-gray-600 mb-6">
                  Track growth with precision and turn raw data into confident decisions.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <CountUp end={3} suffix="x" />
                    <p className="text-sm text-gray-500 mt-1">Revenue Growth</p>
                  </div>
                  <div>
                    <CountUp end={92} suffix="%" />
                    <p className="text-sm text-gray-500 mt-1">Lead Qualification</p>
                  </div>
                  <div>
                    <CountUp end={28} />
                    <p className="text-sm text-gray-500 mt-1">Active Businesses</p>
                  </div>
                  <div>
                    <CountUp end={50000} suffix="+" />
                    <p className="text-sm text-gray-500 mt-1">Leads Captured</p>
                  </div>
                </div>

                {/* <div className="w-full h-[180px] rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                  <NumbersThatSpeak theme="light" className="scale-90" />
                </div> */}
              </div>

            </div>
          </div>
        </section>


        {/* Testimonials Section */}
        <div id="review" className="w-full">
          <TestimonialsSection />
        </div>

        {/* Pricing Section */}
        <PricingSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Section */}
        <CTASection />
        {/* Contact Section */}
        <ContactForm />

        {/* Footer Section */}
        <FooterSection />
      </div>
    </div>
  );
}

// FeatureCard component definition inline to fix import error
// function FeatureCard({
//   title,
//   description,
//   isActive,
//   progress,
//   onClick,
// }: {
//   title: string;
//   description: string;
//   isActive: boolean;
//   progress: number;
//   onClick: () => void;
// }) {
//   return (
//     <div
//       className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 ${isActive
//         ? "bg-white shadow-[0px_0px_0px_0.75px_#E0DEDB_inset]"
//         : "border-l-0 border-r-0 md:border border-[#E0DEDB]/80"
//         }`}
//       onClick={onClick}
//     >
//       {isActive && (
//         <div className="absolute top-0 left-0 w-full h-0.5 bg-[rgba(50,45,43,0.08)]">
//           <div
//             className="h-full bg-[#322D2B] transition-all duration-100 ease-linear"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       )}

//       <div className="self-stretch flex justify-center flex-col text-[#49423D] text-sm md:text-sm font-semibold leading-6 md:leading-6 font-sans">
//         {title}
//       </div>
//       <div className="self-stretch text-[#605A57] text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px] font-sans">
//         {description}
//       </div>
//     </div>
//   );
// }
