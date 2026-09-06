import { BILLING_ROLES } from "@/constants/subscription.constant";
import { PlanUpgradeOverlay } from "@/components/subscription/PlanUpgradeOverlay";
import { SubscriptionService } from "@/services/subscription.service";
import { useAuthStore } from "@/stores";
import { useSubscription } from "@/hooks/useSubscription";
import type { SubscriptionPlanView } from "@/types/subscription.type";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { ToastMessageService } from "@/services";
import { useNavigate } from "react-router-dom";
import DataLoader from "@/components/Loader/data-loader";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type ProcessingState = "checkout" | "activating" | null;

export const SubscriptionPage = () => {
  const subscriptionService = new SubscriptionService();
  const toastService = new ToastMessageService();
  const navigate = useNavigate();
  const { user } = useAuthStore((state) => state);
  const { subscription, refresh } = useSubscription();
  const [plans, setPlans] = useState<SubscriptionPlanView[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [processing, setProcessing] = useState<ProcessingState>(null);
  const canBill = BILLING_ROLES.includes(String(user?.role?.name || "").toUpperCase());

  const loadPlans = async () => {
    setPlansLoading(true);
    try {
      const response = await subscriptionService.getPlans();
      setPlans(response.data?.docs || []);
    } catch (error: any) {
      toastService.error(error?.message || "Failed to load plans");
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    if (!processing) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "Your plan is still being updated. Please wait.";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [processing]);

  const handleChoosePlan = async (planId: string) => {
    if (!canBill) {
      toastService.error("Only organization owners and admins can change billing.");
      return;
    }
    if (processing) return;

    try {
      setProcessing("checkout");
      const checkout = await subscriptionService.checkout(planId, billingPeriod);
      const result = checkout.data?.doc;
      if (!window.Razorpay) {
        toastService.error("Razorpay SDK is not loaded");
        setProcessing(null);
        return;
      }

      const options = {
        key: result?.keyId,
        amount: result?.order?.amount,
        currency: result?.order?.currency || "INR",
        name: "Kyra AI CRM",
        description: result?.plan?.name,
        order_id: result?.order?.id,
        modal: {
          ondismiss: () => {
            setProcessing(null);
          },
        },
        handler: async (response: any) => {
          setProcessing("activating");
          try {
            await subscriptionService.verifyPayment(response);
            await refresh();
            toastService.success("Your plan has been upgraded");
            navigate("/dashboard/settings/my-plan");
          } catch (error: any) {
            toastService.error(
              error?.message || "Payment could not be verified. Your plan was not changed.",
            );
          } finally {
            setProcessing(null);
          }
        },
        prefill: {
          email: user?.email,
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (failure: any) => {
        setProcessing(null);
        toastService.error(
          failure?.error?.description || "Payment failed. Please try again.",
        );
      });
      setProcessing(null);
      rzp.open();
    } catch (error: any) {
      setProcessing(null);
      toastService.error(error?.message || "Unable to start checkout");
    }
  };

  useEffect(() => {
    void loadPlans();
  }, []);

  const overlay =
    processing === "checkout"
      ? {
          title: "Preparing checkout",
          description: "Creating your secure payment order. Please wait.",
        }
      : processing === "activating"
        ? {
            title: "Upgrading your plan",
            description:
              "Payment received. We are activating your subscription now. This can take a few seconds.",
          }
        : null;

  return (
    <div className="pb-24">
      {overlay && (
        <PlanUpgradeOverlay title={overlay.title} description={overlay.description} />
      )}
      <div className="w-full flex flex-col justify-center items-center gap-2">
        <div className="self-stretch px-6 md:px-24 pt-12 md:pt-16 flex justify-center items-center gap-6">
          <div className="w-full max-w-5xl px-6 py-5 flex flex-col items-center gap-4">
            <div className="text-center text-gray-900 text-3xl md:text-4xl font-semibold">
              Choose the perfect plan for your business
            </div>
            <p className="text-center text-[#605A57] text-base">
              WhatsApp messaging is included. WhatsApp AI Agent is a premium capability.
            </p>
          </div>
        </div>

        <div className="py-6">
          <div className="p-0.5 bg-white rounded-[99px] border flex">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-1 rounded-[99px] ${billingPeriod === "monthly" ? "text-white bg-primary" : "text-gray-600"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-1 rounded-[99px] ${billingPeriod === "yearly" ? "text-white bg-primary" : "text-gray-600"}`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {plansLoading ? (
            <div className="md:col-span-3">
              <DataLoader className="h-64" />
            </div>
          ) : (
          plans.map((plan) => {
            const price =
              billingPeriod === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const isCurrent = subscription?.plan?.id === plan.id;
            return (
              <div
                key={plan.id}
                className={`rounded-[10px] p-8 flex flex-col border border-gray-300 ${plan.featured ? "scale-[1.02]" : ""}`}
              >
                <h3 className="text-xl font-semibold mb-2 capitalize">{plan.name}</h3>
                <p className="mb-6 text-gray-600">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₹{price}</span>
                  <span className="ml-1 text-sm text-gray-500">
                    / {billingPeriod === "yearly" ? "year" : "month"}
                  </span>
                </div>
                <button
                  disabled={isCurrent || !canBill || Boolean(processing)}
                  onClick={() => handleChoosePlan(plan.id)}
                  className="w-full py-3 mb-8 rounded-[10px] font-semibold bg-primary text-white disabled:opacity-60"
                >
                  {isCurrent ? "Current Plan" : plan.button || "Choose plan"}
                </button>
                <ul className="space-y-3 text-sm">
                  <li>Team members: {plan.limits?.teamMembers}</li>
                  <li>Chatbots: {plan.limits?.chatbots}</li>
                  <li>Leads / month: {plan.limits?.leadsPerMonth?.toLocaleString()}</li>
                  <li>
                    WhatsApp messages:{" "}
                    {plan.limits?.whatsappMessagesPerMonth?.toLocaleString()}
                  </li>
                  <li>Webhooks: {plan.limits?.webhooks}</li>
                  <li>
                    WhatsApp AI Agent:{" "}
                    {plan.featureMap?.WHATSAPP_AI_AGENT
                      ? `${plan.limits?.aiConversationsPerMonth?.toLocaleString()} conversations`
                      : "Not included"}
                  </li>
                </ul>
                <ul className="space-y-3 mt-6">
                  {(plan.features || []).map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
          )}
        </div>
      </div>
    </div>
  );
};
