import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";
import { API_ENDPOINT_PATH } from "@/constants/api's-path";

export class MediaService extends ApiService {
  async getMediaUploadPresignedUrl(data: any): Promise<ApiResponse<any>> {
    return await this.post(
      API_ENDPOINT_PATH.MEDIA.GET_MEDIA_UPLOAD_PRESIGNED_URL,
      data,
    );
  }
}
