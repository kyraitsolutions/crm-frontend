import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, Brain, Zap, Target } from "lucide-react";

const solutions = [
    {
        icon: MessageSquare,
        title: "Conversational Lead Capture",
        description: "Deploy an AI chatbot on any page in minutes. It asks the right questions, at the right time, naturally.",
    },
    {
        icon: Brain,
        title: "Instant AI Qualification",
        description: "Every lead gets automatically scored on intent, budget, timeline, and fit—no manual work required.",
    },
    {
        icon: Zap,
        title: "Actionable Summaries",
        description: "Your team gets structured lead briefs with clear next steps, not raw chat logs to decode.",
    },
    {
        icon: Target,
        title: "Pipeline That Works",
        description: "Visual pipeline with timeline tracking. Know exactly where every lead stands and what's next.",
    },
];

const Solution = () => {
    return (
        <section className="py-20 section-gradient">
            <div className="max-w-[1480px] mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        The Solution
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {/* AI CRM that actually <span className="text-primary">understands</span> */}
                        Smart AI CRM That <span className="text-primary">Understands</span> Your Sales Workflow
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        LeadFlow AI doesn't just store conversations—it reads them, qualifies them, and tells you exactly what to do next.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {solutions.map((solution, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative bg-card rounded-xl p-8 border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                    <solution.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">{solution.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{solution.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Key benefits */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-16 max-w-3xl mx-auto"
                >
                    <div className="bg-card rounded-2xl p-8 border border-primary/20 shadow-glow">
                        <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
                            What You Get
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "24/7 automated lead capture",
                                "Instant AI-powered qualification",
                                "Clear, actionable next steps",
                                "Full conversation history",
                                "Team collaboration tools",
                                "Real-time notifications",
                            ].map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                    <span className="text-foreground">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Solution;
