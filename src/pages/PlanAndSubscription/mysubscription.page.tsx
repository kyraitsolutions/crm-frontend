import { UsageMeter } from "@/components/subscription/UsageMeter";
import { FEATURE, FEATURE_LABELS } from "@/constants/subscription.constant";
import { BILLING_ROLES } from "@/constants/subscription.constant";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionService } from "@/services/subscription.service";
import { useAuthStore } from "@/stores";
import type {
  SubscriptionPaymentRecord,
  SubscriptionPaymentSummary,
} from "@/types/subscription.type";
import { CalendarDays, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { ToastMessageService } from "@/services";
import DataLoader from "@/components/Loader/data-loader";
import { useEffect, useState } from "react";

const MySubscriptionPage = () => {
  const { user } = useAuthStore((state) => state);
  const { subscription, loading, refresh } = useSubscription();
  const toastService = new ToastMessageService();
  const canBill = BILLING_ROLES.includes(String(user?.role?.name || "").toUpperCase());
  const [payments, setPayments] = useState<SubscriptionPaymentRecord[]>([]);
  const [summary, setSummary] = useState<SubscriptionPaymentSummary | null>(null);

  const loadPayments = async () => {
    if (!canBill) return;
    try {
      const response = await new SubscriptionService().getPayments();
      setPayments(response.data?.docs || []);
      setSummary((response.data as any)?.summary || null);
    } catch {
      // Team members are blocked from billing APIs.
    }
  };

  useEffect(() => {
    void loadPayments();
  }, [canBill]);

  const cancel = async () => {
    try {
      await new SubscriptionService().cancel();
      await refresh();
      toastService.success("Cancellation scheduled at period end");
    } catch (error: any) {
      toastService.error(error?.message || "Unable to cancel");
    }
  };

  if (loading) {
    return <DataLoader className="h-[calc(100vh-180px)]" />;
  }

  if (!subscription) {
    return (
      <div className="p-6">
        <p className="text-slate-600">No subscription found.</p>
        <Link className="text-primary" to="/dashboard/settings/subscription">
          View plans
        </Link>
      </div>
    );
  }

  const usage = subscription.usage;
  const limits = subscription.limits;

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen space-y-6">
      <div>
        <h1 className="text-base font-semibold text-slate-800">Subscription</h1>
        <p className="text-slate-500 text-sm">Current plan, trial, usage and features</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Crown className="text-primary" size={28} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 capitalize">
                {subscription.plan?.name} plan
              </h2>
              <p className="text-slate-500 text-sm capitalize">
                Status: {subscription.status}
              </p>
            </div>
          </div>

          {subscription.isTrial && (
            <p className="text-sm text-sky-800 bg-sky-50 rounded-lg p-3 mb-4">
              Trial ends in {subscription.trial.daysRemaining} days.
            </p>
          )}

          <div className="space-y-4">
            <UsageMeter label="Team members" used={usage.teamMembers} limit={limits.teamMembers} />
            <UsageMeter label="Chatbots" used={usage.chatbots} limit={limits.chatbots} />
            <UsageMeter label="Leads" used={usage.leads} limit={limits.leadsPerMonth} />
            <UsageMeter
              label="WhatsApp messages"
              used={usage.whatsappMessages}
              limit={limits.whatsappMessagesPerMonth}
            />
            <UsageMeter
              label="AI conversations"
              used={usage.aiConversations}
              limit={limits.aiConversationsPerMonth}
            />
            <UsageMeter label="Webhooks" used={usage.webhooks} limit={limits.webhooks} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-700">
            <CalendarDays size={18} />
            <span className="font-medium">Billing</span>
          </div>
          <p className="text-sm text-slate-500">
            Period ends {new Date(subscription.billing.currentPeriodEnd).toLocaleString()}
          </p>
          {subscription.billing.cancelAtPeriodEnd && (
            <p className="text-sm text-amber-700">Cancels at period end.</p>
          )}
          <Link
            to="/dashboard/settings/subscription"
            className="block text-center rounded-lg bg-primary text-white py-2 text-sm"
          >
            View Plans
          </Link>
          {canBill && subscription.isActive && !subscription.billing.cancelAtPeriodEnd && (
            <button
              onClick={() => void cancel()}
              className="w-full text-sm text-slate-500 underline"
            >
              Cancel at period end
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-medium mb-4">Features</h3>
        <ul className="grid md:grid-cols-2 gap-3 text-sm">
          {Object.entries(FEATURE).map(([, key]) => (
            <li key={key} className="flex items-center justify-between border rounded-lg px-3 py-2">
              <span>{FEATURE_LABELS[key]}</span>
              <span className={subscription.features[key] ? "text-green-600" : "text-slate-400"}>
                {subscription.features[key]
                  ? key === FEATURE.WHATSAPP_AI_AGENT
                    ? "Premium"
                    : "Included"
                  : "Locked"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {canBill && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-medium">Payment history</h3>
          {summary && (
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border p-3">
                <p className="text-slate-500">Total captured</p>
                <p className="font-semibold">
                  {summary.currency} {summary.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-slate-500">This month</p>
                <p className="font-semibold">
                  {summary.currency} {summary.thisMonthRevenue.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-slate-500">Successful payments</p>
                <p className="font-semibold">{summary.capturedCount}</p>
              </div>
            </div>
          )}
          {payments.length === 0 ? (
            <p className="text-sm text-slate-500">No payments recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500">
                  <tr>
                    <th className="py-2">Date</th>
                    <th className="py-2">Plan</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Payment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-t">
                      <td className="py-2 whitespace-nowrap">
                        {new Date(payment.paidAt || payment.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 capitalize">
                        {payment.planName || payment.planCode || "—"}
                        {payment.interval ? ` · ${payment.interval}` : ""}
                      </td>
                      <td className="py-2">
                        {payment.currency} {Number(payment.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-2 capitalize">{payment.status}</td>
                      <td className="py-2 text-slate-500">
                        {payment.razorpayPaymentId || payment.razorpayOrderId || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MySubscriptionPage;
