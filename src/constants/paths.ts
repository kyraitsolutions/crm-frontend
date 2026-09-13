const toWsUrl = (httpUrl?: string) => {
  if (!httpUrl) return "";
  return httpUrl.replace(/^https:/i, "wss:").replace(/^http:/i, "ws:");
};

export const WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL ||
  toWsUrl(import.meta.env.VITE_API_URL) ||
  "ws://localhost:3000";
