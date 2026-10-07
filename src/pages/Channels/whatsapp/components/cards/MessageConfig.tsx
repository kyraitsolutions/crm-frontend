import { Switch } from "@/components/ui/switch";
import { Whatsapp } from "@/icons/icons";
import { Pencil } from "lucide-react";

interface OptCardProps {
  responseTitle: string;
  responseDescription: string;
  message: string;
  autoResponseEnabled: boolean;
  locked?: boolean;
  lockReason?: string;
  onToggle: (value: boolean) => void;
  onConfigure: () => void;
}

const MessageConfig = ({
  responseTitle,
  responseDescription,
  message,
  autoResponseEnabled,
  locked = false,
  lockReason,
  onToggle,
  onConfigure,
}: OptCardProps) => {
  return (
    <div
      className={`rounded-xl border border-gray-100 bg-gray-50/60 p-4 ${
        locked ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">
            {responseTitle}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {responseDescription}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Switch
            checked={autoResponseEnabled && !locked}
            disabled={locked}
            onCheckedChange={onToggle}
          />
          <button
            type="button"
            onClick={onConfigure}
            disabled={locked}
            className="flex items-center gap-1.5 rounded-xl border border-teal-800 px-2.5 py-1.5 text-xs font-medium text-teal-800 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Pencil size={14} />
            Configure
          </button>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <div className="relative max-w-60 rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="absolute -top-2 -left-2">
            <Whatsapp h="18px" w="18px" />
          </div>
          <p className="px-4 py-3 text-xs leading-relaxed text-gray-700">
            {message}
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-gray-500">
        {locked ? (
          lockReason
        ) : (
          <>
            Auto response is{" "}
            <span className="font-medium text-gray-700">
              {autoResponseEnabled ? "enabled" : "disabled"}
            </span>
          </>
        )}
      </p>
    </div>
  );
};

export default MessageConfig;
