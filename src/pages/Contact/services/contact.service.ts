import { ApiService } from "@/services";
import type { ApiResponse } from "@/types";
import type { TCreateContact } from "../types/contact.type";

export class ContactService extends ApiService {
    async createContact(payload: TCreateContact): Promise<ApiResponse<any>> {
        return await this.post(`/contacts/create`, payload);
    }


    async getContacts(payload: any,): Promise<ApiResponse<any>> {
        return await this.post(`/contacts`,payload);
    }
    
    async getContact(accountId: string,subscriberId:string): Promise<ApiResponse<any>> {
        return await this.get(`/account/${accountId}/email/subscriber/${subscriberId}`);
    }

    async deleteContact(accountId:string,subscriberId: string): Promise<ApiResponse<any>> {
        return await this.delete(`/account/${accountId}/email/subscriber/${subscriberId}`);
    }
}

export const contactService=new ContactService();