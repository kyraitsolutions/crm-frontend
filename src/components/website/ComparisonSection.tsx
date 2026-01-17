import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

const features = [
    { feature: "AI-Powered Lead Qualification", kyra: true, hubspot: "partial", salesforce: "partial", zoho: false },
    { feature: "No-Code Chatbot Builder", kyra: true, hubspot: false, salesforce: false, zoho: false },
    { feature: "AI Lead Summaries", kyra: true, hubspot: false, salesforce: false, zoho: false },
    { feature: "Real-Time Conversation Analytics", kyra: true, hubspot: true, salesforce: true, zoho: "partial" },
    { feature: "5-Minute Setup", kyra: true, hubspot: false, salesforce: false, zoho: false },
    { feature: "On-Demand AI (Cost Control)", kyra: true, hubspot: false, salesforce: false, zoho: false },
    { feature: "Multi-Account Support", kyra: true, hubspot: true, salesforce: true, zoho: true },
    { feature: "Team Collaboration", kyra: true, hubspot: true, salesforce: true, zoho: true },
    { feature: "Free Tier Available", kyra: true, hubspot: true, salesforce: false, zoho: true },
    { feature: "Transparent Pricing", kyra: true, hubspot: false, salesforce: false, zoho: "partial" },
];

const renderStatus = (status: boolean | string) => {
    if (status === true) {
        return <Check className="w-5 h-5 text-primary" />;
    }
    if (status === "partial") {
        return <Minus className="w-5 h-5 text-amber-500" />;
    }
    return <X className="w-5 h-5 text-muted-foreground/40" />;
};

const ComparisonSection = () => {
    return (
        <section className="py-20 bg-muted/30 w-full">
            <div className="max-w-[1480px] mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        Comparison
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        How We Stack Up Against the Competition
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        See why teams are switching from traditional CRMs to LeadFlow AI.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full overflow-hidden"
                >
                    <div className="bg-card w-full border border-border overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left p-4 font-semibold text-foreground">Feature</th>
                                    <th className="p-4 text-center">
                                        {/* <div className="inline-flex flex-col items-center"> */}
                                        <span className="font-bold text-primary text-lg">Kyra </span>
                                        {/* </div> */}
                                    </th>
                                    <th className="p-4 text-center">
                                        <span className="font-semibold text-muted-foreground">HubSpot</span>
                                    </th>
                                    <th className="p-4 text-center">
                                        <span className="font-semibold text-muted-foreground">Salesforce</span>
                                    </th>
                                    <th className="p-4 text-center">
                                        <span className="font-semibold text-muted-foreground">Zoho</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map((row, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`border-b border-border last:border-0 ${index % 2 === 0 ? "bg-muted/20" : ""}`}
                                    >
                                        <td className="p-4 text-sm text-foreground font-medium">{row.feature}</td>
                                        <td className="p-4 text-center bg-primary/5">
                                            <div className="flex justify-center">{renderStatus(row.kyra)}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center">{renderStatus(row.hubspot)}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center">{renderStatus(row.salesforce)}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center">{renderStatus(row.zoho)}</div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span>Full Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Minus className="w-4 h-4 text-amber-500" />
                            <span>Partial/Paid Add-on</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <X className="w-4 h-4 text-muted-foreground/40" />
                            <span>Not Available</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ComparisonSection;
