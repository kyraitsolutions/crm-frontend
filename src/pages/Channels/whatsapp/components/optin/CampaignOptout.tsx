import { Switch } from "@/components/ui/switch";

interface CampaignOptoutProps {
    title: string;
    description: string;
    enabled: boolean;
    onChange: (value: boolean) => void;
}

const CampaignOptout = ({
    title,
    description,
    enabled,
    onChange,
}: CampaignOptoutProps) => {
    return (
        <div className="flex items-center justify-between rounded-xl bg-white p-10">
            <div>
                <h2 className="text-md font-medium text-gray-900">
                    {title}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    {description}
                </p>
            </div>

            <Switch checked={enabled} onCheckedChange={onChange} />
        </div>
    );
};

export default CampaignOptout;