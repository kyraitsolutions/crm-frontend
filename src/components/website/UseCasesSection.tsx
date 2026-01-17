import { motion } from "framer-motion";
import { Users, TrendingUp, Rocket, Building2, ArrowRight } from "lucide-react";

const useCases = [
    {
        icon: Users,
        title: "Marketing Teams",
        description: "Capture leads from every campaign, landing page, and ad. See which channels bring the highest-intent prospects. Stop guessing—start knowing.",
        benefits: [
            "Unified lead capture across all channels",
            "Campaign performance by lead quality",
            "Automatic MQL scoring",
        ],
    },
    {
        icon: TrendingUp,
        title: "Sales Teams",
        description: "Get pre-qualified leads with full context. No more cold calling blind. Every lead comes with an AI brief so you can personalize your pitch.",
        benefits: [
            "Pre-call intelligence on every lead",
            "Pipeline visibility and forecasting",
            "Automated follow-up reminders",
        ],
    },
    {
        icon: Rocket,
        title: "Founders & Startups",
        description: "Validate your market faster. Capture early interest without building complex systems. Focus on building product—let AI handle lead qualification.",
        benefits: [
            "Quick setup, no technical skills needed",
            "Learn what customers actually want",
            "Scale lead capture as you grow",
        ],
    },
    {
        icon: Building2,
        title: "Agencies",
        description: "Manage lead generation for multiple clients from one platform. White-label ready with separate workspaces and team permissions.",
        benefits: [
            "Multi-client account management",
            "White-label chatbot deployment",
            "Client-specific reporting",
        ],
    },
];

const UseCasesSection = () => {
    return (
        <section id="use-cases" className="py-20 section-gradient">
            <div className="max-w-[1480px] mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        Use Cases
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Built for How You Work
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Different teams, same goal: convert more leads with less effort. See how LeadFlow AI fits your workflow.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-card rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <useCase.icon className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground mb-1">{useCase.title}</h3>
                                </div>
                            </div>

                            <p className="text-muted-foreground mb-6 leading-relaxed">{useCase.description}</p>

                            <ul className="space-y-3">
                                {useCase.benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <ArrowRight className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                                        <span className="text-sm text-foreground">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCasesSection;