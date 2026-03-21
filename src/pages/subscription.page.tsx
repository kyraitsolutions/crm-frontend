import { PaymentService } from "@/services/payment.service";
import { SubscriptionService } from "@/services/subscription.service";
import { useAuthStore } from "@/stores";
import axios from "axios";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";


declare global {
  interface Window {
    Razorpay: any;
  }
}
export interface SubscriptionPlan {
  _id: string;
  name: string;
  accounts: string;
  maxAccounts: number;
  maxChatbots: number;
  maxWebforms: number;

  description: string;
  price: { monthly: number; annually: number }; // or number if backend sends number
  period: string;
  button: string;
  featured: boolean;
  features: string[];
  addons?: string[];
}

export const SubscriptionPage = () => {


  const subscriptionService = new SubscriptionService();
  const paymentService = new PaymentService();
  const { user: authUser } = useAuthStore((state) => state);
  const [plans, setPlans] = useState<SubscriptionPlan[] | []>([]);

  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly")



  const getSubscription = async () => {
    try {
      const response = await subscriptionService.getAllSubscription();
      setPlans(response.data.docs);

    } catch (error) {
      console.log("Error", error);
    }
  };


  const handleChoosePlan = async (id: string) => {
    await handlePayment(id);
  }

  const handlePayment = async (id: string) => {
    console.log("Id:", id);
    // 1. Create order from backend
    const amount = 799;
    const data = await paymentService.createOrder(amount);
    const result=data.data.docs
    console.log("Data", data.data);
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }

    const options = {
      key: "rzp_test_xxxxx", // test key
      amount: result.amount,
      currency: "INR",
      name: "Your Company",
      description: "Starter Plan",
      order_id: result.id,

      handler: function (response:any) {
        console.log("Payment Success:", response);
      },

      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999",
      },

      theme: {
        color: "#4f46e5",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  useEffect(() => {
    getSubscription();
  }, []);

  return (
    <div className="pb-24">
      <div className="w-full flex flex-col justify-center items-center gap-2">
        {/* Header Section */}
        <div className="self-stretch px-6 md:px-24 pt-12 md:pt-16  flex justify-center items-center gap-6">
          <div className="w-full max-w-5xl px-6 py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4 shadow-none">
            {/* Pricing Badge */}
            <div className="px-[14px] py-[6px] bg-white  overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
              <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 1V11M8.5 3H4.75C4.28587 3 3.84075 3.18437 3.51256 3.51256C3.18437 3.84075 3 4.28587 3 4.75C3 5.21413 3.18437 5.65925 3.51256 5.98744C3.84075 6.31563 4.28587 6.5 4.75 6.5H7.25C7.71413 6.5 8.15925 6.68437 8.48744 7.01256C8.81563 7.34075 9 7.78587 9 8.25C9 8.71413 8.81563 9.15925 8.48744 9.48744C8.15925 9.81563 7.71413 10 7.25 10H3.5"
                    stroke="#16A34A"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-center flex justify-center flex-col text-[#16A34A] text-xs font-medium leading-3 font-sans">
                Plans & Pricing
              </div>
            </div>

            {/* Title */}
            <div className="self-stretch text-center flex justify-center flex-col text-gray-900 text-3xl md:text-6xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
              Choose the perfect plan for your business
            </div>

            <div className="self-stretch text-center text-[#605A57] text-base font-normal leading-7 font-sans">
              Scale your operations with flexible pricing that grows with your team.
              <br />
              Start free, upgrade when you're ready.
            </div>
          </div>
        </div>

        <div className="self-stretch px-6 md:px-16 py-9 relative flex justify-center items-center gap-4">

          <div >
            <div className="p-[2px] bg-[#ffffff] shadow-[0px_1px_0px_white] rounded-[99px] border-[0.5px] border-[rgba(55,50,47,0.08)] flex justify-center items-center gap-[2px] relative">


              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-1 rounded-[99px] whitespace-nowrap flex justify-center items-center gap-2 transition-colors duration-300 relative z-10 flex-1 ${billingPeriod === "monthly" ? "text-white bg-primary" : "text-gray-600"}`}
              >

                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annually")}
                className={`px-4 py-1 rounded-[99px] whitespace-nowrap flex justify-center items-center gap-2 transition-colors duration-300 relative z-10 flex-1 ${billingPeriod === "annually" ? "text-white bg-primary" : "text-gray-600"}`}
              >

                Annually (Save 30%)
              </button>


            </div>

          </div>
        </div>



        <div className="max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan._id} >
              <PricingCard
                id={plan._id}
                featured={plan.featured}
                title={plan.name === "starter" ? "Free Forever" : plan.name === "professional" ? "Professional" : "Enterprise"}
                desc={plan.description}
                price={plan?.price[billingPeriod as keyof typeof plan.price]}
                period={plan.period}
                button={plan.button}
                features={plan.features}
                addons={plan.addons}
                handleChoosePlan={handleChoosePlan}
                authUser={authUser}
              />
            </div>
          ))}

        </div>




      </div>

    </div>
  );
};




function PricingCard({
  id,
  title,
  desc,
  price,
  period,
  authUser,
  button,
  features,
  featured = false,
  addons,
  handleChoosePlan
}: any) {


  console.log(authUser);
  return (
    <div
      className={`rounded-[10px] h-full p-8 flex flex-col border border-gray-300 justify-between shadow-sm transition
        ${featured === true
          ? "bg-white scale-[1.02]"
          : "bg-white"
        }`}
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className={`mb-6 text-gray-600`}>
          {desc}
        </p>

        <div className="mb-6">
          <span className="text-4xl font-bold">
            ₹{price}
          </span>
          <span className={`ml-1 text-sm text-gray-500`}>
            {period}
            {/* {billingPeriod === "monthly" ? "month" : "year"} */}
          </span>
        </div>

        <button
          onClick={() => handleChoosePlan(id)}
          className={`w-full py-3 mb-8 rounded-[10px] font-semibold transition
            
          ${featured === true
              ? "bg-[#16A34A] text-white hover:bg-[#15803D] cursor-pointer"
              : id === authUser?.usersubscription?.planId ? "bg-white border-2 border-gray-600 text-gray-600 hover:shadow-md disabled:" : "bg-white border-2 border-gray-600 text-gray-600 hover:shadow-md cursor-pointer"
            }
              `}
        >
          {id === authUser?.usersubscription?.planId ? "Current Plan" : button}
        </button>

        <ul className="space-y-3 ">
          {features.map((f: string, i: number) => (
            <li key={i} className="flex items-center gap-3">
              <Check className={`w-4 h-4 text-[#16A34A]`} />
              {/* <span className={`w-2 h-2 rounded-full ${featured ? "bg-white" : "bg-[#16A34A]"}`} /> */}
              <span className="text-gray-700">
                {f}
              </span>
            </li>
          ))}
        </ul>
        <div>
          <p className="font-medium mt-4 mb-2">Paid Add-ons</p>
          <ul className="space-y-3 mb-8 text-gray-600">
            {addons?.map((addon: string) => (
              <li key={addon} className="flex items-center gap-3">
                <Check className={`w-4 h-4 text-[#16A34A]`} />
                <span className="text-gray-700">{addon}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>


    </div>
  )
}


// const HelpPopup = () => {
//   return (
//     <div
//       className="
//     pointer-events-none
//     absolute bottom-full left-1/2 mb-3 -translate-x-1/2
//     hidden group-hover:block
//     z-50
//     w-[220px]
//     rounded-xl
//     border border-gray-200
//     bg-white
//     px-4 py-3
//     text-left
//     text-xs
//     text-gray-700
//     shadow-xl
//   "
//     >
//       Arrow
//       <div className="absolute left-1/2 top-full -translate-x-1/2">
//         <div className="h-2 w-2 rotate-45 border-b border-r border-gray-200 bg-white" />
//       </div>

//       <p className="font-semibold text-gray-900">
//         Current Plan
//       </p>
//       <p className="mt-1 text-gray-600 leading-relaxed">
//         This plan is already active on your account. You can upgrade anytime.
//       </p>
//     </div>

//   )
// }