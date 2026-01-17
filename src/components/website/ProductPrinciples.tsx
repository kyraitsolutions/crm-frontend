import { motion } from "framer-motion";
import { Zap, Shield, DollarSign, Users, Heart, Code } from "lucide-react";

const principles = [
    {
        icon: Zap,
        title: "Speed Over Perfection",
        description: "We ship fast and iterate based on real feedback. Every feature should make you faster, not slower.",
    },
    {
        icon: Shield,
        title: "Privacy by Design",
        description: "Your data is yours. We build with security and privacy as core requirements, not afterthoughts.",
    },
    {
        icon: DollarSign,
        title: "Transparent Pricing",
        description: "No hidden fees, no surprise charges. You control AI usage, you control costs. Simple.",
    },
    {
        icon: Users,
        title: "Built for Teams",
        description: "Collaboration is native, not bolted on. From day one, Kyra is designed for teams of all sizes.",
    },
    {
        icon: Heart,
        title: "Customer-Obsessed",
        description: "We talk to customers daily. Every feature request is read, every bug report is investigated.",
    },
    {
        icon: Code,
        title: "Developer-Friendly",
        description: "Clean APIs, comprehensive docs, and integrations that just work. We're developers too.",
    },
];

const ProductPrinciples = () => {
    return (
        <section className="py-20 section-gradient">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        Our Principles
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        How We Build Products
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        These principles guide every decision we make—from product features to customer support.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {principles.map((principle, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                <principle.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{principle.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{principle.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductPrinciples;
