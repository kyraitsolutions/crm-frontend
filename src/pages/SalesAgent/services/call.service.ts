import { API_ENDPOINT_PATH } from "@/constants/api's-path";
import { ApiService } from "@/services";
import type { ApiResponse } from "@/types";

export class CallService extends ApiService{
        async getNumbers(selectedCountryCode:string): Promise<ApiResponse<any>> {
            const url = `${API_ENDPOINT_PATH?.CALLS.GET_NUMBERS}?countryCode=${encodeURIComponent(selectedCountryCode)}`;
            return await this.get(url);
        }
        async purchaseNumber(accountId:string,phoneNumber:string): Promise<ApiResponse<any>> {
            const url = `${API_ENDPOINT_PATH?.CALLS.PURCHASE_NUMBERS}`;
            return await this.post(url,{
                accountId:accountId,
                phoneNumber:phoneNumber
            });
        }
        async getMyNumbers(accountId:string): Promise<ApiResponse<any>> {
            const url = `${API_ENDPOINT_PATH?.CALLS.GET_MY_NUMBERS}`;
            return await this.post(url,{
                accountId:accountId,
            });
        }
        async getMyNumberDetails(accountId:string,phoneNumberSID:string): Promise<ApiResponse<any>> {
            const url = `${API_ENDPOINT_PATH?.CALLS.GET_MY_NUMBERS_DETAILS}`;
            return await this.post(url,{
                accountId:accountId,
                phoneNumberSID:phoneNumberSID
            });
        }
        async makeCall(accountId:string,customerPhone:string): Promise<ApiResponse<any>> {
            const url = `${API_ENDPOINT_PATH?.CALLS.MAKE_CALL}`;
            return await this.post(url,{
                accountId:accountId,
                customerPhone:customerPhone
            });
        }
}


export const callService=new CallService();