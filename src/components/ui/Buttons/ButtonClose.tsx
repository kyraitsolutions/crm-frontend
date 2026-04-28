import { X } from "lucide-react";
import { Button } from "../button";
import { cn } from "@/lib/utils";

type TButtonCloseProps = {
  onClose: () => void;
  iconSize?: number;
} & React.ComponentProps<typeof Button>;

const ButtonClose = ({
  onClose,
  iconSize = 12,
  ...props
}: TButtonCloseProps) => {
  return (
    <Button
      onClick={onClose}
      className={cn(
        "bg-red-400 rounded-full size-6 flex items-center justify-center hover:bg-red-500",
        props.className,
      )}
    >
      <X size={iconSize} />
    </Button>
  );
};

export default ButtonClose;
