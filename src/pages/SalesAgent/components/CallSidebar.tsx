import { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    Inbox,
    Phone,
    PhoneCall,
    Users,
    Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type Section = {
    title: string;
    items: {
        url: string;
        label: string;
        icon: React.ReactNode;
        active?: boolean;
    }[];
};



const CallSidebar = () => {
    const location = useLocation();
    const path = location.pathname.split("/").at(-1);
    console.log(path)

    const sections: Section[] = [
        {
            title: "CALLS",
            items: [
                {
                    url: "",
                    label: "Inbox",
                    icon: <Inbox size={16} />,
                    active: path === "calls" ? true : false
                },
            ],
        },
        {
            title: "AGENTS",
            items: [
                {
                    url: "voice-agents",
                    label: "Voice agents",
                    icon: <Users size={16} />,
                    active: path === "voice-agents" ? true : false
                },
            ],
        },
        {
            title: "SETTINGS",
            items: [
                {
                    url: "buy-a-number",
                    label: "Buy a number",
                    icon: <Phone size={16} />,
                    active: path === "buy-a-number" ? true : false
                },
                {
                    url: "phone-numbers",
                    label: "Phone numbers",
                    icon: <Phone size={16} />,
                    active: path === "phone-numbers" ? true : false
                },
                {
                    url: "call-settings",
                    label: "Call settings",
                    icon: <Settings size={16} />,
                    active: path === "call-settings" ? true : false
                },
            ],
        },
    ];
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        CALLS: true,
        AGENTS: true,
        SETTINGS: true,
    });

    const toggleSection = (title: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <aside className="w-60 h-[calc(100vh-64px)] bg-slate-50 flex flex-col border-r border-gray-500/20">
            {/* Header */}
            <div className="border-b border-gray-500/20 px-3 py-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/30 text-primary">
                        <PhoneCall size={16} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-xs uppercase">Call Center</h2>
                        <p className="text-xs">
                            Voice Agent
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <button className="mx-3 mb-5 flex  text-xs w-[calc(100%-24px)] items-center gap-3 rounded-xl bg-primary text-white px-4 py-2 transition hover:bg-primary">
                    <LayoutDashboard size={16} />
                    Dashboard
                </button>

                {sections.map((section) => (
                    <div key={section.title} className="mb-5">
                        <button
                            onClick={() => toggleSection(section.title)}
                            className="flex w-full items-center justify-between px-3 text-xs font-semibold tracking-wider text-slate-600"
                        >
                            {section.title}

                            {openSections[section.title] ? (
                                <ChevronDown size={16} />
                            ) : (
                                <ChevronRight size={16} />
                            )}
                        </button>

                        {openSections[section.title] && (
                            <div className="mt-3 space-y-1">
                                {section.items.map((item) => (
                                    <Link
                                        to={item.url}
                                        key={item.label}
                                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${item.active
                                            ? "bg-primary/20 font-semibold"
                                            : "hover:bg-primary/10 text-gray-600 transition-all duration-300 hover:font-semibold"
                                            }`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default CallSidebar;