import { type RefObject } from "react";

import type { ConfigurationItem } from "@/pages/Settings/configuration/store/configuration.store";
import type { ITeam } from "@/types/teams.type";

import type { ILead } from "@/pages/LeadCentre/types/lead.type";
import Attachment from "../Attachment";
import DetailCard from "../DetailCard";
import Emails from "../Emails";
import Notes from "../Notes";
import Overview from "../Overview";

interface IOverviewTabProps {
  lead: ILead;
  leadStages: ConfigurationItem[];
  users: ITeam[];
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  sectionRefs: RefObject<Record<string, HTMLElement | null>>;
  onCompose: () => void;
}

const OverviewTab = ({
  lead,
  leadStages,
  users,
  scrollContainerRef,
  sectionRefs,
  onCompose,
}: IOverviewTabProps) => {
  const sections = [
    {
      key: "overview",
      component: <Overview lead={lead} leadStages={leadStages} users={users} />,
    },
    {
      key: "details",
      component: <DetailCard lead={lead} />,
    },
    {
      key: "notes",
      component: <Notes lead={lead} />,
    },
    {
      key: "emails",
      component: <Emails lead={lead} onCompose={onCompose} />,
    },
    {
      key: "attachments",
      component: <Attachment />,
    },
  ];

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto p-5 space-y-5"
    >
      {sections.map((section) => (
        <div
          key={section.key}
          ref={(el) => {
            if (sectionRefs.current) {
              sectionRefs.current[section.key] = el;
            }
          }}
        >
          {section.component}
        </div>
      ))}
    </div>
  );
};

export default OverviewTab;
