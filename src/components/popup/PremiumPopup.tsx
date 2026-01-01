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
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-yellow-100">
            <Crown className="size-7 text-yellow-600" />
          </div>

          <DialogTitle className="text-xl mt-4">Upgrade to Premium</DialogTitle>

          <DialogDescription className="text-sm text-gray-500">
            You’ve reached the maximum number of accounts allowed on your
            current plan.
          </DialogDescription>
        </DialogHeader>

        {/* <div className="mt-4 text-sm text-gray-600">
          Redirecting you to subscription page…
        </div> */}

        <Link to={"/dashboard/subscription"} className="mt-6 w-full bg-primary p-2 text-white hover:bg-primary/90">Upgrade Now</Link>
      </DialogContent>
    </Dialog>
  );
};
