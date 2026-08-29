export type IntegrationProvider =
  | "whatsapp"
  | "facebook"
  | "instagram"
  | "exotel";

export interface TIntegrationResponse {
  id: string;
  connected: boolean;
  provider: IntegrationProvider;
  data: unknown;
}
