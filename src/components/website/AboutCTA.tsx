import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MessageSquare } from "lucide-react";

const AboutCTA = () => {
    return (
        <section className="py-20 section-gradient">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="bg-foreground rounded-3xl p-8 lg:p-12 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                        </div>

                        <div className="relative text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
                                Ready to Join Our Journey?
                            </h2>
                            <p className="text-lg text-background/70 max-w-xl mx-auto mb-8">
                                Whether you want to transform your lead management or join our team, we'd love to hear from you.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                                <Button
                                    onClick={() => {
                                        window.location.href =
                                            "https://crm-backend-7lf9.onrender.com/api/auth/google";
                                    }}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Start Free Trial
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                                {/* <Button className="border-background/30 text-background hover:bg-background/10">
                                    <Users className="w-5 h-5" />
                                    We're Hiring
                                </Button> */}
                            </div>

                            <div className="flex items-center justify-center gap-2 text-background/60">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm">Have questions? Our team responds within 24 hours.</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutCTA;
