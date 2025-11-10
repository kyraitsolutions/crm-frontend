import type { ApiResponse } from "@/types";
import { ApiService } from "./api.service";

export class LeadFormService extends ApiService{
    constructor(){
        super();
    }


    async getLeadFromsList(accountId:string):Promise<ApiResponse<[] | null>>{
        return await this.get(`/account/${accountId}/forms`)
    }
}