import { motion } from "framer-motion";
import { Users, Heart, Zap } from "lucide-react";

const AboutHero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 hero-gradient overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                    >
                        About Kyra
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
                    >
                        We're Building the Future of{" "}
                        <span className="gradient-text">Lead Intelligence</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Kyra was born from a simple frustration: traditional CRMs store data, but they don't understand it. We're changing that with AI that actually helps you sell.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
                    >
                        {[
                            { icon: Users, value: "10,000+", label: "Teams Trust Us" },
                            { icon: Heart, value: "50M+", label: "Leads Qualified" },
                            { icon: Zap, value: "99.9%", label: "Uptime SLA" },
                        ].map((stat, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                                    <stat.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutHero;
