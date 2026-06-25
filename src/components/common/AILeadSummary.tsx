// import { LeadService } from "@/services/lead.service";
import { RefreshCw, Sparkles, Mail, Phone, Target } from "lucide-react";
import { useState } from "react";
// import { useParams } from "react-router-dom";

interface AILeadSummaryProps {
    leadId: string;
}

const formatLabel = (key: string) => {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .replace(/^./, (c) => c.toUpperCase())
        .trim();
};

const priorityColor = (priority?: string) => {
    const p = (priority || "").toLowerCase();
    if (p.includes("high")) return { bg: "bg-red-50", text: "text-red-600" };
    if (p.includes("medium")) return { bg: "bg-amber-50", text: "text-amber-600" };
    if (p.includes("low")) return { bg: "bg-green-50", text: "text-green-600" };
    return { bg: "bg-gray-100", text: "text-gray-600" };
};

const AILeadSummary = ({ leadId }: AILeadSummaryProps) => {
    // const { accountId } = useParams();
    // const leadService = new LeadService();
    console.log(leadId)
    const [aiSummary,
        //  setAiSummary
    ] = useState<Record<string, any> | null>(
        {
            assessment: {
                priority: "Medium-Low",
                reasoning:
                    "The lead expressed clear intent, but no email or mobile/contact details were provided, making immediate automated follow-up impossible.",
                recommendedAction:
                    "Check external webhook logs or associated account records for missing contact information to facilitate outreach.",
            },

            contactInformation: {
                emailProvided: false,
                phoneProvided: false,
                status: "Missing Contact Data",
            },

            leadDetails: {
                intent: "Interested in your service",
                source: "webhook",
                stage: "new",
                status: "active",
                assignedTo: "6a289831f6e82207106298a8",
            },

            profile: {
                name: "Abhijeet Doe",
                location: "Delhi",
                company: null,
                title: null,
            },

            technicalMeta: {
                browser: "Chrome 149 (Windows)",
                ipAddress: "::1 (Localhost)",
                referringUrl: "https://www.google.com",
            },

            message: "Lead summary fetched successfully",
            status: 200,
        },
    );
    const [loading,
        // setLoading
    ] = useState(false);

    // const generateLeadSummary = async (leadId: string) => {
    //     console.log(leadId)
    //     try {
    //         setLoading(true);
    //         const res = await leadService.getLeadSummary(String(accountId), leadId);
    //         const doc = res?.data?.data?.leadSummary ?? res?.data?.doc ?? res?.data;
    //         setAiSummary(doc ?? null);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    if (!aiSummary) {
        return (
            <div>
                <button
                    // onClick={() => generateLeadSummary(leadId)}
                    className="bg-primary/10 hover:bg-primary/20 cursor-pointer flex items-center mt-4 gap-2 px-4 py-2 text-sm rounded-xl text-primary transition-colors"
                >
                    {!loading ? (
                        <span className="flex gap-2 items-center">
                            <Sparkles size={16} />
                            Generate AI summary
                        </span>
                    ) : (
                        <span className="flex gap-2 items-center animate-pulse">
                            <Sparkles size={16} /> Generating lead summary...
                        </span>
                    )}
                </button>
            </div>
        );
    }

    const assessment = aiSummary.assessment ?? {};
    const contactInfo = aiSummary.contactInformation ?? {};
    // const leadDetails = aiSummary.leadDetails ?? {};
    // const profile = aiSummary.profile ?? {};

    const summaryText =
        aiSummary.summary ??
        assessment.reasoning ??
        "No summary available for this lead.";

    const priority = assessment.priority;
    const priorityStyle = priorityColor(priority);

    // Build small stat chips from leadDetails (excluding ids/long values)
    // const statChips = 
    // Object.entries(leadDetails)
    //     .filter(([key, val]) => (typeof val === "string" || typeof val === "number"))
    //     .filter(([key]) => !["assignedTo", "id", "_id"].includes(key))
    //     .slice(0, 3);

    // Contact flags
    const contactFlags = Object.entries(contactInfo)
        .filter(([key]) => key.toLowerCase().includes("provided"));

    return (
        <div className="rounded-xl bg-white p-5 max-w-md space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <Sparkles size={16} className="text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-800 text-sm">AI lead summary</h3>
                </div>
                {priority && (
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
                        {formatLabel(priority)} priority
                    </span>
                )}
            </div>

            {/* Summary text */}
            <p className="text-sm text-gray-600 leading-relaxed">
                {summaryText}
            </p>

            {/* Stat chips */}
            {/* {statChips.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {statChips.map(([key, val]) => (
                        <div key={key} className="bg-gray-50 rounded-xl px-3 py-2">
                            <p className="text-[11px] text-gray-400 mb-0.5">{formatLabel(key)}</p>
                            <p className="text-[13px] font-medium text-gray-800 truncate">{String(val)}</p>
                        </div>
                    ))}
                </div>
            )} */}

            {/* Contact info badges */}
            {contactFlags.length > 0 && (
                <div className="border-t pt-3 space-y-2">
                    <p className="text-xs font-medium text-gray-500">Contact information</p>
                    <div className="flex gap-2 flex-wrap">
                        {contactFlags.map(([key, val]) => {
                            const isEmail = key.toLowerCase().includes("email");
                            const ok = Boolean(val);
                            return (
                                <span
                                    key={key}
                                    className={`text-xs px-2.5 py-1 rounded-xl flex items-center gap-1 ${ok ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                        }`}
                                >
                                    {isEmail ? <Mail size={13} /> : <Phone size={13} />}
                                    {isEmail ? "Email" : "Phone"} {ok ? "provided" : "missing"}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Key requirements (if present) */}
            {Array.isArray(aiSummary.key_requirements) && aiSummary.key_requirements.length > 0 && (
                <div className="border-t pt-3">
                    <p className="text-xs font-medium text-gray-500 mb-2">Key requirements</p>
                    <div className="flex flex-wrap gap-2">
                        {aiSummary.key_requirements.map((req: string, idx: number) => (
                            <span key={idx} className="text-xs px-2.5 py-1 rounded-xl bg-gray-100 text-gray-700">
                                {req}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommended action / next action */}
            {(assessment.recommendedAction || aiSummary.next_action) && (
                <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-600 mb-1 flex items-center gap-1">
                        <Target size={13} /> Recommended action
                    </p>
                    <p className="text-[13px] text-blue-700 leading-relaxed">
                        {assessment.recommendedAction || aiSummary.next_action}
                    </p>
                </div>
            )}

            {/* Regenerate button */}
            <button
                // onClick={() => generateLeadSummary(leadId)}
                className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 cursor-pointer px-4 py-2 text-sm rounded-xl text-gray-700 transition-colors"
            >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                <span className={loading ? "animate-pulse" : ""}>Regenerate AI summary</span>
            </button>
        </div>
    );
};

export default AILeadSummary;