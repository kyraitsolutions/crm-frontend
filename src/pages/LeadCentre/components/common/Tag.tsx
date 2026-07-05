import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores";
import { useLeadsStore } from "../../store/lead.store";
import type { ILead } from "../../types/lead.type";
import Tags from "@/components/Tag/Tags";

const LeadTags = ({ lead }: { lead: ILead }) => {
  const { accountId } = useAuthStore();
  const { updateLeadField } = useLeadsStore();

  const [selectedTags, setSelectedTags] = useState<
    { label: string; color: string }[]
  >([]);

  useEffect(() => {
    if (lead?.tags?.length) {
      const formatted = lead.tags.map((tag: string) => ({
        label: tag,
        color: "#60a5fa",
      }));

      setSelectedTags(formatted);
    }
  }, [lead]);

  const handleSave = async (newTags: { label: string; color: string }[]) => {
    const payload = newTags.map((tag) => tag.label);

    await updateLeadField(
      String(accountId),
      String(lead?.id),
      "tags" as never,
      payload,
    );
  };

  return (
    <div>
      <Tags
        tags={selectedTags}
        onChange={setSelectedTags}
        onSave={handleSave}
      />
    </div>
  );
};

export default LeadTags;
