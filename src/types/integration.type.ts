export type IntegrationProvider =
  | "WHATSAPP"
  | "FACEBOOK"
  | "INSTAGRAM"
  | "EXOTEL";

export interface TIntegrationResponse {
  connected: boolean;
  provider: IntegrationProvider;
  data: unknown;
}
