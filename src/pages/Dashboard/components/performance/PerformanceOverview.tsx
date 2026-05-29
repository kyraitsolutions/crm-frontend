// components/performance/PerformanceOverviewSection.tsx

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import { useMemo } from "react";
import { useDashboardStore } from "../../store/dashboard.store";
import { formatChartDate } from "@/utils/date.utils";

const PerformanceOverview = () => {
  const { dashboardOverview } = useDashboardStore((state) => state);

  console.log(dashboardOverview);

  const chartData = useMemo(() => {
    if (!dashboardOverview?.performanceOverview) {
      return [];
    }

    return dashboardOverview.performanceOverview.map((item: any) => ({
      date: formatChartDate(item.date),
      leads: item.leads || 0,
      conversations: item.conversations || 0,
      conversionRate: item.conversionRate || 0,
    }));
  }, [dashboardOverview]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Performance Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Leads & conversations trends
          </p>
        </div>
      </div>

      {/* Legends */}
      <div className="flex items-center gap-6 mb-6">
        {/* Leads */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />

          <span className="text-sm text-gray-600">Leads</span>
        </div>

        {/* Conversations */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />

          <span className="text-sm text-gray-600">Conversations</span>
        </div>

        {/* Conversion */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />

          <span className="text-sm text-gray-600">Conversion %</span>
        </div>
      </div>

      {/* Empty State */}
      {!chartData.length ? (
        <div className="h-[320px] flex items-center justify-center text-sm text-gray-500">
          No analytics data available
        </div>
      ) : (
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                }}
              />

              <Tooltip />

              <Legend content={() => null} />

              {/* Leads */}
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />

              {/* Conversations */}
              <Line
                type="monotone"
                dataKey="conversations"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />

              {/* Conversion */}
              <Line
                type="monotone"
                dataKey="conversionRate"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PerformanceOverview;
