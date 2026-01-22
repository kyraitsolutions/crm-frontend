import FooterSection from "@/components/footer-section"
import Header from "@/components/website/Header"

const privacyPolicyContent = {
    title: "Privacy Policy",
    lastUpdated: "27 August, 2024",

    intro: [
        `This privacy notice for Kyra IT Solutions Private Limited ("Company", "we", "us", or "our"),
    describes how and why we might collect, store, use, and/or share ("process") your information
    when you use our services ("Services").`,

        `This includes when you:`,
    ],

    introPoints: [
        "Visit our website or any website of ours that links to this privacy notice",
        "Engage with us in other related ways, including any sales, marketing, or events",
    ],

    contactNote: `Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices.
  If you do not agree with our policies and practices, please do not use our Services.`,

    summaryTitle: "Summary of Key Points",

    summaryIntro: `This summary provides key points from our privacy notice, but you can find out more details
  about any of these topics by clicking the link following each key point.`,

    sections: [
        {
            question: "What personal information do we process?",
            answer:
                "When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us, the choices you make, and the products and features you use.",
        },
        {
            question: "Do we process any sensitive personal information?",
            answer: "We do not process sensitive personal information.",
        },
        {
            question: "Do we receive any information from third parties?",
            answer:
                "We may receive information from public databases, marketing partners, social media platforms, and other outside sources.",
        },
        {
            question: "How do we process your information?",
            answer:
                "We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.",
        },
        {
            question: "How do we keep your information safe?",
            answer:
                "We have organizational and technical processes and procedures in place to protect your personal information.",
        },
        {
            question: "What are your privacy rights?",
            answer:
                "Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.",
        },
        {
            question: "How can you contact us?",
            answer:
                "If you have questions or comments about this policy, you may email us at support@kyraitsolutions.com.",
        },
    ],
}

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />

            <main className="flex-1">
                <section className="max-w-[1480px] mx-auto px-8 py-14">
                    {/* Title */}
                    <h1 className="text-4xl font-bold mb-3">
                        {privacyPolicyContent.title}
                    </h1>

                    {/* <p className="text-sm text-muted-foreground mb-10">
                        Last updated: {privacyPolicyContent.lastUpdated}
                    </p> */}

                    {/* Intro */}
                    <div className="space-y-4 leading-relaxed">
                        {privacyPolicyContent.intro.map((text, index) => (
                            <p key={index}>{text}</p>
                        ))}

                        <ul className="list-disc pl-6 space-y-2">
                            {privacyPolicyContent.introPoints.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>

                        <p>{privacyPolicyContent.contactNote}</p>
                    </div>

                    {/* Summary */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold mb-3">
                            {privacyPolicyContent.summaryTitle}
                        </h2>

                        <p className="text-muted-foreground mb-8">
                            {privacyPolicyContent.summaryIntro}
                        </p>

                        <div className="space-y-6">
                            {privacyPolicyContent.sections.map((section, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold text-lg mb-1">
                                        {section.question}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {section.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <FooterSection />
        </div>
    )
}

export default PrivacyPolicyPage
