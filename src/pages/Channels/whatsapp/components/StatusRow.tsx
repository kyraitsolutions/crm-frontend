import { CheckCircle2, XCircle } from "lucide-react";

interface StatusRowProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  subtitle: string;
  value: boolean;
}

export const StatusRow = ({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  subtitle,
  value,
}: StatusRowProps) => {
  return (
    <div className="flex items-center justify-between gap-3">
      {/* Left: icon + text */}
      <div className="flex items-center gap-3">
        <div
          className={`flex size-8 items-center justify-center rounded-full ${iconBg}`}
        >
          <Icon size={16} className={iconColor} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>

      {/* Right: badge */}
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          value
            ? "bg-green-500/15 text-green-400"
            : "bg-red-500/15 text-red-400"
        }`}
      >
        {/* checkmark or x */}
        {value ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
        {value ? "Yes" : "No"}
      </span>
    </div>
  );
};
