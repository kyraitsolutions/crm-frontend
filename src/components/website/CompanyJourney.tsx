import { motion } from "framer-motion";
import { Rocket, Users, Award, Globe, TrendingUp, Sparkles } from "lucide-react";

const milestones = [
    {
        year: "2022",
        icon: Rocket,
        title: "The Beginning",
        description: "Founded with a simple idea: CRMs should understand conversations, not just store them.",
    },
    {
        year: "2023",
        icon: Users,
        title: "First 1,000 Users",
        description: "Launched our beta and reached 1,000 active users within 3 months. Community-driven development begins.",
    },
    {
        year: "2023",
        icon: Award,
        title: "Product Hunt #1",
        description: "Featured as Product of the Day. 5,000+ upvotes and coverage in major tech publications.",
    },
    {
        year: "2024",
        icon: Globe,
        title: "Global Expansion",
        description: "Launched in 50+ countries with multi-language support. Enterprise tier introduced.",
    },
    {
        year: "2024",
        icon: TrendingUp,
        title: "Series A Funding",
        description: "Raised $15M to accelerate AI development and expand our team globally.",
    },
    {
        year: "2025",
        icon: Sparkles,
        title: "The Future",
        description: "Continuing to innovate with advanced AI features, deeper integrations, and enterprise solutions.",
    },
];

const CompanyJourney = () => {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        Our Journey
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        From Idea to Industry Leader
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Every milestone represents our commitment to building the best AI-powered CRM in the world.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

                        <div className="space-y-8">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative flex gap-6"
                                >
                                    {/* Timeline dot */}
                                    <div className="hidden md:flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center z-10 bg-background">
                                            <milestone.icon className="w-7 h-7 text-primary" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="md:hidden w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <milestone.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                                {milestone.year}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground mb-2">{milestone.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
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

export default CompanyJourney;
