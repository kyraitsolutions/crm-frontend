import { Button } from "@/components/ui/button";

interface DetailTabsProps {
  activeTab: "overview" | "timeline" | "aiSummary";
  onChange: (tab: "overview" | "timeline" | "aiSummary") => void;
}

const DetailTabs = ({ activeTab, onChange }: DetailTabsProps) => {
  const tabs = [
    {
      label: "Overview",
      value: "overview",
    },
    {
      label: "Timeline",
      value: "timeline",
    },
    // {
    //   label: "AI Summary",
    //   value: "aiSummary",
    // },
  ] as const;

  return (
    <div className="bg-white border rounded-full p-1 flex w-fit shadow-sm">
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={` px-4 py-1 rounded-full text-sm font-medium transition bg-transparent! ${
            activeTab === tab.value
              ? "bg-primary/10 text-primary border border-primary font-semibold"
              : "text-[#64748b]"
          }`}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default DetailTabs;
