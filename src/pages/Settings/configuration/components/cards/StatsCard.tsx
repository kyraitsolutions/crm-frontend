// StatsCard.tsx

import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  iconBg: string;
}

const StatsCard = ({ title, value, icon, iconBg }: StatsCardProps) => {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
      <div className="flex items-start gap-4">
        <div
          className={`flex size-8 items-center justify-center rounded-full ${iconBg}`}
        >
          {icon}
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold leading-none text-slate-700">
            {value}
          </h3>
          {/* <p className="mt-2 text-sm text-[#94A3B8]">{subtitle}</p> */}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

// interface StatsCardProps {
//   title: string;
//   value: string;
// }

// const StatsCard = ({ title, value }: StatsCardProps) => {
//   return (
//     <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
//       <div className="flex items-start gap-4">
//         <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
//           ICON
//         </div>

//         <div>
//           <p className="text-sm text-[#64748B]">Total Statuses</p>

//           <h3 className="mt-1 text-[36px] font-semibold text-[#0F172A]">6</h3>

//           <p className="mt-1 text-sm text-[#94A3B8]">All lead statuses</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatsCard;
