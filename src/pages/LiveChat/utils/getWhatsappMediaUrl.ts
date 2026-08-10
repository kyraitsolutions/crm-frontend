import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { api } from "@/services";

// utils/getWhatsappMediaUrl.ts
export const getWhatsappMediaUrl = (accountId: string, mediaId: string) => {
  return `${api.getBaseUrl()}${API_ENDPOINT_PATH.WHATSAPP.MEDIA.getMediaPath(
    accountId,
    mediaId,
  )}`;
};
