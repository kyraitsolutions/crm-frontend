import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";

export class PaymentService extends ApiService {
  async createOrder(amount:number): Promise<ApiResponse<any>> {
    return await this.post("/payment/create-order",{amount:amount});
  }
}