import type { ILead } from "@/pages/LeadCentre/types/lead.type";
import ActivityLogLists from "@/pages/Settings/activityLogs/components/ActivityLogLists";
import { useActivityLogStore } from "@/pages/Settings/activityLogs/store/activity-logs.store";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";

// type TimelineType =
//   | "attachment"
//   | "note"
//   | "update"
//   | "email"
//   | "call"
//   | "interaction";

// interface TimelineItem {
//   id: string;
//   type: TimelineType;
//   time: string;
//   date: string;
//   title: string;
//   description?: string;
//   user: string;
//   showNote?: boolean;
// }

interface TimelineTabProps {
  lead: ILead;
}

const TimelineTab = ({ lead }: TimelineTabProps) => {
  const accountId = useAuthStore((state) => state.accountId);
  const { fetchLeadLogs } = useActivityLogStore((state) => state);
  // const [activeTab, setActiveTab] = useState<
  //     "history" | "interactions"
  // >("history");

  // const [showUpcoming, setShowUpcoming] = useState(false);

  // const timelineData: TimelineItem[] = [
  //   {
  //     id: "1",
  //     type: "attachment",
  //     time: "09:13 AM",
  //     date: "19/05/2026",
  //     title: "Attachment added - Screenshot 2025-06-18 153055.png",
  //     user: "Abhijeet Singh",
  //     showNote: true,
  //   },
  //   {
  //     id: "2",
  //     type: "attachment",
  //     time: "09:12 AM",
  //     date: "19/05/2026",
  //     title: "Attachment added - 301 Moved",
  //     user: "Abhijeet Singh",
  //   },
  //   {
  //     id: "3",
  //     type: "note",
  //     time: "09:42 PM",
  //     date: "17/05/2026",
  //     title: "Note added -",
  //     description: "sdfsdfs",
  //     user: "Abhijeet Singh",
  //   },
  //   {
  //     id: "4",
  //     type: "note",
  //     time: "09:42 PM",
  //     date: "17/05/2026",
  //     title: "Note added -",
  //     description: "sdfsdfsd",
  //     user: "Abhijeet Singh",
  //   },
  //   {
  //     id: "5",
  //     type: "update",
  //     time: "09:42 PM",
  //     date: "17/05/2026",
  //     title: "Fax was updated from blank value to jyguftdtfxv weruiywt",
  //     user: "Abhijeet Singh",
  //   },
  //   {
  //     id: "6",
  //     type: "email",
  //     time: "08:20 PM",
  //     date: "17/05/2026",
  //     title: "Email sent to client",
  //     description: "Follow-up email sent regarding booking confirmation",
  //     user: "Abhijeet Singh",
  //   },
  // ];

  // const groupedTimeline = useMemo(() => {
  //   return timelineData.reduce((acc: Record<string, TimelineItem[]>, item) => {
  //     if (!acc[item.date]) {
  //       acc[item.date] = [];
  //     }

  //     acc[item.date].push(item);
  //     return acc;
  //   }, {});
  // }, []);

  // const renderIcon = (type: TimelineType) => {
  //   switch (type) {
  //     case "attachment":
  //       return <Link2 size={16} />;

  //     case "note":
  //       return <FileText size={16} />;

  //     case "update":
  //       return <Pencil size={16} />;

  //     case "call":
  //       return <Phone size={16} />;

  //     case "email":
  //       return <Mail size={16} />;

  //     case "interaction":
  //       return <MessageSquare size={16} />;

  //     default:
  //       return <Clock3 size={16} />;
  //   }
  // };

  useEffect(() => {
    fetchLeadLogs(String(accountId), lead.id);
  }, []);

  return (
    <div className="p-5 overflow-y-auto hide-scrollbar ">
      <div>
        {/* Top Actions */}
        <div className="bg-white rounded-xl px-5 pt-4 flex items-center justify-between">
          {/* <div className="flex items-center gap-3">
            <h2 className="text-md font-semibold">Timeline History</h2>

            <button className=" bg-gray-200 rounded-xl text-gray-500 py-2 px-3 hover:opacity-90">
              <Filter size={16} />
            </button>
          </div> */}

          {/* <button
          onClick={() => setShowUpcoming(!showUpcoming)}
          className="text-sm text-second flex items-center gap-1"
        >
          Show Upcoming Automated Actions
          <ChevronDown size={15} />
        </button> */}
        </div>

        {/* Timeline */}

        <div className="bg-white py-5 px-10 h-full">
          <ActivityLogLists />
        </div>
      </div>
    </div>

  );
};

export default TimelineTab;

{
  /* <div className="max-h-150 overflow-y-auto px-5 pb-8 mt-10 hide-scrollbar">
  {Object.entries(groupedTimeline).map(([date, items]) => (
    <div key={date} className="mb-10">
      Date Badge
      <div className="inline-flex border border- rounded-xl px-4 py-1 text-sm text-gray-500 bg-gray-50 mb-6">
        {date}
      </div>

      <div className="relative">
        Timeline Line
        <div className="absolute left-27.25 top-0 bottom-0 w-px bg-gray-200" />

        <div className="space-y-8">
          {items.map((item) => (
            <div key={item.id} className="relative flex">
              Time
              <div className="w-22.5 text-sm text-gray-700 pt-2 text-right pr-6 shrink-0">
                {item.time}
              </div>

              Icon
              <div className="relative z-10 shrink-0">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-700">
                  {renderIcon(item.type)}
                </div>
              </div>

              Content
              <div className="ml-8 pb-2">
                <h3 className="text-sm text-gray-900">{item.title}</h3>

                {item.description && (
                  <p className="text-sm text-gray-800">{item.description}</p>
                )}

                <p className="text-sm text-gray-500 mt-1">
                  by <span className="text-gray-700">{item.user}</span>{" "}
                  {item.date}
                </p>

                {item.showNote && (
                  <button className="text-sm text-second mt-1 flex items-center gap-1">
                    Add Note
                    <ChevronDown size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ))}
</div>; */
}
