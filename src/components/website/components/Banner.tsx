import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'
import { motion } from "framer-motion"

const Banner = () => {
    const heroData = {
        badge: "Powered by AI Conversations",
        titleStart: "Build No-code Website",
        titleHighlight: "Chatbots",
        titleEnd: "in Minutes",
        description:
            "Build smart website chatbot with a drag-and-drop flow builder. Capture leads, qualify prospects, and support customers 24×7 — without writing a single line of code.",
        poweredBy: "Powered by AI Lead Intelligence",
        primaryCta: "Start for FREE",
        secondaryCta: "Book a Demo",
    };
    return (
        <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 md:pt-40 md:pb-24 hero-gradient overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
                        >
                            <Zap className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">{heroData.badge}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.05 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6"
                        >
                            {heroData.titleStart}{" "}
                            <span className="text-primary">{heroData.titleHighlight}</span>{" "}
                            {heroData.titleEnd}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-lg text-muted-foreground mb-6 leading-relaxed"
                        >
                            {heroData.description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="flex items-center gap-2 mb-8 text-foreground"
                        >
                            <Zap className="w-5 h-5 text-primary fill-primary" />
                            <span className="text-sm font-medium">
                                {heroData.poweredBy}
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Button size="lg" className="font-semibold">
                                {heroData.primaryCta} <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Button size="lg" variant="outline" className="font-semibold">
                                {heroData.secondaryCta}
                            </Button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="rounded-2xl overflow-hidden bg-primary/5 p-4 border border-border shadow-xl"
                    >
                        <img
                            src={"/public/website-chatbot-hero.jpg"}
                            alt="Website chatbot builder preview"
                            width={1280}
                            height={960}
                            className="w-full h-auto rounded-xl"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Banner