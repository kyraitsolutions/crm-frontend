import type { ConfigurationItem } from "@/pages/Settings/configuration/store/configuration.store";

import SelectFieldRow from "./SelectFieldRow";
import type { ITeam } from "@/types/teams.type";
import { useLeadsStore } from "../../store/lead.store";
import { useAuthStore } from "@/stores";
import type { ApiError } from "@/types";
import { ToastMessageService } from "@/services";
import { FieldRow } from "./FieldRow";
import type { ILead } from "../../types/lead.type";

interface IOverviewProps {
  lead: ILead | null;
  leadStages: ConfigurationItem[] | [];
  users: ITeam[] | [];
}

const Overview = ({ lead, leadStages, users }: IOverviewProps) => {
  const toastService = new ToastMessageService();
  const { accountId } = useAuthStore((state) => state);
  const { updateLeadField } = useLeadsStore((state) => state);

  const leadStagesOptions = leadStages?.map((stage) => ({
    label: stage.label,
    value: stage.key,
  }));

  const userOptions = users?.map((user) => ({
    label: `${user.userProfile.firstName} ${user.userProfile.lastName}`,
    value: user.userId,
  }));

  const handleSave = async (fieldKey: keyof ILead, value: string) => {
    try {
      const response = await updateLeadField(
        String(accountId),
        String(lead?.id),
        fieldKey,
        value,
      );
      if (response && response.status === 200) {
        toastService.success(response?.message || "Lead updated successfully!");
      }
    } catch (error) {
      const err = error as ApiError;
      if (err) {
        toastService.error(err.message || "Failed to update lead");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl">
      <div className="max-w-4xl w-full mx-auto py-6">
        <SelectFieldRow
          label="Lead Owner"
          value={lead?.assignedTo?.userId || String(lead?.assignedTo)}
          options={userOptions}
          onChange={(value) => {
            handleSave("assignedTo", value);
          }}
        />

        <FieldRow
          label="Name"
          fieldKey="name"
          value={lead?.name || ""}
          leadId={lead?.id}
          onChange={(value) => {
            handleSave("name", value);
          }}
        />
        <FieldRow
          label="Email"
          fieldKey="email"
          value={lead?.email || ""}
          leadId={lead?.id}
          onChange={(value) => {
            handleSave("email", value);
          }}
        />
        <FieldRow
          label="Phone"
          fieldKey="phone"
          isPhone
          value={lead?.phone || ""}
          leadId={lead?.id}
          onChange={(value) => {
            handleSave("phone", value);
          }}
        />

        <SelectFieldRow
          label="Stage"
          value={lead?.stage}
          options={leadStagesOptions || []}
          onChange={(value) => {
            handleSave("stage", value);
          }}
        />

        {/* <FieldRow
          label="Mobile"
          fieldKey="mobile"
          value={lead?.mobile || ""}
          isPhone
          leadId={lead?.id}
        /> */}
      </div>
    </div>
  );
};

export default Overview;
