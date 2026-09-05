import type { ILead } from "@/pages/LeadCentre/types/lead.type";

interface FollowUpsTabProps {
  lead: ILead;
}

const FollowUpsTab = ({ lead }: FollowUpsTabProps) => {
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#f4f5f8] p-4">
      <div className="flex flex-col gap-4 bg-white rounded-2xl p-6">
        <h3 className="text-sm font-medium text-gray-800">Follow-ups</h3>
        <p className="text-sm text-gray-500">
          No follow-ups yet for {lead?.name || "this lead"}.
        </p>
      </div>
    </div>
  );
};

export default FollowUpsTab;
