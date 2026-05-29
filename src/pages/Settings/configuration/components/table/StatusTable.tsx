interface StatusTableProps {
  data: any[];
}

const StatusTable = ({ data }: StatusTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <table className="w-full">
        <thead className="border-b bg-[#F9FAFB]">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-[#6B7280]">
              Label
            </th>

            <th className="px-6 py-4 text-left text-sm font-medium text-[#6B7280]">
              Key
            </th>

            <th className="px-6 py-4 text-left text-sm font-medium text-[#6B7280]">
              Color
            </th>

            <th className="px-6 py-4 text-left text-sm font-medium text-[#6B7280]">
              Type
            </th>

            <th className="px-6 py-4 text-left text-sm font-medium text-[#6B7280]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.key} className="border-b">
              <td className="px-6 py-5 text-sm text-[#111827]">{item.label}</td>

              <td className="px-6 py-5 text-sm text-[#6B7280]">{item.key}</td>

              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      background: item.color,
                    }}
                  />

                  <span className="text-sm text-[#6B7280]">{item.color}</span>
                </div>
              </td>

              <td className="px-6 py-5">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item.system
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {item.system ? "System" : "Custom"}
                </span>
              </td>

              <td className="px-6 py-5">
                <div className="flex items-center gap-4 text-sm">
                  <button className="font-medium text-[#15803d]">Edit</button>

                  {!item.system && (
                    <button className="font-medium text-red-500">Delete</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatusTable;
