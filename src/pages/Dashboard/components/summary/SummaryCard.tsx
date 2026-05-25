import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { getAnalyticsCardConfig } from "../../utils/getAnalyticsCardConfig.utils";

interface DashboardSummaryCardProps {
  card: any;
  filters: any;
}

const DashboardSummaryCard = ({ card, filters }: DashboardSummaryCardProps) => {
  const config = getAnalyticsCardConfig(card.id);
  const Icon = config.icon;

  const chartData = card.chartData.map((item: any) => ({
    value: item?.value,
  }));

  return (
    <div className={`rounded-xl border border-gray-200 p-3 bg-white flex-1`}>
      <div className="flex items-start">
        <div className="flex md:flex-row flex-col md:items-start items-center md:gap-6 gap-1.5">
          <div
            className={`flex size-10 rounded-full font-bold items-center justify-center ${config?.iconBg}`}
          >
            <Icon className={`${config?.iconColor}`} size={22} />
          </div>

          <div className="flex-1 space-y-1">
            <p className="text-sm md:text-start text-center font-medium">
              {card.title}
            </p>
            <h3 className="text-lg md:text-start text-center font-bold">
              {card.value}
            </h3>
            <div className="flex items-center gap-2">
              <p className="flex items-center gap-1 text-xs whitespace-nowrap">
                <span className={`font-semibold ${config?.iconColor}`}>
                  {card.percentage}%
                </span>
                {filters?.range !== "today" &&
                  `vs last ${filters?.range || "7days"}`}
              </p>

              {/* <span className="text-sm text-[#9ca3af]">{card.description}</span> */}
            </div>
          </div>
        </div>
      </div>

      {chartData?.length > 1 && (
        <div className="w-full h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <Area
                type="bumpX"
                dataKey="value"
                strokeWidth={1}
                fillOpacity={0.1}
                fill={config?.fillColor}
                stroke={config.strokeColor}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DashboardSummaryCard;
