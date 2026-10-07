import { Switch } from "@/components/ui/switch";

interface CampaignOptoutProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
  /** When true, no outer card — parent provides the section chrome. */
  bare?: boolean;
}

const CampaignOptout = ({
  title,
  description,
  enabled,
  onChange,
  bare = false,
}: CampaignOptoutProps) => {
  const content = (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} className="mt-0.5" />
    </div>
  );

  if (bare) return content;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {content}
    </div>
  );
};

export default CampaignOptout;
