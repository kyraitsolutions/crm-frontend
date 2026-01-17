import { motion } from "framer-motion";
import { MessageCircle, Filter, FileText, Trophy } from "lucide-react";

const steps = [
    {
        icon: MessageCircle,
        number: "01",
        title: "Capture",
        subtitle: "Deploy in Minutes",
        description: "Add the AI chatbot to your website or landing page with a simple embed code. It starts engaging visitors immediately with natural, conversational questions.",
    },
    {
        icon: Filter,
        number: "02",
        title: "Qualify",
        subtitle: "Smart Questions",
        description: "The chatbot uses your custom flow to ask the right questions about budget, timeline, and needs. Visitors answer naturally—no boring forms.",
    },
    {
        icon: FileText,
        number: "03",
        title: "Summarize",
        subtitle: "AI Intelligence",
        description: "Our AI analyzes every conversation and generates structured summaries with intent score, key requirements, and recommended next actions.",
    },
    {
        icon: Trophy,
        number: "04",
        title: "Convert",
        subtitle: "Close Faster",
        description: "Your team receives pre-qualified leads with full context. No more research—just pick up the phone and close the deal.",
    },
];

const HowItWork = () => {
    return (
        <section id="how-it-works" className="py-20 bg-background">
            <div className="max-w-[1480PX] mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        How It Works
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        From Visitor to Qualified Lead in 4 Steps
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Simple setup, powerful results. See how LeadFlow AI transforms your lead generation process.
                    </p>
                </motion.div>

                <div className="w-full">
                    <div className="relative">
                        {/* Connection line */}
                        <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    className="relative"
                                >
                                    {/* Step card */}
                                    <div className="bg-card rounded-xl p-6 border border-border h-full hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                                        {/* Number badge */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <step.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <span className="text-4xl font-bold text-muted/30">{step.number}</span>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                                            <p className="text-sm font-medium text-primary">{step.subtitle}</p>
                                            <p className="text-muted-foreground text-sm leading-relaxed pt-2">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWork;
