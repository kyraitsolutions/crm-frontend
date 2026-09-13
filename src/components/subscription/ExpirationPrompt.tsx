import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubscriptionService } from "@/services/subscription.service";
import { useSubscription } from "@/hooks/useSubscription";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const subscriptionService = new SubscriptionService();

export function ExpirationPrompt() {
  const { subscription, isExpired, refresh } = useSubscription();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (subscription?.expirationPrompt?.shouldShow && isExpired) {
      setOpen(true);
    }
  }, [subscription?.expirationPrompt?.shouldShow, isExpired]);

  const dismiss = async () => {
    try {
      await subscriptionService.acknowledgeExpiration();
      await refresh();
    } catch {
      // still close for this session if the API fails
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && void dismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your 14-day free trial has ended</DialogTitle>
          <DialogDescription>
            Upgrade your plan to continue using Kyra AI CRM. Your data is safe and
            will not be deleted.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => void dismiss()}>
            Not now
          </Button>
          <Button
            onClick={() => {
              void dismiss();
              navigate("/dashboard/settings/subscription");
            }}
          >
            View Plans
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
