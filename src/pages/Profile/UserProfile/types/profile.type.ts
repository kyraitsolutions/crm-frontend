import z from "zod";

export const ChangePasswordSchema=z.object({
    oldPassword:z.string(),
    newPassword:z.string(),
    confirmPassword:z.string(),
})


export interface UpdateUserProfile {
    userId: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    address?: {
        city: string;
        state: string;
        country: string;
        pincode: string;
        addressLine1: string;
        addressLine2: string;
    };
    phone?: string;
}