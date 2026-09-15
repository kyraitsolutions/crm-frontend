import type { TCannedMessage } from "@/pages/Channels/whatsapp/types/canned-message.type";

export type CannedVariableContext = {
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  agentName?: string | null;
  propertyName?: string | null;
};

const firstName = (value?: string | null) =>
  String(value || "")
    .trim()
    .split(/\s+/)[0] || "";

const lastName = (value?: string | null) => {
  const parts = String(value || "")
    .trim()
    .split(/\s+/);
  return parts.length > 1 ? parts.slice(1).join(" ") : "";
};

export const resolveCannedVariables = (
  text: string,
  context: CannedVariableContext = {},
) => {
  if (!text) return "";

  const values: Record<string, string> = {
    customer_name: context.customerName || "",
    customer_phone: context.customerPhone || "",
    customer_email: context.customerEmail || "",
    agent_name: context.agentName || "",
    property_name: context.propertyName || "",
    company_name: context.propertyName || "",
    FirstName: firstName(context.customerName),
    LastName: lastName(context.customerName),
    Name: context.customerName || "",
    MobileNumber: context.customerPhone || "",
  };

  return text
    .replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => {
      return values[key] ?? values[key.toLowerCase()] ?? "";
    })
    .replace(/\$([a-zA-Z0-9_]+)/g, (_, key: string) => {
      return values[key] ?? "";
    });
};

export const getActiveSlashToken = (text: string, cursor: number) => {
  const safeCursor = Math.max(0, Math.min(cursor, text.length));
  const before = text.slice(0, safeCursor);
  const match = /(?:^|\s)(\/[^\s]*)$/.exec(before);
  if (!match) return null;

  const tokenBeforeCursor = match[1];
  const start = before.lastIndexOf(tokenBeforeCursor);
  const rest = text.slice(safeCursor).match(/^[^\s]*/)?.[0] || "";
  const token = `${tokenBeforeCursor}${rest}`;
  return {
    start,
    end: start + token.length,
    token,
    query: token.slice(1),
  };
};

export const replaceSlashToken = (
  text: string,
  start: number,
  end: number,
  insertion: string,
) => {
  return `${text.slice(0, start)}${insertion}${text.slice(end)}`;
};

export const filterCannedMessages = (
  messages: TCannedMessage[],
  query: string,
) => {
  const needle = query.trim().toLowerCase().replace(/^\/+/, "");

  const filtered = needle
    ? messages.filter((message) => {
        const haystack = [
          message.shortcut,
          message.name,
          message.text,
          message.category,
          message.type,
          message.media?.fileName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle);
      })
    : [...messages];

  return filtered.sort((a, b) => {
    const aRecent = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
    const bRecent = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
    if (aRecent !== bRecent) return bRecent - aRecent;
    if ((b.usageCount || 0) !== (a.usageCount || 0)) {
      return (b.usageCount || 0) - (a.usageCount || 0);
    }
    if (Boolean(b.favourite) !== Boolean(a.favourite)) {
      return Number(b.favourite) - Number(a.favourite);
    }
    return a.name.localeCompare(b.name);
  });
};
