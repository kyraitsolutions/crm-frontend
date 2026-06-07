import { useEffect, useState } from "react";
import { Clock3, } from "lucide-react";
import Notes from "./Notes";
import Overview from "./Overview";
import DetailCard from "./DetailCard";
import Sidebar from "./Sidebar";
import LeadHeader from "./LeadHeader";
import Attachment from "./Attachment";
import EmailEditor from "./EmailEditor";
import { useParams } from "react-router-dom";
import { LeadService } from "@/services/lead.service";
import { useAuthStore } from "@/stores";
import { timeAgo } from "@/utils/date.utils";
import type { ILead } from "../types/lead.type";
import AILeadSummary from "@/components/common/AILeadSummary";
import DataLoader from "@/components/Loader/data-loader";
import Timeline from "./Timeline";
import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
import { formatDate } from "@/utils/date-utils";


const LeadDetail = () => {
    const { leadId } = useParams();
    const { accountId } = useAuthStore((state) => state);
    const leadService = new LeadService();
    const [activeTab, setActiveTab] = useState("overview");
    const [openEmailEditor, setOpenEmailEditor] = useState(false);

    const [lead, setLead] = useState<ILead | null>(null);

    const getLead = async () => {
        try {
            const response = await leadService.getLead(String(accountId), leadId || "");
            console.log("Lead api response:", response)

            if (response.status === 200 || response.status === 201) {
                setLead(response.data?.doc || {});
                // leadStoreManager.setLeads(response.data?.docs || []);
                // setTotalItems(response.data?.pagination?.totalDocs);
            }
        } catch (error) {
            console.log(error);
        } finally {
            // setIsLoadingLeads(false);
        }
    };
    useEffect(() => {
        getLead();
        // calculateBasicNumber()
    }, [leadId,]);

    console.log("🚀 ~ file: LeadDetail.tsx:24 ~ LeadDetail ~ leadId:", lead)

    if (!lead) {
        return (
            <DataLoader />
        );
    }

    return (
        <div className="h-screen bg-[#f4f5f8] flex flex-col hide-scrollbar ">
            {/* Header */}
            <LeadHeader lead={lead} onClick={() => setOpenEmailEditor((prev) => !prev)} />
            {/* Sidebar */}
            <div className="flex overflow-hidden">

                {/* Side bar */}
                <Sidebar
                    counts={{
                        notes: lead?.notes?.length || 0,
                        attachments: lead?.attachments?.length || 0,
                        emails: 5,
                        campaigns: 2,
                    }}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* Tabs */}
                    <div className="bg-[#f4f5f8] px-5 py-2 border-b">
                        <div className="flex justify-between items-center">
                            <div className="bg-white border rounded-full p-1 flex w-fit shadow-sm">
                                <button
                                    onClick={() => setActiveTab("overview")}
                                    className={`px-4 py-1 rounded-full text-sm font-medium transition ${activeTab === "overview"
                                        ? "bg-primary/10 text-primary border border-primary font-semibold"
                                        : "text-[#64748b]"
                                        }`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab("timeline")}
                                    className={`px-4 py-1 rounded-full text-sm font-medium transition ${activeTab === "timeline"
                                        ? "bg-primary/10 text-primary border border-primary font-semibold"
                                        : "text-[#64748b]"
                                        }`}
                                >
                                    Timeline
                                </button>
                                <button
                                    onClick={() => setActiveTab("aiSummary")}
                                    className={`px-4 py-1 rounded-full text-sm font-medium transition ${activeTab === "aiSummary"
                                        ? "bg-primary/10 text-primary border border-primary font-semibold"
                                        : "text-[#64748b]"
                                        }`}
                                >
                                    AI Summary
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-[#64748b] text-sm">
                                <ButtonWithTitle title={formatDate(lead.updatedAt)} position="bottom" className="flex items-center gap-1">
                                    <Clock3 size={16} />
                                    Last Update : {timeAgo(lead?.updatedAt || "")}
                                </ButtonWithTitle>


                            </div>
                        </div>
                    </div>

                    {/* Scrollable Body */}
                    {activeTab === "overview" && <div className="flex-1 overflow-y-auto p-5 space-y-5 hide-scrollbar">
                        {/* Overview Card */}
                        <Overview lead={lead} />

                        {/* Details Section */}
                        <DetailCard lead={lead} />

                        {/* Notes Section */}
                        <Notes lead={lead} />

                        {/* Attachment */}
                        <Attachment />
                    </div>}
                    {activeTab === "timeline" && <div className="flex-1 overflow-y-auto p-5 space-y-5 hide-scrollbar">
                        {/* Timeline */}
                        <Timeline />
                    </div>}
                    {activeTab === "aiSummary" && <div className="flex-1 overflow-y-auto p-5 space-y-5 hide-scrollbar">
                        {/* Timeline */}
                        <AILeadSummary leadId={String(lead?.id)} />
                    </div>}
                </div>
            </div>

            <div className="">

                <EmailEditor
                    isOpen={openEmailEditor}
                    onClose={() =>
                        setOpenEmailEditor(false)
                    }
                />
            </div>

        </div>
    );
};

export default LeadDetail;