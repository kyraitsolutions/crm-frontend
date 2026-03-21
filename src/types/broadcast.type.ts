export interface CampaignRecord {
  id: string;
  name: string;
  subject: string;
  status: "sent" | "scheduled" | "draft";
  contacts: number;
  cost: string;
  date: string;
  openRate?: string;
  clickRate?: string;
}