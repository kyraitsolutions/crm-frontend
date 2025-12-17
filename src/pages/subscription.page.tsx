import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionService } from "@/services/subscription.service";
import { useAuthStore } from "@/stores";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

export const SubscriptionPage = () => {
  const subscriptionService = new SubscriptionService();
  const { user: authUser } = useAuthStore((state) => state);
  const [plans, setPlans] = useState();

  const getSubscription = async () => {
    try {
      const reponse = await subscriptionService.getAllSubscription();
      setPlans(reponse.data.docs);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getSubscription();
  }, []);

  console.log(plans);
  return (
    <div className="py-2">
      <CardHeader>
        <CardTitle className="text-2xl">Subscription Plans</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {plans?.map((plan) => (
          <div
            key={plan.name}
            // whileHover={{ scale: 1.03 }}
            className={`border shadow-sm p-6 flex flex-col justify-between ${
              plan.highlight ? "border-primary shadow-lg" : ""
            }`}
          >
            <div>
              <h3 className="text-xl font-semibold">
                {plan.name === "payg" ? "pay as you go" : plan.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {plan.description}
              </p>

              <div className="my-4">
                <p className="text-3xl font-bold">{plan.price}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.accounts}
                </p>
              </div>

              <ul className="space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              className="mt-6 w-full"
              variant={
                plan._id === authUser?.usersubscription.planId
                  ? "secondary"
                  : "default"
              }
              disabled={plan._id === authUser?.usersubscription.planId}
            >
              {plan._id === authUser?.usersubscription.planId
                ? "Current Plan"
                : "Choose Plan"}
            </Button>
          </div>
        ))}
      </CardContent>
    </div>
  );
};
