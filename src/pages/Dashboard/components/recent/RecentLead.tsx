import { Link } from "react-router-dom";
import { useDashboardStore } from "../../store/dashboard.store";
import CustomBadge from "../CustomBadge";
import { timeAgo } from "@/utils/date.utils";

const tableHeaders = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "source",
    label: "Source",
  },
  {
    key: "phone",
    label: "Phone",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "createdAt",
    label: "Created At",
  },
];

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const RecentLeads = () => {
  const { dashboardOverview } = useDashboardStore((state) => state);

  const recentLeads = dashboardOverview?.recentLeads || [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold text-[#111827]">Recent Leads</h2>

        <Link to="/" className="text-xs font-medium text-[#2563EB]">
          View All Leads
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  className="px-3 py-2 text-left text-[11px] font-semibold text-[#6B7280]"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {recentLeads.map((lead, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 last:border-0"
              >
                {tableHeaders.map((header) => {
                  const value = lead?.[header.key];

                  if (header.key === "source") {
                    return (
                      <td key={header.key} className="px-3 py-3">
                        <CustomBadge variant="source" value={value}>
                          {value}
                        </CustomBadge>
                      </td>
                    );
                  }

                  if (header.key === "status") {
                    return (
                      <td key={header.key} className="px-3 py-3">
                        <CustomBadge variant="status" value={value}>
                          {value}
                        </CustomBadge>
                      </td>
                    );
                  }

                  if (header.key === "createdAt") {
                    return (
                      <td
                        key={header.key}
                        className="px-3 py-3 whitespace-nowrap text-[12px] text-[#4B5563]"
                      >
                        {timeAgo(value)}
                      </td>
                    );
                  }

                  return (
                    <td
                      key={header.key}
                      className={`px-3 py-3 whitespace-nowrap text-[12px] ${
                        header.key === "name"
                          ? "font-medium text-[#111827]"
                          : "text-[#4B5563]"
                      }`}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLeads;

// import { useDashboardStore } from "../../store/dashboard.store";
// import CustomBadge from "../CustomBadge";

// const recentLeads = [
//   {
//     name: "Alex Johnson",
//     source: "Facebook Ads",
//     phone: "+1 202-555-0173",
//     status: "New",
//     createdAt: "May 18, 2025",
//   },
//   {
//     name: "Lisa Morgan",
//     source: "Web Form",
//     phone: "+1 202-555-0148",
//     status: "Contacted",
//     createdAt: "May 18, 2025",
//   },
//   {
//     name: "David Wilson",
//     source: "Google Ads",
//     phone: "+1 202-555-0198",
//     status: "Qualified",
//     createdAt: "May 18, 2025",
//   },
// ];
// const RecentLeads = () => {
//   const { dashboardOverview } = useDashboardStore((state) => state);
//   console.log(dashboardOverview);
//   return (
//     <div className="rounded-xl border bg-white">
//       {/* Header */}
//       <div className="flex items-center justify-between px-6 py-5">
//         <h2 className="text-[20px] font-semibold text-[#111827]">
//           Recent Leads
//         </h2>

//         <button className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8]">
//           View All Leads
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="border-b px-4">
//               <th className=" text-left text-sm font-semibold text-[#6B7280]">
//                 Name
//               </th>

//               <th className=" text-left text-sm font-semibold text-[#6B7280]">
//                 Source
//               </th>

//               <th className=" text-left text-sm font-semibold text-[#6B7280]">
//                 Phone
//               </th>

//               <th className=" text-left text-sm font-semibold text-[#6B7280]">
//                 Status
//               </th>

//               <th className="text-left text-sm font-semibold text-[#6B7280]">
//                 Created At
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {recentLeads.map((lead, index) => (
//               <tr
//                 key={index}
//                 className="border-b last:border-0 hover:bg-gray-50/40"
//               >
//                 <td className="px-6 whitespace-nowrap font-medium text-[#111827]">
//                   {lead.name}
//                 </td>

//                 <td className="px-6">
//                   <CustomBadge variant="source" value={lead.source}>
//                     {lead.source}
//                   </CustomBadge>
//                 </td>

//                 <td className="px-6 whitespace-nowrap text-[#4B5563]">
//                   {lead.phone}
//                 </td>

//                 <td className="px-6">
//                   <CustomBadge variant="status" value={lead.status}>
//                     {lead.status}
//                   </CustomBadge>
//                 </td>

//                 <td className="px-6 text-[15px] text-[#4B5563]">
//                   {lead.createdAt}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RecentLeads;
