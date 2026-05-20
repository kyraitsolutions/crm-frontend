import { useState } from "react";
import {
    Clock3,
} from "lucide-react";
import Notes from "./Notes";
import Overview from "./Overview";
import DetailCard from "./DetailCard";
import Sidebar from "./Sidebar";
import LeadHeader from "./LeadHeader";
import Timeline from "./Timeline";
import Attachment from "./Attachment";
import EmailEditor from "./EmailEditor";

interface Lead {
    name: string;
    company: string;
    owner: string;
    email: string;
    phone: string;
    mobile: string;
    status: string;
    title: string;
    source: string;
    website: string;
    notes: string[];
    attachments: string[]
}

const leadData: Lead = {
    name: "Ms. Yvonne Tjepkema (Sample)",
    company: "Grayson",
    owner: "Abhijeet Singh",
    email: "yvonne-tjepkema@noemail.invalid",
    phone: "555-555-5555",
    mobile: "555-555-5555",
    status: "Pre-Qualified",
    title: "Office Assistant III",
    source: "External Referral",
    website: "http://www.feltzprintingservice.com",
    notes: ["kya hal hein", "kuch nhi"],
    attachments: ["kya hal hein", "kuch nhi", "thik hai"]
};




const LeadDetail = () => {

    const [activeTab, setActiveTab] = useState("overview");
    const [openEmailEditor, setOpenEmailEditor] = useState(false);


    return (
        <div className="h-screen bg-[#f4f5f8] flex flex-col hide-scrollbar ">
            {/* Header */}
            <LeadHeader onClick={() => setOpenEmailEditor((prev) => !prev)} />
            {/* Sidebar */}
            <div className="flex overflow-hidden">

                {/* Side bar */}
                <Sidebar
                    counts={{
                        notes: leadData.notes.length,
                        attachments: leadData.attachments.length,
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
                            </div>

                            <div className="flex items-center gap-2 text-[#64748b] text-sm">
                                <Clock3 size={16} />
                                Last Update : 56 day(s) ago
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Body */}
                    {activeTab === "overview" && <div className="flex-1 overflow-y-auto p-5 space-y-5 hide-scrollbar">
                        {/* Overview Card */}
                        <Overview />

                        {/* Details Section */}
                        <DetailCard />

                        {/* Notes Section */}
                        <Notes />

                        {/* Attachment */}
                        <Attachment />
                    </div>}
                    {activeTab === "timeline" && <div className="flex-1 overflow-y-auto p-5 space-y-5 hide-scrollbar">
                        {/* Timeline */}
                        <Timeline />
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