import type {
  TAiAgentToolConfig,
  TCustomApiForm,
  TCustomApiKv,
} from "../types/ai-agent.type";

export const slugKey = (value: string) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);

export const parseCurl = (raw: string) => {
  const text = String(raw || "").trim();
  const method = text.match(/-X\s+([A-Z]+)/i)?.[1]?.toUpperCase() || "GET";
  const url =
    text.match(/'(https?:\/\/[^']+)'/)?.[1] ||
    text.match(/"(https?:\/\/[^"]+)"/)?.[1] ||
    text.match(/https?:\/\/[^\s'"]+/)?.[0] ||
    "";
  const headers: TCustomApiKv[] = [];
  const headerRe = /-H\s+['"]([^:]+):\s*([^'"]+)['"]/gi;
  let match: RegExpExecArray | null = headerRe.exec(text);
  while (match) {
    headers.push({ key: match[1].trim(), value: match[2].trim() });
    match = headerRe.exec(text);
  }
  return { method: method || "GET", endpoint: url, headers };
};

const asRecord = (value: unknown): Record<string, string> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      String(item ?? ""),
    ]),
  );
};

export const recordToKv = (value: unknown): TCustomApiKv[] => {
  const entries = Object.entries(asRecord(value));
  return entries.length ? entries.map(([key, item]) => ({ key, value: item })) : [];
};

export const kvToRecord = (rows: TCustomApiKv[]) =>
  Object.fromEntries(
    rows
      .map((row) => [row.key.trim(), row.value] as const)
      .filter(([key]) => key),
  );

export const emptyCustomApiForm = (): TCustomApiForm => ({
  key: "",
  name: "",
  description: "",
  intentGroup: "",
  sensitivity: "read_only",
  examples: [""],
  method: "GET",
  endpoint: "",
  headers: [{ key: "Content-Type", value: "application/json" }],
  params: [],
  authType: "none",
  authToken: "",
  imageField: "",
  replyFields: "",
});

export const toolToCustomApiForm = (tool?: TAiAgentToolConfig | null): TCustomApiForm => {
  if (!tool) return emptyCustomApiForm();
  const config = tool.config || {};
  const examples = Array.isArray(config.examples)
    ? (config.examples as unknown[]).map((item) => String(item || ""))
    : [];
  return {
    key: tool.key,
    name: tool.name,
    description: tool.description,
    intentGroup: String(config.intentGroup || ""),
    sensitivity: tool.sensitivity || "read_only",
    examples: examples.length ? examples : [""],
    method: String(config.method || "GET").toUpperCase(),
    endpoint: String(config.endpoint || ""),
    headers: recordToKv(config.headers).length
      ? recordToKv(config.headers)
      : [{ key: "Content-Type", value: "application/json" }],
    params: recordToKv(config.params),
    authType: String(config.authType || "none") === "bearer" ? "bearer" : "none",
    authToken: String(config.authToken || ""),
    imageField: String(config.imageField || ""),
    replyFields: String(config.replyFields || ""),
  };
};

export const customApiFormToTool = (form: TCustomApiForm): TAiAgentToolConfig => {
  const group = slugKey(form.intentGroup || form.name) || "custom";
  const action = slugKey(form.name) || "action";
  return {
    key: form.key || `${group}__${action}`,
    name: form.name.trim(),
    type: "custom_api",
    enabled: true,
    sensitivity: form.sensitivity,
    description: form.description.trim(),
    config: {
      intentGroup: group,
      examples: form.examples.map((item) => item.trim()).filter(Boolean),
      method: form.method,
      endpoint: form.endpoint.trim(),
      headers: kvToRecord(form.headers),
      params: kvToRecord(form.params),
      authType: form.authType,
      authToken: form.authToken,
      imageField: form.imageField.trim(),
      replyFields: form.replyFields.trim(),
    },
  };
};
