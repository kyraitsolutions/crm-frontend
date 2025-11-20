export interface LeadFormListItem {
  id: string;
  formTitle: string;
  formDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface TLead {
  _id: string;
  accountId: string;
  name: string;
  email: string;
  phone: string;
  customFields: Record<string, any>;
  stage: string;
  status: string;
  source: {
    name: string;
  };
  tags: string[];
  notes: string[];
  createdAt: string; // or Date if you convert to Date object
  updatedAt: string; // or Date if you convert to Date object
}
