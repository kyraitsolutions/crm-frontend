import { SubscriptionPlan } from "@/enums/subscription.enum"
import { useAuthStore } from "@/stores"
import { CalendarDays, Clock3, CreditCard, Crown } from "lucide-react";

const MySubscriptionPage = () => {

    const { user } = useAuthStore((state) => state);

    const subscription = user?.subscription;

    const planName = subscription?.planId ? SubscriptionPlan[subscription.planId] : undefined;
    const startDate = subscription?.startedAt
        ? new Date(subscription.startedAt)
        : null;

    const expiryDate = subscription?.expiresAt
        ? new Date(subscription.expiresAt)
        : null;

    const now = new Date();

    const totalDays =
        startDate && expiryDate
            ? Math.ceil(
                (expiryDate.getTime() - startDate.getTime()) /
                (1000 * 60 * 60 * 24)
            )
            : 0;

    const daysLeft = expiryDate
        ? Math.max(
            Math.ceil(
                (expiryDate.getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            ),
            0
        )
        : 0;

    const usedDays = totalDays - daysLeft;

    const progress =
        totalDays > 0 ? (usedDays / totalDays) * 100 : 0;
    return (
        <div className="p-6 bg-[#f8fafc] min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-md font-semibold text-slate-800 text-sm">
                    My Subscription
                </h1>
                <p className="text-slate-500 mt-1 text-xs">
                    Manage your plan and billing details
                </p>
            </div>

            {/* Main Subscription Card */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Left Side */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Crown className="text-primary" size={28} />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold text-slate-800 text-sm">
                                        {planName} Plan
                                    </h2>

                                    <p className="text-slate-500 text-sm capitalize">
                                        Status:{" "}
                                        <span className="text-green-600 font-medium">
                                            {subscription?.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button className="px-3 py-1.5 rounded-xl bg-primary text-sm text-white font-medium hover:opacity-90 transition">
                            Upgrade Plan
                        </button>
                    </div>

                    {/* Progress */}
                    <div className="mt-8">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-600">
                                Subscription Usage
                            </span>

                            <span className="text-sm font-semibold text-primary">
                                {daysLeft} days left
                            </span>
                        </div>

                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-primary h-full rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="flex justify-between mt-2 text-sm text-slate-500 text-sm">
                            <span>
                                Started:{" "}
                                {startDate?.toLocaleDateString("en-IN")}
                            </span>

                            <span>
                                Expires:{" "}
                                {expiryDate?.toLocaleDateString("en-IN")}
                            </span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="border border-slate-200 rounded-2xl p-5">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-3 rounded-xl">
                                    <CalendarDays
                                        className="text-blue-600"
                                        size={22}
                                    />
                                </div>

                                <div>
                                    <p className="text-slate-500 text-sm text-sm">
                                        Start Date
                                    </p>

                                    <h3 className="font-semibold text-slate-800 text-sm">
                                        {startDate?.toLocaleDateString("en-IN")}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="border border-slate-200 rounded-2xl p-5">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-100 p-3 rounded-xl">
                                    <Clock3
                                        className="text-orange-600"
                                        size={22}
                                    />
                                </div>

                                <div>
                                    <p className="text-slate-500 text-sm text-sm">
                                        Days Left
                                    </p>

                                    <h3 className="font-semibold text-slate-800 text-sm">
                                        {daysLeft} Days
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="border border-slate-200 rounded-2xl p-5">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-3 rounded-xl">
                                    <CreditCard
                                        className="text-green-600"
                                        size={22}
                                    />
                                </div>

                                <div>
                                    <p className="text-slate-500 text-sm text-sm">
                                        Credits
                                    </p>

                                    <h3 className="font-semibold text-slate-800 text-sm">
                                        {subscription?.credits || 0}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-md font-semibold text-slate-800 text-sm">
                        Subscription Details
                    </h2>

                    <div className="space-y-5 mt-6">
                        <div className="flex justify-between">
                            <span className="text-slate-500 text-sm">Organization</span>
                            <span className="font-medium text-slate-800 text-sm">
                                {user?.organization?.name}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500 text-sm">Plan Type</span>
                            <span className="font-medium text-slate-800 text-sm">
                                {planName}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500 text-sm">Status</span>
                            <span className="text-green-600 font-medium capitalize">
                                {subscription?.status}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500 text-sm">
                                Renewal Date
                            </span>
                            <span className="font-medium text-slate-800 text-sm">
                                {expiryDate?.toLocaleDateString("en-IN")}
                            </span>
                        </div>
                    </div>

                    {/* Alert */}
                    <div className="mt-8 rounded-2xl bg-orange-50 border border-orange-200 p-4">
                        <p className="text-orange-700 font-medium">
                            Trial expires in {daysLeft} days
                        </p>

                        <p className="text-sm text-orange-600 mt-1">
                            Upgrade your plan to avoid interruption in
                            services.
                        </p>
                    </div>

                    <button className="w-full mt-5 bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90 transition">
                        Manage Billing
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MySubscriptionPage