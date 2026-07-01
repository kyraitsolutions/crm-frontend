export interface TokenData{
    id:string,
    organizationId: string;
    accountId: string;
    name: string;
    description?: string;
    tokenHash: string;
    tokenPrefix: string;
    permissions: string[];

    isActive: boolean;

    createdBy: string;
    lastUsedAt?: string;
    regeneratedAt?: string;

    createdAt: string;
    updatedAt: string;
}
