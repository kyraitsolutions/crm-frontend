import type { ApiResponse } from "@/types";
import type {
  OrganizationSubscriptionSnapshot,
  SubscriptionPlanView,
} from "@/types/subscription.type";
import { ApiService } from "./api.service";

export class SubscriptionService extends ApiService {
  async getCurrent(): Promise<ApiResponse<OrganizationSubscriptionSnapshot>> {
    return this.get("/subscription");
  }

  async getPlans(): Promise<ApiResponse<SubscriptionPlanView>> {
    return this.get("/subscription/plans");
  }

  async getAllSubscription(): Promise<ApiResponse<SubscriptionPlanView>> {
    return this.getPlans();
  }

  async checkout(planId: string, interval: "monthly" | "yearly") {
    return this.post("/subscription/checkout", { planId, interval });
  }

  async verifyPayment(payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    return this.post("/subscription/payment/verify", payload);
  }

  async cancel() {
    return this.post("/subscription/cancel");
  }

  async acknowledgeExpiration() {
    return this.post("/subscription/expiration-prompt/acknowledge");
  }

  async getPayments() {
    return this.get("/subscription/payments");
  }
}
