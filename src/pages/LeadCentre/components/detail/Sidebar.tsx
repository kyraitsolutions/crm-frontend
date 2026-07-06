import { Button } from "@/components/ui/button";

interface ISidebarProps {
  counts: Record<string, number>;
  onTabClick: (tab: string) => void;
}

const RELATED_LIST = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "details",
    label: "Details",
  },
  {
    id: "notes",
    label: "Notes",
  },
  {
    id: "attachments",
    label: "Attachments",
  },
  {
    id: "emails",
    label: "Emails",
  },
];

const Sidebar = ({ onTabClick, counts }: ISidebarProps) => {
  return (
    <aside className="w-60 h-screen bg-white border-r border-[#e5e7eb] overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#1f2937] mb-4">
          Related List
        </h3>

        <div className="space-y-2 flex flex-col items-start">
          {RELATED_LIST.map((item) => (
            <Button
              key={item.id}
              onClick={() => onTabClick(item.id)}
              className="bg-transparent! text-gray-700 capitalize  transition cursor-pointer py-1! px-0!"
            >
              {item.label}

              {(counts[item.id] ?? 0) > 0 && (
                <span className="bg-second/20 px-2 py-px rounded-xl ml-2 text-second text-xs min-w-5.5 text-center">
                  {counts[item.id]}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* <button className="text-blue-600 mt-5 text-sm hover:underline">
          Add Related List
        </button> */}

        {/* <div className="mt-10">
          <h3 className="font-semibold text-sm text-[#1f2937] mb-4">Links</h3>

          <button className="text-blue-600 hover:underline text-sm">
            Add Link
          </button>
        </div> */}
      </div>
    </aside>
  );
};

export default Sidebar;
