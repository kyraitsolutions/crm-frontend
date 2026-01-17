import { LeadService } from "@/services/lead.service";
import { CheckCircle, Clock, Flame, IndianRupee, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";


interface AILeadSummaryType {
    summary: string;
    score?: number;
    keyPoints?: string[];
    suggestions?: string[];
    [key: string]: any; // for any additional dynamic fields from backend
}

const AILeadSummary = (leadId: string) => {
    const { accountId } = useParams();
    const leadService = new LeadService();
    const [aiSummary, setAiSummary] = useState<AILeadSummaryType | null>(null);
    const [loading, setLoading] = useState(false)

    // console.log(leadId);

    const generateLeadSummary = async (leadId: string) => {
        try {
            setLoading(true)
            console.log("Call");
            const res = await leadService.getLeadSummary(String(accountId), leadId)
            console.log(res.data);
            setAiSummary(res.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }

    };


    // if (!aiSummary) return <div>Loading...</div>;


    // useEffect(() => {
    //     generateLeadSummary(leadId)
    // }, [])

    return (
        <>
            {aiSummary ? <div className="mt-4 rounded-2xl border bg-white p-4 space-y-3">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <span className="text-lg">🤖</span>
                    <h3 className="font-semibold text-gray-800">
                        AI Lead Summary
                    </h3>
                </div>

                {/* Summary */}
                <p className="text-sm text-gray-600">
                    {aiSummary?.summary}
                </p>

                {/* Key Stats */}
                <div className="flex flex-wrap gap-3 text-sm">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-600">
                        <Flame size={14} /> {aiSummary?.lead_temperature}
                    </span>

                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-600">
                        <IndianRupee size={14} /> {aiSummary?.budget}
                    </span>

                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                        <Clock size={14} /> {aiSummary?.timeline}
                    </span>
                </div>

                {/* Requirements */}
                {aiSummary?.key_requirements.length > 0 && <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                        Key Requirements
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {aiSummary?.key_requirements?.map((req: string, idx: string) => (
                            <span
                                key={idx}
                                className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700"
                            >
                                {req}
                            </span>
                        ))}
                    </div>
                </div>}

                {/* Next Action */}
                {aiSummary?.next_action && <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                        📌 {aiSummary?.next_action}
                    </p>
                    <button className="flex items-center gap-1 text-sm text-green-600 hover:underline">
                        <CheckCircle size={14} />
                        Done
                    </button>
                </div>}
                <button onClick={() => generateLeadSummary(leadId)} className="bg-green-200 cursor-pointer flex items-center  gap-1 px-4 py-1 text-sm rounded-full text-dark">
                    <RefreshCw size={16} className={`${loading ? "animate-spin" : ""} `} /> <span className={`${loading ? "animate-pulse" : ""}`}>Regenerate AI Summary</span></button>

            </div>

                :
                <div>
                    <button onClick={() => generateLeadSummary(leadId)} className="bg-green-200 cursor-pointer flex items-center mt-4 gap-1 px-4 py-1 text-sm rounded-full text-dark">
                        {!loading ?
                            <span className="flex gap-1 items-center ">
                                <Sparkles size={18} />
                                Click to generate AI Summary

                            </span>
                            :
                            <span className="flex gap-1 items-center animate-pulse "> <Sparkles size={18} className="" /> Generating lead summary...</span>}
                    </button>
                </div>
            }
        </>

    );
}

export default AILeadSummary