import { SubscriptionService } from "@/services/subscription.service";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";

export interface SubscriptionPlan {
  _id: string;
  name: string;
  maxAccounts: number;
  maxChatbots: number;
  maxWebforms: number;
  description: string;
  price: string; // or number if backend sends number
  accounts: string;
  features: string[];
  highlight?: boolean;
}

export const SubscriptionPage = () => {


  const subscriptionService = new SubscriptionService();
  const { user: authUser } = useAuthStore((state) => state);
  const [plans, setPlans] = useState<SubscriptionPlan[] | []>([]);

  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly")

  const [pricing, setpricing] = useState<{
    starter: { monthly: number; annually: number };
    professional: { monthly: number; annually: number };
    enterprise: { monthly: number; annually: number };
  }>({
    starter: {
      monthly: 0,
      annually: 0,
    },
    professional: {
      monthly: 20,
      annually: 16, // 20% discount for annual
    },
    enterprise: {
      monthly: 200,
      annually: 160, // 20% discount for annual
    },
  })

  const ANNUAL_DISCOUNT = 0.8;

  const buildPricingFromPlans = (plans: any[]) => {
    const pricing: any = {};

    plans.forEach((plan) => {
      pricing[plan.name] = {
        monthly: plan.price,
        annually: Math.round(plan.price * 12 * ANNUAL_DISCOUNT),
      };
    });

    return pricing;
  };


  const getSubscription = async () => {
    try {
      const reponse = await subscriptionService.getAllSubscription();
      setPlans(reponse.data.docs);
      const computedPricing = buildPricingFromPlans(reponse.data.docs);
      setpricing(computedPricing);

    } catch (error) {
      console.log("Error", error);
    }
  };


  // const handleChoosePlan = (id:) => {
  //   alert(id)
  // }


  useEffect(() => {
    getSubscription();
  }, []);


  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="pb-24">
      <div className="w-full flex flex-col justify-center items-center gap-2">
        {/* Header Section */}
        <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
          <div className="w-full max-w-[586px] px-6 py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4 shadow-none">
            {/* Pricing Badge */}
            <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
              <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 1V11M8.5 3H4.75C4.28587 3 3.84075 3.18437 3.51256 3.51256C3.18437 3.84075 3 4.28587 3 4.75C3 5.21413 3.18437 5.65925 3.51256 5.98744C3.84075 6.31563 4.28587 6.5 4.75 6.5H7.25C7.71413 6.5 8.15925 6.68437 8.48744 7.01256C8.81563 7.34075 9 7.78587 9 8.25C9 8.71413 8.81563 9.15925 8.48744 9.48744C8.15925 9.81563 7.71413 10 7.25 10H3.5"
                    stroke="#37322F"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
                Plans & Pricing
              </div>
            </div>

            {/* Title */}
            <div className="self-stretch text-center flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
              Choose the perfect plan for your business
            </div>

            {/* Description */}
            <div className="self-stretch text-center text-[#605A57] text-base font-normal leading-7 font-sans">
              Scale your operations with flexible pricing that grows with your team.
              <br />
              Start free, upgrade when you're ready.
            </div>
          </div>
        </div>

        {/* Billing Toggle Section */}
        <div className="self-stretch px-6 md:px-16 py-9 relative flex justify-center items-center gap-4">
          {/* Horizontal line */}
          <div className="w-full max-w-[1060px] h-0 absolute left-1/2 transform -translate-x-1/2 top-[63px] border-t border-[rgba(55,50,47,0.12)] z-0"></div>

          {/* Toggle Container */}
          <div className="p-3 relative bg-[rgba(55,50,47,0.03)] border border-[rgba(55,50,47,0.02)] backdrop-blur-[44px] backdrop-saturate-150 backdrop-brightness-110 flex justify-center items-center rounded-lg z-20 before:absolute before:inset-0 before:bg-white before:opacity-60 before:rounded-lg before:-z-10">
            <div className="p-[2px] bg-[rgba(55,50,47,0.10)] shadow-[0px_1px_0px_white] rounded-[99px] border-[0.5px] border-[rgba(55,50,47,0.08)] flex justify-center items-center gap-[2px] relative">
              <div
                className={`absolute top-[2px] w-[calc(50%-1px)] h-[calc(100%-4px)] bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.08)] rounded-[99px] transition-all duration-300 ease-in-out ${billingPeriod === "annually" ? "left-[2px]" : "right-[2px]"
                  }`}
              />

              <button
                onClick={() => setBillingPeriod("annually")}
                className="px-4 py-1 rounded-[99px] flex justify-center items-center gap-2 transition-colors duration-300 relative z-10 flex-1"
              >
                <div
                  className={`text-[13px] font-medium leading-5 font-sans transition-colors duration-300 ${billingPeriod === "annually" ? "text-[#37322F]" : "text-[#6B7280]"
                    }`}
                >
                  Annually
                </div>
              </button>

              <button
                onClick={() => setBillingPeriod("monthly")}
                className="px-4 py-1 rounded-[99px] flex justify-center items-center gap-2 transition-colors duration-300 relative z-10 flex-1"
              >
                <div
                  className={`text-[13px] font-medium leading-5 font-sans transition-colors duration-300 ${billingPeriod === "monthly" ? "text-[#37322F]" : "text-[#6B7280]"
                    }`}
                >
                  Monthly
                </div>
              </button>
            </div>

            {/* Decorative dots */}
            <div className="w-[3px] h-[3px] absolute left-[5px] top-[5.25px] bg-[rgba(55,50,47,0.10)] shadow-[0px_0px_0.5px_rgba(0,0,0,0.12)] rounded-[99px]"></div>
            <div className="w-[3px] h-[3px] absolute right-[5px] top-[5.25px] bg-[rgba(55,50,47,0.10)] shadow-[0px_0px_0.5px_rgba(0,0,0,0.12)] rounded-[99px]"></div>
            <div className="w-[3px] h-[3px] absolute left-[5px] bottom-[5.25px] bg-[rgba(55,50,47,0.10)] shadow-[0px_0px_0.5px_rgba(0,0,0,0.12)] rounded-[99px]"></div>
            <div className="w-[3px] h-[3px] absolute right-[5px] bottom-[5.25px] bg-[rgba(55,50,47,0.10)] shadow-[0px_0px_0.5px_rgba(0,0,0,0.12)] rounded-[99px]"></div>
          </div>
        </div>

        {/* Pricing Cards Section */}
        <div className="self-stretch border-b border-t border-[rgba(55,50,47,0.12)] flex justify-center items-center">
          <div className="flex justify-center items-start w-full">
            {/* Left Decorative Pattern */}
            <div className="w-12 xl:w-52 self-stretch relative overflow-hidden hidden md:block">
              <div className="w-[162px] lg:w-[360px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                {Array.from({ length: 200 }).map((_, i) => (
                  <div
                    key={i}
                    className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                  ></div>
                ))}
              </div>
            </div>

            {/* Pricing Cards Container */}

            <div className="flex-1 flex flex-col md:flex-row justify-center items-center gap-6 py-12 md:py-0">
              {/* Starter Plan */}
              {plans.map((plan) => (
                <div key={plan._id} className={` relative  flex-1 ${plan.name === "professional" ? "bg-[#37322F]" : "bg-[rgba(255,255,255,0)]"} max-w-full md:max-w-none self-stretch px-6 py-5 border-l border-r border-[rgba(50,45,43,0.12)] flex flex-col justify-start items-start gap-12`}>

                  {/* Current Plan tag */}
                  {plan._id === authUser?.usersubscription.planId && <span className="absolute -top-4.5 left-[30%] transform translate-0 bg-gray-200 text-xs py-2 px-3 rounded-full font-medium border-2 border-gray-300">Current Active Plan</span>}
                  {/* Plan Header */}
                  <div className="self-stretch flex flex-col justify-start items-center gap-9" >
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <div className={`${plan.name === "professional" ? "text-[#FBFAF9]" : "text-[rgba(55,50,47,0.90)]"} text-lg font-medium leading-7 font-sans capitalize`}>{plan.name}</div>
                      <div className={`w-full max-w-[242px] ${plan.name === "professional" ? "text-[#B2AEA9]" : "text-[rgba(55,50,47,0.90)]"} text-sm font-normal leading-5 font-sans`}>
                        Perfect for individuals and small teams getting started.
                      </div>
                    </div>

                    <div className="self-stretch flex flex-col justify-start items-start gap-2" >
                      <div className="flex flex-col w-full justify-start items-start gap-1">
                        <div className={`${plan.name === "professional" ? "text-[#FBFAF9]" : "text-[rgba(55,50,47,0.90)]"} relative w-full flex items-center text-4xl font-medium font-serif`}>
                          <span className="invisible">{formatPrice(Number(plan.price))}</span>
                          <span
                            className="absolute inset-0  flex items-center gap-2 transition-all duration-500"
                            style={{
                              opacity: billingPeriod === "annually" ? 1 : 0,
                              transform: `scale(${billingPeriod === "annually" ? 1 : 0.8})`,
                              filter: `blur(${billingPeriod === "annually" ? 0 : 4}px)`,
                            }}
                            aria-hidden={billingPeriod !== "annually"}
                          >
                            {formatPrice(pricing[plan.name as keyof typeof pricing][billingPeriod])}
                          </span>
                          <span
                            className="absolute inset-0 flex items-center transition-all duration-500"
                            style={{
                              opacity: billingPeriod === "monthly" ? 1 : 0,
                              transform: `scale(${billingPeriod === "monthly" ? 1 : 0.8})`,
                              filter: `blur(${billingPeriod === "monthly" ? 0 : 4}px)`,
                            }}
                            aria-hidden={billingPeriod !== "monthly"}
                          >
                            {formatPrice(pricing[plan.name as keyof typeof pricing].monthly)}
                          </span>
                        </div>
                        <div className={` ${plan.name === "professional" ? "text-[#D2C6BF]" : "text-[#847971]"} text-sm font-medium font-sans`}>
                          Per {billingPeriod === "monthly" ? "month" : "year"}, {plan.maxAccounts === 0 ? "Base" : plan.maxAccounts} Account.
                        </div>
                      </div>
                    </div>

                    <div className="relative group self-stretch">
                      <button
                        // onClick={() => plan._id !== authUser?.usersubscription.planId && handleChoosePlan(authUser?.id)}
                        disabled={plan._id === authUser?.usersubscription.planId}
                        className={`relative flex w-full items-center justify-center rounded-[99px] overflow-hidden px-4 py-[10px]
                        shadow-[0px_2px_4px_rgba(55,50,47,0.12)]
                        ${plan.name === "professional" ? "bg-[#FBFAF9]" : "bg-[#37322F]"}
                        ${plan._id === authUser?.usersubscription.planId ? "cursor-help" : "cursor-pointer"}
                      `}
                      >
                        {/* Gradient overlay */}
                        <div className="pointer-events-none absolute left-0 top-[-0.5px] h-[41px] w-full bg-gradient-to-b from-[rgba(255,255,255,0.20)] to-[rgba(0,0,0,0.10)] mix-blend-multiply" />

                        {/* Button text */}
                        <span
                          className={`relative z-10 text-[13px] font-medium leading-5 ${plan.name === "professional" ? "text-[#37322F]" : "text-[#FBFAF9]"}`}
                        >
                          {plan.name === "starter"
                            ? "Start for free"
                            : plan.name === "professional"
                              ? "Get started"
                              : "Contact sales"}
                        </span>
                      </button>

                      {/* Tooltip */}
                      {plan._id === authUser?.usersubscription.planId && <HelpPopup />}
                    </div>
                  </div>

                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="self-stretch flex justify-start items-center gap-[13px]">
                        <div className="w-4 h-4 relative flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="#9CA3AF"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className={`${plan.name === "professional" ? "text-[#F0EFEE]" : "text-[rgba(55,50,47,0.80)]"} flex-1  text-[12.5px] font-normal leading-5 font-sans`}>
                          {feature}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Decorative Pattern */}
            <div className="w-12 xl:w-52 self-stretch relative overflow-hidden hidden md:block">
              <div className="w-[162px] lg:w-[360px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                {Array.from({ length: 200 }).map((_, i) => (
                  <div
                    key={i}
                    className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};


const HelpPopup = () => {
  return (
    <div
      className="
    pointer-events-none
    absolute bottom-full left-1/2 mb-3 -translate-x-1/2
    hidden group-hover:block
    z-50
    w-[220px]
    rounded-xl
    border border-gray-200
    bg-white
    px-4 py-3
    text-left
    text-xs
    text-gray-700
    shadow-xl
  "
    >
      {/* Arrow
      <div className="absolute left-1/2 top-full -translate-x-1/2">
        <div className="h-2 w-2 rotate-45 border-b border-r border-gray-200 bg-white" />
      </div> */}

      {/* Content */}
      <p className="font-semibold text-gray-900">
        Current Plan
      </p>
      <p className="mt-1 text-gray-600 leading-relaxed">
        This plan is already active on your account. You can upgrade anytime.
      </p>
    </div>

  )
}