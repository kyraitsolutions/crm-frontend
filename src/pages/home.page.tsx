import type React from "react";
import { useState, useEffect, useRef } from "react";
import SmartSimpleBrilliant from "../components/smart-simple-brilliant";
import EffortlessIntegration from "../components/effortless-integration-updated";
import TestimonialsSection from "../components/testimonials-section";
import FAQSection from "../components/faq-section";
import CTASection from "../components/cta-section";
import FooterSection from "../components/footer-section";
import { ArrowRight, MessageSquare, Sparkles, TrendingUp } from "lucide-react";
// import DashboardImage2 from "../assets/image2.png";
import KyraChatbotPreview from "../components/your-work-in-sync";
import Header from "@/components/website/Header";
import ContactForm from "@/components/website/ContactForm";
import { CountUp } from "@/components/website/Number";
import PricingSection from "@/components/website/pricing-section";
// import DashboardImage4 from "../assets/image4.png";
import { motion } from "framer-motion";
import FeaturesSection from "@/components/website/Features";
import UseCasesSection from "@/components/website/UseCasesSection";
import WhyChooseUs from "@/components/website/WhyChooseUs";
import HowItWork from "@/components/website/HowItWork";
import Problem from "@/components/website/Problem";
import Solution from "@/components/website/Solutions";
import ComparisonSection from "@/components/website/ComparisonSection";
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
  // const [setActiveCard] = useState(0);
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
      // setActiveCard((prev) => (prev + 1) % 3);
      setProgress(0);
    }
  }, [progress]);
  // const handleCardClick = (index: number) => {
  //   setActiveCard(index);
  //   setProgress(0);
  // };

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden flex flex-col justify-start items-center">
      <Header />

      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Hero Section */}

        <section className="w-full bg-[linear-gradient(180deg,hsl(142_30%_97%)_0%,hsl(0_0%_100%)_100%)]">
          <div className="max-w-[1480px] mx-auto w-full py-16 sm:py-20 md:py-24 lg:py-24   overflow-hidden relative">


            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#15803D]/20 border border-border mb-8"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">AI-Powered Lead Intelligence</span>
              </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                {/* Award Badge */}
                {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full mb-8">
                <span className="text-purple-600">🏆</span>
                <span className="text-sm font-medium text-purple-700">CTX Growth Champion Year 2025</span>
              </div> */}

                {/* Main Heading - Colorful */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="text-[#16A34A]">3X Your Revenue</span>
                  <br />
                  <span className="text-gray-900"> Convert up to 30% more leads automatically with <span className="text-[#16A34A]">AI chatbots</span></span>
                </motion.div>


                {/* Subheading */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }} className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                  Build intelligent chatbots that capture leads, qualify prospects, and turn conversations into revenue — all from one powerful CRM dashboard. <br />Powered by AI ✨
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                  <button
                    onClick={() => {
                      window.location.href =
                        // "https://crm-backend-7lf9.onrender.com/api/auth/google";
                        "http://localhost:3000/api/auth/google";
                    }}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white cursor-pointer font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    Try Kyra for FREE <ArrowRight size={18} />
                  </button>
                  <button className="border-2 border-gray-300 hover:border-gray-400 cursor-pointer text-gray-700 font-semibold px-8 py-2.5 rounded-lg transition-colors">
                    Join Live Demo →
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }} className="text-sm text-gray-500">
                  No credit card required · Setup in minutes · Built for modern teams
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto mt-20"
              >
                {[
                  { value: "3x", label: "Faster Lead Qualification" },
                  { value: "30%", label: "More Conversions" },
                  { value: "5min", label: "Setup Time" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="hidden lg:block absolute top-40 left-8 xl:left-20"
            >
              <div className="bg-card rounded-xl p-4 shadow-lg border border-border animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">New Lead</div>
                    <div className="text-xs text-muted-foreground">High intent detected</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="hidden lg:block absolute bottom-100 right-8 xl:right-20"
            >
              <div className="bg-card rounded-xl p-4 shadow-lg border border-border animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">AI Summary</div>
                    <div className="text-xs text-muted-foreground">Ready for follow-up</div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="hidden lg:block absolute bottom-80 left-30 w-max xl:right-20"
            >
              <div className="bg-card rounded-xl p-4 shadow-lg border border-border animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">AI Summary</div>
                    <div className="text-xs text-muted-foreground">Ready for follow-up</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        <Problem />
        <Solution />
        <FeaturesSection />
        <UseCasesSection />
        <HowItWork />
        <WhyChooseUs />
        <ComparisonSection />

        {/* Bento Grid Section */}
        {/* <section className="w-full bg-gray-50 py-20 sm:py-24">
          <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

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

                
              </div>

            </div>
          </div>
        </section> */}

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