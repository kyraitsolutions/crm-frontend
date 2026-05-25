import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant: "source" | "status";
  value: string;
}

const badgeVariants = {
  source: {
    facebook:
      "bg-blue-50 text-blue-500 border border-blue-100 hover:bg-blue-50",
    webform:
      "bg-green-50 text-green-600 border border-green-100 hover:bg-green-50",
    google:
      "bg-orange-50 text-orange-500 border border-orange-100 hover:bg-orange-50",
    webhook:
      "bg-violet-50 text-violet-600 border border-violet-100 hover:bg-violet-50",
  },

  status: {
    open: "bg-blue-50 text-blue-500 border border-blue-100 hover:bg-blue-100",
    new: "bg-green-50 text-green-600 border border-green-100 hover:bg-green-50",
    contacted:
      "bg-blue-50 text-blue-500 border border-blue-100 hover:bg-blue-100",
    converted:
      "bg-yellow-50 text-yellow-600 border border-yellow-100 hover:bg-yellow-50",
    qualified:
      "bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-50",
    intake: "bg-cyan-50 text-cyan-600 border border-cyan-100 hover:bg-cyan-50",
  },
};

const CustomBadge = ({ children, variant, value }: BadgeProps) => {
  return (
    <Badge
      className={cn(
        "px-2 h-5! text-[11px] font-semibold shadow-none rounded-xl bg-gray-100 text-gray-500 border border-gray-200 transition-all duration-300",
        badgeVariants?.[variant]?.[value],
      )}
    >
      {children}
    </Badge>
  );
};

export default CustomBadge;
