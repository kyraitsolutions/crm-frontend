import { motion } from "framer-motion";
import { XCircle, AlertTriangle, Clock, FileQuestion } from "lucide-react";

const problems = [
    {
        icon: FileQuestion,
        title: "Data Entry, Not Insights",
        description: "Traditional CRMs are glorified databases. You spend hours logging data instead of acting on it.",
    },
    {
        icon: Clock,
        title: "Slow Lead Follow-Up",
        description: "By the time you manually qualify a lead, they've already moved on to your competitor.",
    },
    {
        icon: AlertTriangle,
        title: "No Context, No Action",
        description: "Your sales team opens a lead record and sees... a phone number. Where's the intent? The budget? The timeline?",
    },
    {
        icon: XCircle,
        title: "Lost in Spreadsheets",
        description: "Marketing captures leads in one tool, sales uses another. Leads fall through the cracks daily.",
    },
];

const Problem = () => {
    return (
        <section className="pb-20 pt-10 bg-background">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <span className="inline-block px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
                            The Problem
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Your CRM Is <span className="text-primary">Quietly Killing</span> Your Deals
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Traditional CRMs were built to store data—not to understand your customers or help you sell faster.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {problems.map((problem, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex gap-4 p-6 bg-card rounded-xl hover:shadow-lg duration-300 border hover:border-destructive/20 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                                    <problem.icon className="w-5 h-5 text-destructive" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">{problem.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{problem.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-center text-muted-foreground mt-8 text-lg"
                    >
                        Sound familiar? There's a better way.
                    </motion.p>
                </div>
            </div>
        </section>
    );
};

export default Problem;
