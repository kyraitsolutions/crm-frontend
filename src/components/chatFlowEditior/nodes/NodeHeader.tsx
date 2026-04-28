import { cn } from "@/lib/utils";

type TNodeHeaderProps = {
  title: string;
  icon?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const NodeHeader = ({ title, icon, ...props }: TNodeHeaderProps) => {
  return (
    <div
      {...props}
      className={cn("p-4 flex items-center gap-2 text-white", props.className)}
    >
      {icon}
      <h2 className="font-bold text-sm">{title}</h2>
    </div>
  );
};

export default NodeHeader;
