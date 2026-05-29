import type { LucideIcon } from "lucide-react";

interface SnapshotMetric {
  label: string;
  value: string | number;
}

interface SnapshotCardProps {
  title: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  analyticsLabel: string;
  metrics: SnapshotMetric[];
}

const SnapshotCard = ({
  title,
  icon: Icon,
  iconColor,
  iconBg,
  metrics,
  analyticsLabel,
}: SnapshotCardProps) => {
  return (
    <div className=" bg-white border border-gray-200 rounded-2xl p-5 flex-1">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`size-8 rounded-full flex items-center justify-center ${iconBg}`}
        >
          {Icon && <Icon className={`${iconColor} size-4 font-bold`} />}
        </div>

        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between gap-4"
          >
            <p className="text-sm text-gray-500">{metric.label}</p>

            <p className="text-sm font-semibold text-gray-900">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <button className="mt-6 text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
        View {analyticsLabel} Analytics
      </button>
    </div>
  );
};

export default SnapshotCard;
