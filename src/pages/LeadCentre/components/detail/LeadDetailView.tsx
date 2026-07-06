import AILeadSummary from "@/components/common/AILeadSummary";
import OverviewTab from "./tabs/OverviewTab";
import TimelineTab from "./tabs/TimelineTab";
import LeadHeader from "../list/LeadHeader";
import Sidebar from "./Sidebar";
import DetailTabs from "./DetailTabs";
import EmailEditor from "./EmailEditor";
import { useRef, useState } from "react";
import type { ILead } from "../../types/lead.type";
import type { ConfigurationItem } from "@/pages/Settings/configuration/store/configuration.store";
import type { ITeam } from "@/types/teams.type";
import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
import { timeAgo } from "@/utils/date.utils";
import { Clock3 } from "lucide-react";

interface ILeadDetailViewProps {
  lead: ILead;
  leadStages: ConfigurationItem[];
  users: ITeam[];
}

const LeadDetailView = ({ lead, users, leadStages }: ILeadDetailViewProps) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "aiSummary"
  >("overview");
  const [openEmailEditor, setOpenEmailEditor] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const scrollToSection = (section: string) => {
    const container = scrollContainerRef.current;
    const target = sectionRefs.current[section];

    if (!container || !target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    container.scrollTo({
      top: targetRect.top - containerRect.top + container.scrollTop,
      behavior: "smooth",
    });
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#f4f5f8]">
      <LeadHeader lead={lead} onClick={() => setOpenEmailEditor(!openEmailEditor)} />

      <div className="flex overflow-hidden flex-1">
        <Sidebar
          onTabClick={scrollToSection}
          counts={{
            notes: lead.notes?.length ?? 0,
            attachments: lead.attachments?.length ?? 0,
            emails: lead.emails?.length ?? 0,
            campaigns: 2,
          }}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white px-5 py-2 border-b">
            <div className="flex justify-between items-center">
              <DetailTabs activeTab={activeTab} onChange={setActiveTab} />

              <div className="flex items-center gap-2 text-[#64748b] text-sm">
                <ButtonWithTitle
                  // title={formatDate(lead.updatedAt)}
                  position="bottom"
                  className="flex items-center gap-1"
                >
                  <Clock3 size={16} />
                  Last Update : {timeAgo(lead?.updatedAt || "")}
                </ButtonWithTitle>
              </div>
            </div>
          </div>

          {renderTab()}
        </div>
      </div>

      <EmailEditor
        lead={lead}
        isOpen={openEmailEditor}
        onClose={() => setOpenEmailEditor(false)}
      />
    </div>
  );

  function renderTab() {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            lead={lead}
            users={users}
            leadStages={leadStages}
            onCompose={() => setOpenEmailEditor(true)}
            scrollContainerRef={scrollContainerRef}
            sectionRefs={sectionRefs}
          />
        );

      case "timeline":
        return <TimelineTab lead={lead} />;

      case "aiSummary":
        return <AILeadSummary leadId={String(lead.id)} />;

      default:
        return null;
    }
  }
};

export default LeadDetailView;

// import { useRef, useState } from "react";
// import { Clock3 } from "lucide-react";

// import type { ILead } from "../../types/lead.type";
// import type { ITeam } from "@/types/teams.type";
// import type { ConfigurationItem } from "@/pages/Settings/configuration/store/configuration.store";

// import { timeAgo } from "@/utils/date.utils";
// import { formatDate } from "@/utils/date-utils";

// import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
// import AILeadSummary from "@/components/common/AILeadSummary";

// import Sidebar from "./Sidebar";
// import Overview from "./Overview";
// import DetailCard from "./DetailCard";
// import Notes from "./Notes";
// import Emails from "./Emails";
// import Attachment from "./Attachment";
// import Timeline from "./tabs/TimelineTab";
// import EmailEditor from "./EmailEditor";
// import LeadHeader from "../list/LeadHeader";
// import DetailTabs from "./DetailTabs";

// interface LeadDetailViewProps {
//   lead: ILead;
//   leadStages: ConfigurationItem[];
//   users: ITeam[];
// }

// const LeadDetailView = ({ lead, leadStages, users }: LeadDetailViewProps) => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [openEmailEditor, setOpenEmailEditor] = useState(false);

//   const scrollContainerRef = useRef<HTMLDivElement | null>(null);

//   const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

//   const scrollToSection = (section: string) => {
//     const container = scrollContainerRef.current;
//     const target = sectionRefs.current[section];

//     if (!container || !target) return;

//     const containerRect = container.getBoundingClientRect();
//     const targetRect = target.getBoundingClientRect();

//     container.scrollTo({
//       top: targetRect.top - containerRect.top + container.scrollTop,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <div className="h-[calc(100vh-64px)] bg-[#f4f5f8] flex flex-col">
//       <LeadHeader lead={lead} onClick={() => setOpenEmailEditor(true)} />

//       <div className="flex overflow-hidden">
//         <Sidebar
//           onTabClick={scrollToSection}
//           counts={{
//             notes: lead.notes?.length ?? 0,
//             attachments: lead.attachments?.length ?? 0,
//             emails: lead.emails?.length ?? 0,
//             campaigns: 2,
//           }}
//         />

//         <div className="flex-1 flex flex-col overflow-hidden">
//           <DetailTabs activeTab={activeTab as any} onChange={setActiveTab} />

//           {activeTab === "overview" && (
//             <div
//               ref={scrollContainerRef}
//               className="flex-1 overflow-y-auto p-5 space-y-5"
//             >
//               <div ref={(el) => (sectionRefs.current.overview = el)}>
//                 <Overview lead={lead} leadStages={leadStages} users={users} />
//               </div>

//               <div ref={(el) => (sectionRefs.current.details = el)}>
//                 <DetailCard lead={lead} />
//               </div>

//               <div ref={(el) => (sectionRefs.current.notes = el)}>
//                 <Notes lead={lead} />
//               </div>

//               <div ref={(el) => (sectionRefs.current.emails = el)}>
//                 <Emails
//                   lead={lead}
//                   onCompose={() => setOpenEmailEditor(true)}
//                 />
//               </div>

//               <div ref={(el) => (sectionRefs.current.attachments = el)}>
//                 <Attachment />
//               </div>
//             </div>
//           )}

//           {activeTab === "timeline" && (
//             <div className="flex-1 overflow-y-auto p-5">
//               <Timeline />
//             </div>
//           )}

//           {activeTab === "aiSummary" && (
//             <div className="flex-1 overflow-y-auto p-5">
//               <AILeadSummary leadId={String(lead.id)} />
//             </div>
//           )}
//         </div>
//       </div>

//       <EmailEditor
//         lead={lead}
//         isOpen={openEmailEditor}
//         onClose={() => setOpenEmailEditor(false)}
//       />
//     </div>
//   );
// };

// export default LeadDetailView;
