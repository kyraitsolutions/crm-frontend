// components/charts/LeadsByStatusChart.tsx
interface LeadsByStatusProps {
  data: {
    status: string;
    total: number;
    percentage: number;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  intake: "bg-sky-500",
  open: "bg-yellow-500",
  qualified: "bg-purple-500",
  contacted: "bg-indigo-500",
  converted: "bg-green-500",
  lost: "bg-red-500",
};

const LeadsByStatusChart = ({ data }: LeadsByStatusProps) => {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm h-full">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Leads By Status</h2>
      </div>

      <div className="space-y-5">
        {data.map((item) => {
          const color =
            STATUS_COLORS[item.status.toLowerCase()] || "bg-blue-500";

          return (
            <div key={item.status}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`size-2.5 rounded-full ${color}`} />

                  <p className="capitalize text-sm font-medium text-gray-700">
                    {item.status}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{item.total}</span>

                  <span>{item.percentage}%</span>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color}`}
                  style={{
                    width: `${item.percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadsByStatusChart;
