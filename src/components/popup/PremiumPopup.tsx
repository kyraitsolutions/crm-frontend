import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface PremiumPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PremiumPopup = ({ open, onOpenChange }: PremiumPopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center rounded-2xl">
        <DialogHeader>
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-yellow-100">
            <Crown className="size-7 text-yellow-600" />
          </div>

          <DialogTitle className="text-xl mt-4 text-foreground">Upgrade to Premium</DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            You’ve reached the maximum number of accounts allowed on your
            current plan.
          </DialogDescription>
        </DialogHeader>

        {/* <div className="mt-4 text-sm text-gray-600">
          Redirecting you to subscription page…
        </div> */}

        <Link to={"/dashboard/subscription"} className="mt-6 w-full p-2  rounded-full   bg-primary text-white hover:bg-primary/90">Upgrade Now</Link>
      </DialogContent>
    </Dialog>
  );
};
