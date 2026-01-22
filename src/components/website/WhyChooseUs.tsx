import { motion } from "framer-motion";
import { Brain, DollarSign, Zap, Shield } from "lucide-react";

const differentiators = [
    {
        icon: Brain,
        title: "AI With Purpose",
        description: "We don't sprinkle AI for marketing buzz. Every AI feature solves a real problem—qualifying leads, summarizing conversations, recommending actions. Nothing more, nothing less.",
    },
    {
        icon: DollarSign,
        title: "On-Demand AI = Predictable Costs",
        description: "AI summaries run when you request them, not on every message. You control usage. You control costs. No surprise bills from runaway AI processing.",
    },
    {
        icon: Zap,
        title: "Built for Speed",
        description: "From signup to first chatbot: 5 minutes. From lead to AI summary: seconds. We optimize for velocity because in sales, time is literally money.",
    },
    {
        icon: Shield,
        title: "Scale Without Worry",
        description: "Modern Node.js backend with enterprise-grade AI infrastructure. Handle hundreds of conversations per second. Grow from startup to enterprise on the same platform.",
    },
];

const WhyChooseUs = () => {
    return (
        <section className="py-20 bg-background">
            <div className="max-w-[1480px] mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        Why Us
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Not Another CRM. A Different Approach.
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Traditional CRMs store data. LeadFlow AI understands conversations and turns them into action.
                    </p>
                </motion.div>

                <div className="">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {differentiators.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <item.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Comparison table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-12"
                    >
                        <div className="bg-card rounded-2xl border border-border overflow-hidden">
                            <div className="grid grid-cols-3 text-center">
                                <div className="p-4 border-b border-r border-border bg-muted/30">
                                    <span className="text-sm font-medium text-muted-foreground">Feature</span>
                                </div>
                                <div className="p-4 border-b border-r border-border  bg-primary/5" >
                                    <span className="text-sm font-semibold text-primary">Kyra AI CRM</span>
                                </div>
                                <div className="p-4 border-b border-border bg-muted/30">
                                    <span className="text-sm font-medium text-muted-foreground">Traditional CRM</span>
                                </div>

                                {[
                                    ["Lead Capture", "Manual forms", "AI chatbot"],
                                    ["Qualification", "Manual scoring", "Automatic AI"],
                                    ["Lead Context", "Basic fields", "Full conversation + AI summary"],
                                    ["Next Actions", "You figure it out", "AI recommended"],
                                    ["Setup Time", "Days to weeks", "5 minutes"],
                                ].map(([feature, traditional, ours], i) => (
                                    <>
                                        <div key={`f-${i}`} className="p-4 border-b border-r border-border text-sm text-foreground">{feature}</div>
                                        <div key={`o-${i}`} className="p-4 border-b border-border text-sm font-medium text-primary bg-primary/5">{ours}</div>
                                        <div key={`t-${i}`} className="p-4 border-b border-r border-border text-sm text-muted-foreground">{traditional}</div>
                                    </>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
