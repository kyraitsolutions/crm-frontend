import { cn } from "@/lib/utils";
import {
    MessageSquare,
    Bot,
    Megaphone,
    CreditCard,
    FileText,
    Link2,
    BadgeCheck,
    ShoppingBag,
    User,
    Sparkles,
    Radio,
    Workflow,
    LayoutGrid,
    Globe,
    MousePointerClick,
    ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";


const productItems = [
    { icon: MessageSquare, title: "WhatsApp Marketing", desc: "Broadcast, Automate & Grow" },
    { icon: Megaphone, title: "AI Ads Manager", desc: "5X your leads" },
    { icon: Bot, title: "WhatsApp Chatbots", desc: "Automate conversations" },
    { icon: Sparkles, title: "AI WhatsApp Chatbot", desc: "GPT-powered chatbot" },
    { icon: CreditCard, title: "WhatsApp Payments", desc: "Collect payments in chat" },
    { icon: FileText, title: "WhatsApp Forms", desc: "Collect data via WhatsApp" },
    { icon: Link2, title: "WhatsApp Link & QR", desc: "Generate links & QR codes" },
    { icon: BadgeCheck, title: "WhatsApp Blue Tick", desc: "Get verified badge" },
    { icon: ShoppingBag, title: "Showroom Kit", desc: "Showcase products" },
    { icon: User, title: "AiKarsy", desc: "AI personal assistant" },
];

const featureItems = [
    { icon: LayoutGrid, title: "Features Overview", desc: "All features at a glance" },
    { icon: Radio, title: "WhatsApp Broadcasting", desc: "Send bulk messages" },
    { icon: Sparkles, title: "AI WhatsApp Chatbot", desc: "Smart AI conversations" },
    { icon: Megaphone, title: "Ads Manager", desc: "Manage ad campaigns" },
    { icon: Workflow, title: "Chatbot Flow Builder", desc: "Visual flow builder" },
    { icon: ShoppingBag, title: "WhatsApp Catalog", desc: "Product catalogs" },
    { icon: CreditCard, title: "Payments", desc: "In-chat payments" },
    { icon: FileText, title: "Forms", desc: "Data collection forms" },
    { icon: Globe, title: "Webviews", desc: "In-chat web pages" },
    { icon: MousePointerClick, title: "Click Tracking", desc: "Track link clicks" },
];
const Header = () => {
    return (
        <nav className="w-full border-b-2 border-gray-200 bg-white sticky top-0 z-50">
            <div className="max-w-370 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-1">
                                {/* <div>
                                    <span className=" text-primary/90! text-5xl font-bold">K</span>
                                </div> */}
                                <div className="flex flex-col">
                                    <span className="text-2xl text-primary font-bold">Kyra</span>
                                    {/* <span className="text-gray-800 text-xs whitespace-nowrap uppercase font-semibold">IT Solution</span> */}

                                </div>

                            </Link>
                        </div>
                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-6">

                            {/* <Link to="/about" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors">
                                About
                            </Link>
                            <Link to="/product" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors">
                                Product
                            </Link> */}
                            <Link to="/pricing" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors">
                                Pricing
                            </Link>
                            {/* <Link to="#review" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors">
                                Review
                            </Link> */}

                            <NavDropdown label="Product" items={productItems} />
                            <NavDropdown label="Features" items={featureItems} />

                        </div>
                    </div>
                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                window.location.href =
                                    "https://crm-backend-7lf9.onrender.com/api/auth/google";
                                // "http://localhost:3000/api/auth/google";
                            }}
                            className="text-gray-700 whitespace-nowrap hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-lg  max-md:text-white max-md:bg-[#16A34A]  hover:bg-gray-50 transition-colors"
                        >
                            Login →
                        </button>
                        <button
                            onClick={() => {
                                window.location.href =
                                    "https://crm-backend-7lf9.onrender.com/api/auth/google";
                            }}
                            className="bg-primary hidden md:block  whitespace-nowrap hover:bg-primary/80 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
                        >
                            Start for FREE →
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header


function NavDropdown({
    label,
    items,
}: {
    label: string;
    items: { icon: any; title: string; desc: string }[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative hidden md:block"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button className="flex items-center gap-1  hover:text-foreground transition-colors">
                {label}
                <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 bg-popover  rounded-md shadow-md p-4 grid grid-cols-1 gap-1 w-75 animate-slide-in z-50">
                    {items.map((item) => (
                        <button
                            key={item.title}
                            className="flex items-start gap-3 p-2 rounded-xl hover:bg-secondary transition-colors text-left group"
                        >
                            <div className="group-hover:bg-primary/10 transition-colors shrink-0">
                                <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-xm">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
