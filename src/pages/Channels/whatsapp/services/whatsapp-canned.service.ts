import { ApiService } from "@/services";
import type { ApiResponse } from "@/types";
import type {
  TCannedMessage,
  UpsertCannedMessagePayload,
} from "../types/canned-message.type";

export class WhatsAppCannedMessageService extends ApiService {
  private base(accountId: string) {
    return `/whatsapp/account/${accountId}/canned-messages`;
  }

  list(
    accountId: string,
    query: { search?: string; status?: string } = {},
  ): Promise<ApiResponse<TCannedMessage>> {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.status) params.set("status", query.status);
    const suffix = params.toString() ? `?${params.toString()}` : "";
    return this.get<TCannedMessage>(`${this.base(accountId)}${suffix}`);
  }

  create(accountId: string, payload: UpsertCannedMessagePayload) {
    return this.post<TCannedMessage>(this.base(accountId), payload);
  }

  update(accountId: string, id: string, payload: UpsertCannedMessagePayload) {
    return this.put<TCannedMessage>(`${this.base(accountId)}/${id}`, payload);
  }

  remove(accountId: string, id: string) {
    return this.delete<TCannedMessage>(`${this.base(accountId)}/${id}`);
  }

  toggleFavourite(accountId: string, id: string) {
    return this.post<TCannedMessage>(`${this.base(accountId)}/${id}/favourite`);
  }

  markUsed(accountId: string, id: string) {
    return this.post<TCannedMessage>(`${this.base(accountId)}/${id}/use`);
  }
}

export const whatsappCannedMessageService = new WhatsAppCannedMessageService();
