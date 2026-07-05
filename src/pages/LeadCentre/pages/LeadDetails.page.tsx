import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { LeadService } from "@/services/lead.service";
import { useAuthStore } from "@/stores";
import { useTeamsStore } from "@/stores/team.store";
import {
  useConfigurationStore,
  type ConfigurationItem,
} from "@/pages/Settings/configuration/store/configuration.store";

import DataLoader from "@/components/Loader/data-loader";

import { useLeadsStore } from "../store/lead.store";
import type { ITeam } from "@/types/teams.type";

import LeadDetailView from "../components/detail/LeadDetailView";
import LeadNotFound from "../components/errors/LeadNotFound";

const LeadDetailPage = () => {
  const { leadId } = useParams();

  const leadService = new LeadService();

  const { accountId } = useAuthStore();
  const { getTeams } = useTeamsStore();
  const { getConfigurationByType } = useConfigurationStore();

  const { selectedLead, setSelectedLead } = useLeadsStore();

  const [loading, setLoading] = useState(true);
  const [leadStages, setLeadStages] = useState<ConfigurationItem[]>([]);
  const [users, setUsers] = useState<ITeam[]>([]);

  const getLead = async () => {
    const response = await leadService.getLead(String(accountId), leadId!);
    return response.data.doc;
  };

  const loadPageData = async () => {
    if (!leadId || !accountId) return;

    setLoading(true);

    try {
      const [lead, stages, teamUsers] = await Promise.all([
        getLead(),
        getConfigurationByType("lead-status"),
        getTeams(),
      ]);

      setSelectedLead(lead);
      setLeadStages(stages);
      setUsers(teamUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, [leadId]);

  if (loading) {
    return <DataLoader />;
  }

  if (!selectedLead) {
    return <LeadNotFound />;
  }

  return (
    <LeadDetailView lead={selectedLead} leadStages={leadStages} users={users} />
  );
};

export default LeadDetailPage;

// import { useEffect, useRef, useState } from "react";
// import { Clock3 } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { LeadService } from "@/services/lead.service";
// import { useAuthStore } from "@/stores";
// import { timeAgo } from "@/utils/date.utils";
// // import type { ILead } from "../types/lead.type";
// import AILeadSummary from "@/components/common/AILeadSummary";
// import DataLoader from "@/components/Loader/data-loader";

// import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
// import { formatDate } from "@/utils/date-utils";

// import {
//   useConfigurationStore,
//   type ConfigurationItem,
// } from "@/pages/Settings/configuration/store/configuration.store";
// import { useTeamsStore } from "@/stores/team.store";
// import type { ITeam } from "@/types/teams.type";
// import { useLeadsStore } from "../store/lead.store";
// import LeadHeader from "../components/list/LeadHeader";
// import Sidebar from "../components/detail/Sidebar";
// import Overview from "../components/detail/Overview";
// import DetailCard from "../components/detail/DetailCard";
// import Notes from "../components/detail/Notes";
// import Emails from "../components/detail/Emails";
// import Attachment from "../components/detail/Attachment";
// import Timeline from "../components/detail/Timeline";
// import EmailEditor from "../components/detail/EmailEditor";

// const LeadDetail = () => {
//   const { leadId } = useParams();
//   const leadService = new LeadService();

//   const { accountId } = useAuthStore((state) => state);
//   const { getTeams } = useTeamsStore((state) => state);
//   const { setSelectedLead, selectedLead } = useLeadsStore((state) => state);
//   const { getConfigurationByType } = useConfigurationStore((state) => state);

//   const [activeTab, setActiveTab] = useState("overview");
//   const [openEmailEditor, setOpenEmailEditor] = useState(false);
//   const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

//   // const [lead, setLead] = useState<ILead | null>(null);
//   const [leadStages, setLeadStages] = useState<ConfigurationItem[] | []>([]);
//   const [users, setUsers] = useState<ITeam[] | []>([]);

//   const scrollContainerRef = useRef<HTMLDivElement | null>(null);

//   const [loading, setLoading] = useState(true);

//   const scrollToSection = (section: string) => {
//     const container = scrollContainerRef.current;
//     const target = sectionRefs.current[section];
//     if (container && target) {
//       const containerRect = container.getBoundingClientRect();
//       const targetRect = target.getBoundingClientRect();
//       const offset = targetRect.top - containerRect.top + container.scrollTop;

//       container.scrollTo({
//         top: offset,
//         behavior: "smooth",
//       });
//     }
//   };

//   const getLead = async () => {
//     const response = await leadService.getLead(String(accountId), leadId || "");
//     return response.data.doc;
//   };
//   const getLeadStages = async () => {
//     return await getConfigurationByType("lead-status");
//   };

//   const getUsers = async () => {
//     return await getTeams();
//   };

//   const loadPageData = async () => {
//     if (!leadId || !accountId) return;

//     setLoading(true);
//     try {
//       const [lead, leadStages, users] = await Promise.all([
//         getLead(),
//         getLeadStages(),
//         getUsers(),
//       ]);

//       // setLead(lead);
//       setSelectedLead(lead);
//       setLeadStages(leadStages);
//       setUsers(users);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!leadId) return;
//     loadPageData();
//   }, [leadId]);

//   if (loading) {
//     return <DataLoader />;
//   }

//   if (!selectedLead) {
//     return <div>Lead not found</div>;
//   }

//   return (
//     <div className="h-[calc(100vh-64px)] bg-[#f4f5f8] flex flex-col hide-scrollbar ">
//       {/* Header */}
//       <LeadHeader
//         lead={selectedLead}
//         onClick={() => setOpenEmailEditor((prev) => !prev)}
//       />
//       {/* Sidebar and Main Content */}
//       <div className="flex overflow-hidden">
//         {/* Side bar */}
//         <Sidebar
//           onTabClick={scrollToSection}
//           counts={{
//             notes: selectedLead?.notes?.length || 0,
//             attachments: selectedLead?.attachments?.length || 0,
//             emails: selectedLead?.emails?.length || 0,
//             campaigns: 2,
//           }}
//         />

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Tabs */}
//           <div className="bg-[#f4f5f8] px-5 py-2 border-b">
//             <div className="flex justify-between items-center">
//               <div className="bg-white border rounded-full p-1 flex w-fit shadow-sm">
//                 <button
//                   onClick={() => setActiveTab("overview")}
//                   className={`px-4 py-1 rounded-full text-sm font-medium transition ${
//                     activeTab === "overview"
//                       ? "bg-primary/10 text-primary border border-primary font-semibold"
//                       : "text-[#64748b]"
//                   }`}
//                 >
//                   Overview
//                 </button>
//                 {/* <button
//                   onClick={() => setActiveTab("timeline")}
//                   className={`px-4 py-1 rounded-full text-sm font-medium transition ${
//                     activeTab === "timeline"
//                       ? "bg-primary/10 text-primary border border-primary font-semibold"
//                       : "text-[#64748b]"
//                   }`}
//                 >
//                   Timeline
//                 </button> */}
//                 {/* <button
//                   onClick={() => setActiveTab("aiSummary")}
//                   className={`px-4 py-1 rounded-full text-sm font-medium transition ${
//                     activeTab === "aiSummary"
//                       ? "bg-primary/10 text-primary border border-primary font-semibold"
//                       : "text-[#64748b]"
//                   }`}
//                 >
//                   AI Summary
//                 </button> */}
//               </div>

//               <div className="flex items-center gap-2 text-[#64748b] text-sm">
//                 <ButtonWithTitle
//                   title={formatDate(selectedLead?.updatedAt)}
//                   position="bottom"
//                   className="flex items-center gap-1"
//                 >
//                   <Clock3 size={16} />
//                   Last Update : {timeAgo(selectedLead?.updatedAt || "")}
//                 </ButtonWithTitle>
//               </div>
//             </div>
//           </div>

//           {/* Scrollable Body */}
//           {activeTab === "overview" && (
//             <div
//               ref={scrollContainerRef}
//               className="flex-1 overflow-y-auto p-5 space-y-5 "
//             >
//               <div
//                 ref={(el) => {
//                   sectionRefs.current["overview"] = el;
//                 }}
//               >
//                 <Overview
//                   lead={selectedLead}
//                   leadStages={leadStages}
//                   users={users}
//                 />
//               </div>

//               <div
//                 ref={(el) => {
//                   sectionRefs.current["details"] = el;
//                 }}
//               >
//                 <DetailCard lead={selectedLead} />
//               </div>

//               <div
//                 ref={(el) => {
//                   sectionRefs.current["notes"] = el;
//                 }}
//               >
//                 <Notes lead={selectedLead} />
//               </div>

//               <div
//                 ref={(el) => {
//                   sectionRefs.current["emails"] = el;
//                 }}
//               >
//                 <Emails
//                   lead={selectedLead}
//                   onCompose={() => setOpenEmailEditor((prev) => !prev)}
//                 />
//               </div>

//               <div
//                 ref={(el) => {
//                   sectionRefs.current["attachments"] = el;
//                 }}
//               >
//                 <Attachment />
//               </div>
//             </div>
//           )}
//           {activeTab === "timeline" && (
//             <div className="flex-1 overflow-y-auto p-5 space-y-5 hide-scrollbar">
//               {/* Timeline */}
//               <Timeline />
//             </div>
//           )}

//           {activeTab === "aiSummary" && (
//             <div className="flex-1 overflow-y-auto p-5 space-y-5 hide-scrollbar">
//               {/* Timeline */}
//               <AILeadSummary leadId={String(selectedLead?.id)} />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Email Editor  */}
//       <div className="">
//         <EmailEditor
//           lead={selectedLead}
//           isOpen={openEmailEditor}
//           onClose={() => setOpenEmailEditor(false)}
//         />
//       </div>
//     </div>
//   );
// };

// export default LeadDetail;
