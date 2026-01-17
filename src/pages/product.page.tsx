import FooterSection from "@/components/footer-section";
import Header from "@/components/website/Header";
import React from "react";

const ProductPage: React.FC = () => {
    return (
        <div className="w-full bg-white text-gray-900">
            <Header />
            {/* HERO SECTION */}
            <section className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                        Turn Conversations into
                        <span className="text-[#16A34A]"> Actionable Leads</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        An AI-powered CRM with a flow-based chatbot builder that captures,
                        qualifies, and summarizes leads automatically.
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-[#16A34A] text-white px-6 py-3 rounded-xl font-medium shadow">
                            Get Started
                        </button>
                        <button className="border border-gray-300 px-6 py-3 rounded-xl font-medium">
                            Book Demo
                        </button>
                    </div>
                </div>
                <div className="bg-gray-100 rounded-2xl h-[360px] flex items-center justify-center">
                    <span className="text-gray-400">Dashboard Preview</span>
                </div>
            </section>

            {/* PROBLEM SECTION */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Why Traditional Lead Management Fails</h2>
                    <p className="text-gray-600 text-lg">
                        Businesses lose high-intent leads every day due to manual follow-ups, unstructured conversations, slow response times, and scattered tools. Traditional CRMs only store data — they don’t understand conversations, qualify intent, or guide sales teams on what to do next. As a result, sales teams waste time chasing cold leads while hot opportunities slip away.
                    </p>
                </div>
            </section>

            {/* SOLUTION SECTION */}
            <section className="max-w-7xl mx-auto px-8 py-20">
                <h2 className="text-3xl font-bold text-center mb-12">
                    One Intelligent Platform Built for Modern Sales Teams.
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {["Flow-based Chatbot", "AI-Powered Lead Intelligence & Summary Engine", "Smart Pipeline"].map(
                        (item) => (
                            <div
                                key={item}
                                className="bg-white border rounded-2xl p-6 shadow-sm"
                            >
                                <h3 className="text-xl font-semibold mb-3">{item}</h3>
                                <p className="text-gray-600">
                                    Capture leads directly from conversations, automatically structure data, and remove manual entry completely. Your sales team gets clean, actionable insights instead of raw chat logs.
                                </p>
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* AI SUMMARY SECTION */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">AI Lead Summary</h2>
                        <p className="text-gray-600 mb-4">
                            Every conversation is automatically converted into a structured, decision-ready lead summary. Our AI analyzes messages, detects buying signals, extracts budgets and timelines, identifies objections, and recommends the next best action — all in seconds.
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            <li>• Clear lead intent</li>
                            <li>• Lead temperature (Hot/Warm/Cold)</li>
                            <li>• Suggested next action</li>
                        </ul>
                    </div>
                    <div className="bg-white border rounded-2xl p-6 shadow">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {`{
  summary: "Interested in website development",
  intent: "Website/Landing page",
  lead_temperature: "Warm",
  budget: "50k",
  timeline: "27 Jan 5 PM"
}`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="max-w-7xl mx-auto px-8 py-20">
                <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Capture, Qualify, and Convert Leads</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        "Visual Chatbot Flow Builder",
                        "Lead Timeline & Activity",
                        "Reusable AI Backend",
                        "Token & Cost Optimization",
                        "Multi-channel Lead Capture",
                        "CRM-ready API Architecture",
                    ].map((feature) => (
                        <div
                            key={feature}
                            className="border rounded-2xl p-6 hover:shadow transition"
                        >
                            <h3 className="font-semibold text-lg mb-2">{feature}</h3>
                            <p className="text-gray-600 text-sm">
                                Built with scalability, cost-efficiency, and automation in mind — ready to grow with your business.
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-[#16A34A] py-20 text-white">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Transform Conversations into Revenue with AI
                    </h2>
                    <p className="mb-8 text-lg opacity-90">
                        Automate lead qualification, prioritize high-intent prospects, and empower your sales team with AI-driven insights — without changing how your customers interact.
                    </p>
                    <button className="bg-white text-[#16A34A] px-8 py-3 rounded-xl font-semibold">
                        Start Free Trial
                    </button>
                </div>
            </section>

            <FooterSection />
        </div>
    );
};

export default ProductPage;
