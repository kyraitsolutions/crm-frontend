import { ApiService } from "@/services";
import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import type { ApiResponse } from "@/types";

export class RecyclebinService extends ApiService {
  list(accountId: string): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINT_PATH.RECYCLEBIN.list(accountId));
  }

  restore(accountId: string, ids: string[]): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINT_PATH.RECYCLEBIN.restore(accountId), { ids });
  }

  remove(accountId: string, ids: string[]): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINT_PATH.RECYCLEBIN.remove(accountId), { ids });
  }

  empty(accountId: string): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINT_PATH.RECYCLEBIN.empty(accountId), {});
  }
}

export const recyclebinService = new RecyclebinService();
