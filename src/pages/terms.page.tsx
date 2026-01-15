import FooterSection from "@/components/footer-section"
import Header from "@/components/website/Header"

const TermsPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />

            {/* Content */}
            <main className="flex-1">
                <section className="max-w-7xl mx-auto px-8 py-14">
                    {/* Title */}
                    <h1 className="text-4xl font-bold mb-3">
                        Terms & Conditions
                    </h1>

                    <p className="text-sm text-muted-foreground mb-10">
                        Last updated: 27 August, 2024
                    </p>

                    {/* Intro */}
                    <div className="space-y-6 text-base leading-relaxed">
                        <p>
                            These Terms and Conditions ("Terms", "Terms and Conditions") govern your
                            relationship with our services operated by <strong>Kyra IT Solutions Private Limited</strong>
                            ("Company", "we", "us", or "our").
                        </p>

                        <p>
                            By accessing or using our Services, you agree to be bound by these Terms.
                            If you do not agree with any part of the Terms, then you may not access the Services.
                        </p>
                    </div>

                    {/* Section */}
                    <div className="mt-12 space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold mb-3">
                                1. Use of Services
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You agree to use the Services only for lawful purposes and in accordance
                                with these Terms. You must not use the Services in any way that violates
                                applicable laws or regulations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">
                                2. Intellectual Property
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                The Services and their original content, features, and functionality are
                                and will remain the exclusive property of AiSensy Communications Private Limited
                                and its licensors.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">
                                3. User Accounts
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                When you create an account with us, you must provide information that is
                                accurate, complete, and current at all times.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">
                                4. Termination
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may terminate or suspend access to our Services immediately, without
                                prior notice or liability, for any reason whatsoever.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">
                                5. Limitation of Liability
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                In no event shall AiSensy, nor its directors, employees, or partners, be
                                liable for any indirect, incidental, special, consequential, or punitive
                                damages.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">
                                6. Changes to Terms
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We reserve the right to modify or replace these Terms at any time.
                                It is your responsibility to review these Terms periodically.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">
                                7. Contact Us
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions about these Terms, please contact us at{" "}
                                <a
                                    href="mailto:support@aisensy.com"
                                    className="text-primary underline underline-offset-4"
                                >
                                    support@kyraitsolutions.com
                                </a>.
                            </p>
                        </section>
                    </div>
                </section>
            </main>

            <FooterSection />
        </div>
    )
}

export default TermsPage
