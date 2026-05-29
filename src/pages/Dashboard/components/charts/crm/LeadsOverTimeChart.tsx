// components/charts/LeadsOverTimeChart.tsx

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface LeadsOverTimeChartProps {
  data: {
    date: string;
    value: number;
  }[];
}

const LeadsOverTimeChart = ({ data }: LeadsOverTimeChartProps) => {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm h-full">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Leads Over Time</h2>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />

                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#leadGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeadsOverTimeChart;
