import { useDashboardStore } from "../../store/dashboard.store";
import { getSnapshotConfig } from "../../utils/getSnapshotCardConfig";
import SnapshotCard from "./SnapshotCard";

// const snapshotData = [
//   {
//     title: "CRM Snapshot",
//     analyticsLabel: "CRM",
//     icon: <Users size={18} className="text-white" />,
//     iconBg: "bg-green-500",

//     metrics: [
//       {
//         label: "Total Leads",
//         value: "1,280",
//       },

//       {
//         label: "Qualified Leads",
//         value: "320",
//       },

//       {
//         label: "Hot Leads",
//         value: "96",
//       },

//       {
//         label: "Conversion Rate",
//         value: "24.6%",
//       },
//     ],
//   },

//   {
//     title: "WhatsApp Snapshot",
//     analyticsLabel: "WhatsApp",
//     icon: <MessageCircle size={18} className="text-white" />,
//     iconBg: "bg-green-500",

//     metrics: [
//       {
//         label: "Messages Sent",
//         value: "1,256",
//       },

//       {
//         label: "Delivered",
//         value: "1,180 (94%)",
//       },

//       {
//         label: "Read",
//         value: "820 (69%)",
//       },

//       {
//         label: "Response Time",
//         value: "2m 15s",
//       },
//     ],
//   },

//   {
//     title: "Chatbot Snapshot",
//     analyticsLabel: "Chatbot",
//     icon: <Bot size={18} className="text-white" />,
//     iconBg: "bg-blue-500",

//     metrics: [
//       {
//         label: "Active Bots",
//         value: "6",
//       },

//       {
//         label: "Interactions",
//         value: "2,450",
//       },

//       {
//         label: "Success Rate",
//         value: "87%",
//       },

//       {
//         label: "Failed Interactions",
//         value: "320",
//       },
//     ],
//   },

//   {
//     title: "Broadcast Snapshot",
//     analyticsLabel: "Broadcast",
//     icon: <Megaphone size={18} className="text-white" />,
//     iconBg: "bg-violet-500",

//     metrics: [
//       {
//         label: "Sent",
//         value: "3,450",
//       },

//       {
//         label: "Delivered",
//         value: "3,210 (93%)",
//       },

//       {
//         label: "Opened",
//         value: "1,950 (56%)",
//       },

//       {
//         label: "CTR",
//         value: "12.6%",
//       },
//     ],
//   },
// ];

const SnapshotSection = () => {
  const { dashboardOverview } = useDashboardStore((state) => state);
  return (
    <main className="flex flex-wrap gap-3">
      {dashboardOverview?.snapshots &&
        dashboardOverview?.snapshots.length > 0 &&
        dashboardOverview?.snapshots?.map((snapshot: any) => {
          const config = getSnapshotConfig(snapshot.id);
          const icon = config.icon;
          return (
            <SnapshotCard
              key={snapshot.id}
              title={snapshot.title}
              icon={icon}
              iconBg={config.iconBg}
              iconColor={config.iconColor}
              metrics={snapshot.metrics}
              analyticsLabel={snapshot.analyticsLabel}
            />
          );
        })}
    </main>
  );
};

export default SnapshotSection;
