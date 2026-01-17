import { motion } from "framer-motion";
import { Target, Eye, Sparkles } from "lucide-react";

const MissionVision = () => {
    return (
        <section className="py-20 bg-background">
            <div className="max-w-[1480px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Mission */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-card rounded-2xl p-8 lg:p-10 border border-border hover:border-primary/30 transition-colors"
                    >
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                            <Target className="w-7 h-7 text-primary" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            To eliminate the gap between lead capture and lead understanding. We believe every conversation contains valuable insights—and AI should help you unlock them instantly.
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Make lead qualification instant, not manual",
                                "Turn chat conversations into actionable intelligence",
                                "Help sales teams focus on closing, not researching",
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Vision */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-card rounded-2xl p-8 lg:p-10 border border-border hover:border-primary/30 transition-colors"
                    >
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                            <Eye className="w-7 h-7 text-primary" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Our Vision</h2>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            A world where every business—from solo founders to enterprise teams—has access to intelligent lead management that was once only available to the biggest players.
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Democratize AI-powered sales intelligence",
                                "Build tools that adapt to how you work",
                                "Create a platform that scales with your growth",
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default MissionVision;
