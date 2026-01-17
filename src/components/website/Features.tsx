import { motion } from "framer-motion";
import {
    Workflow,
    Brain,
    Kanban,
    Users,
    Bell,
    DollarSign,
    Building2,
    Shield
} from "lucide-react";

const features = [
    {
        icon: Workflow,
        title: "No-Code Chatbot Builder",
        description: "Create conversation flows visually. Drag, drop, and deploy—no developers needed. Build qualifying questions that feel natural to your visitors.",
        highlight: "Visual flow editor",
    },
    {
        icon: Brain,
        title: "AI Lead Summaries",
        description: "Every conversation automatically analyzed. Get structured insights on intent, budget, timeline, and the best next action to take.",
        highlight: "On-demand AI",
    },
    {
        icon: Kanban,
        title: "Pipeline & Timeline View",
        description: "Visual pipeline shows every lead's status. Timeline view tracks every interaction. Never lose context on where a deal stands.",
        highlight: "Full visibility",
    },
    {
        icon: Building2,
        title: "Multi-Account Support",
        description: "Agencies and enterprises can manage multiple brands from one dashboard. Keep data separate, insights unified.",
        highlight: "Scale ready",
    },
    {
        icon: Users,
        title: "Team Access & Roles",
        description: "Assign leads to team members. Set permissions by role. Everyone sees what they need—nothing more, nothing less.",
        highlight: "Collaboration",
    },
    {
        icon: Bell,
        title: "Smart Notifications",
        description: "Email alerts for high-value leads. Slack integration coming soon. Never miss a hot prospect again.",
        highlight: "Real-time alerts",
    },
    {
        icon: DollarSign,
        title: "Cost-Controlled AI",
        description: "AI summaries run on-demand, not automatically. You control when AI is used—and how much you spend.",
        highlight: "Predictable costs",
    },
    {
        icon: Shield,
        title: "Enterprise-Grade Backend",
        description: "Built on Node.js with modern AI infrastructure. Handles thousands of conversations without breaking a sweat.",
        highlight: "Scalable",
    },
];

const FeaturesSection = () => {
    return (
        <section id="features" className="py-20 section-gradient">
            <div className="max-w-[1480px]  mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        Features
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Everything You Need to <span className="text-primary">Convert More Leads</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Powerful features designed for speed, clarity, and results. No bloat—just what works.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                        >

                            <div className="flex items-start justify-between mb-4">

                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                    {feature.highlight}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;