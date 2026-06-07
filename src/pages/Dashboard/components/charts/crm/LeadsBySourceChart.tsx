// components/charts/LeadsBySourceChart.tsx

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface LeadBySourceProps {
  data: {
    source: string;
    total: number;
  }[];
}

const COLORS = ["#2563eb", "#22c55e", "#a855f7", "#f97316", "#06b6d4"];

const LeadsBySourceChart = ({ data }: LeadBySourceProps) => {
  const totalLeads = data?.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm h-full">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Leads By Source</h2>
      </div>

      <div className="flex lg:flex-row flex-col items-center justify-between gap-4">
        <div className="w-50 h-50">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="source"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
              >
                {data?.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = ((item.total / totalLeads) * 100).toFixed(0);

            return (
              <div
                key={item.source}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />

                  <p className="capitalize text-sm font-medium text-gray-700">
                    {item.source}
                  </p>
                </div>

                <p
                  style={{
                    color: COLORS[index % COLORS.length],
                  }}
                  className="text-sm text-gray-500 px-2"
                >
                  {item.total} ({percentage}%)
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 text-center">
        <p className="text-2xl font-bold">{totalLeads}</p>
        <p className="text-sm text-gray-500">Total Leads</p>
      </div>
    </div>
  );
};

export default LeadsBySourceChart;
