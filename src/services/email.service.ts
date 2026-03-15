import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";
import type { EmailTemplateData } from "@/types/email.type";

interface CreateAccountPayload {
    accountName: string;
    email: string;
}

export class EmailService extends ApiService {
    async createSubscriber(accountId: string,data: CreateAccountPayload): Promise<ApiResponse<any>> {
        return await this.post(`/account/${accountId}/subscriber`, data);
    }


    async getSubscribers(
        accountId: string,
        // params: Record<string, any>
    ): Promise<ApiResponse<any>> {
        // const queryString = new URLSearchParams(
        //     Object.entries(params).reduce((acc, [key, val]) => {
        //         if (val !== undefined && val !== null) {
        //             acc[key] = String(val);
        //         }
        //         return acc;
        //     }, {} as Record<string, string>)
        // ).toString();

        // return await this.get(`/account/${accountId}/subscribers?${queryString}`);
        return await this.get(`/account/${accountId}/email/subscribers`);
    }
    
    async getSubscriber(accountId: string,subscriberId:string): Promise<ApiResponse<any>> {
        return await this.get(`/account/${accountId}/email/subscriber/${subscriberId}`);
    }

    async deleteSubscriber(accountId:string,subscriberId: string): Promise<ApiResponse<any>> {
        return await this.delete(`/account/${accountId}/email/subscriber/${subscriberId}`);
    }

    async createTemplate(accountId:string,templateData:EmailTemplateData):Promise<any|null>{
        console.log("Template data",templateData);
        return await this.post(`/account/${accountId}/email/template`, templateData);
    }
}