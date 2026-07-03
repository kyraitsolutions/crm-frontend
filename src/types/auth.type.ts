export interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  onboarding: boolean;
  role: {
    name: string;
    level: number;
  };
  organization: {
    id: string;
    name: string;
  };
  userProfile: {
    firstName: string;
    lastName: string;
    organizationName: string;
    accountType: string;
    profilePicture:string
  };
  account: Partial<Account>;
  subscription: {
    planId: string;
    startedAt:Date;
    expiresAt:Date
  };
  permissions?: string[];
}

export interface Account {
  id: string;
  userId: string;
  accountName: string;
  email: string;
  status: "active" | "inactive" | "suspended"; // if you have fixed status options
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
  isAccountSelected?: boolean;
  selectedAccount?: string | null;
}
