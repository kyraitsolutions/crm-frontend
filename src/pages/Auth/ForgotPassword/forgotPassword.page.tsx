import Section from '@/components/sections/Section';
import ForgotPassword from '../components/ForgotPassword'


const features = [
    {
        icon: "⚡",
        title: "Instant setup",
        desc: "Get your workspace ready in under 2 minutes.",
    },
    {
        icon: "🔒",
        title: "Enterprise-grade security",
        desc: "Your data is encrypted and never shared.",
    },
    {
        icon: "🌍",
        title: "Global reach",
        desc: "Operate across regions with multi-currency support.",
    },
];
const ForgotPasswordPage = () => {
    return (
        <Section>
            <div className="h-screen w-screen flex ">
                <aside
                    className="hidden lg:flex flex-col gap-16  w-[65%] p-10 relative overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(145deg, #3B1FA8 0%, #7C3AED 55%, #C026D3 100%)",
                        // "linear-gradient(145deg, #C026D3 0%, #7C3AED 55%, #3B1FA8 100%)",
                    }}
                >
                    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 bg-[radial-gradient(circle,#fff,transparent)]" />
                    <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full opacity-10 bg-[radial-gradient(circle,#fff,transparent)]" />

                    {/* Brand */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-16">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold text-white bg-white/50 backdrop-blur-sm">
                                ◈
                            </div>
                            <span className="text-white font-semibold text-lg tracking-tight">
                                Kyra CRM
                            </span>
                        </div>

                        <p className="text-xs font-semibold tracking-widest uppercase text-white mb-4">
                            Almost there
                        </p>
                        <h1 className="text-4xl font-bold text-white leading-snug mb-4">
                            Welcome back <br />
                            <span className="text-white">Sign in to your account</span>
                        </h1>
                        <p className="text-purple-300 text-sm leading-relaxed max-w-xs">
                            Tell us about your company so we can personalise your workspace,
                            invoices, and reports from day one.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="relative z-10 space-y-5">
                        {features.map((f) => (
                            <div key={f.title} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-white">
                                    {f.icon}
                                </div>
                                <div>
                                    <p className="text-white text-sm font-semibold">{f.title}</p>
                                    <p className="text-purple-300 text-xs mt-0.5">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="relative z-10 text-white text-xs">
                        © {new Date().getFullYear()} Kyra AI CRM · Privacy · Terms
                    </p>
                </aside>
                <div className="flex flex-1 justify-center h-full bg-white">
                    <div className="w-full p-10 flex flex-col justify-center max-w-md">

                        <ForgotPassword />

                    </div>
                </div>
            </div>
        </Section>
    )
}

export default ForgotPasswordPage