import type { ILead } from "../types/lead.type";
import { FieldRow } from "./FieldRow";

const Overview = ({ lead }: { lead: ILead | null }) => {
  console.log("Rendering Overview with lead", lead?.id);
  return (
    <div className="bg-white rounded-xl py-8">
      <div className="max-w-4xl mx-auto">
        <FieldRow
          label="Lead Owner"
          fieldKey="assignedTo"
          value={lead?.assignedTo?.firstName || "Assignee--"}
          leadId={lead?.id}
        />
        <FieldRow
          label="Lead Name"
          fieldKey="name"
          value={lead?.name || ""}
          leadId={lead?.id}
        />
        <FieldRow
          label="Email"
          fieldKey="email"
          value={lead?.email || ""}
          leadId={lead?.id}
        />
        <FieldRow
          label="Phone"
          fieldKey="phone"
          isPhone
          value={lead?.phone || ""}
          leadId={lead?.id}
        />
        {/* <FieldRow
          label="Mobile"
          fieldKey="mobile"
          value={lead?.mobile || ""}
          isPhone
          leadId={lead?.id}
        /> */}
        <FieldRow
          fieldKey="status"
          label="Lead Status"
          value={lead?.status || ""}
          leadId={lead?.id}
        />
        <FieldRow
          fieldKey="stage"
          label="Lead Stage"
          value={lead?.stage || ""}
          leadId={lead?.id}
        />
      </div>
    </div>
  );
};

export default Overview;
