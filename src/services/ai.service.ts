import type { ApiResponse } from '@/types';
import { ApiService } from "./api.service";

export class AIService extends ApiService{
    async createTemplateWithAI(accountId:string,aiPrompt:string):Promise<ApiResponse<any>>{
        return await this.post(`account/${accountId}/ai-template`,{aiPrompt});
    }
}