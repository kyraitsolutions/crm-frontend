import type {
  TAiAgentSkillConfig,
  TAiSkillCatalogItem,
  TAiSkillSuggestion,
} from "../types/ai-agent.type";

export const SKILL_TYPE = {
  LEAD_QUALIFICATION: "lead_qualification",
  HANDLE_SUPPORT: "handle_support",
  APPOINTMENT_BOOKING: "appointment_booking",
  HUMAN_HANDOFF: "human_handoff",
  CUSTOM: "custom",
} as const;

export const PREBUILT_SKILLS: TAiSkillCatalogItem[] = [
  {
    type: SKILL_TYPE.HANDLE_SUPPORT,
    name: "FAQ / Support",
    icon: "zap",
    whenToUse:
      "The contact asks a general question about the business — products, pricing, policies, hours, location, delivery areas, services, or “do you have/do you offer X”. Use this whenever the answer should come from the business’s own knowledge. Do NOT use it for order-specific lookups (use Order Status), for a buyer who wants to purchase/qualify (use Lead Qualification), or for returns (use Returns).",
    instructions:
      "Answer from attached knowledge. If the issue is a complaint, unknown, or needs live order data, hand off.",
    builtIn: true,
  },
  {
    type: SKILL_TYPE.HUMAN_HANDOFF,
    name: "Human Handoff",
    icon: "zap",
    whenToUse:
      "The contact explicitly asks for a human/agent/manager, is clearly frustrated after you’ve tried to help, raises something out of the bot’s scope, or the matter is sensitive (billing dispute, fraud, complaint, legal). Use it to hand off cleanly — not as an escape from questions you haven’t tried to answer yet.",
    instructions:
      "When the customer asks for a person, or confidence is low, stop automation and escalate. Collect required details first if they are configured.",
    builtIn: true,
  },
  {
    type: SKILL_TYPE.LEAD_QUALIFICATION,
    name: "Lead Qualification",
    icon: "filter",
    whenToUse:
      "Use this skill when a customer shows interest in purchasing your product, requests a demo, asks about pricing, or wants to know if our solution is suitable for their business.",
    instructions:
      "Collect missing qualification fields one or two at a time. Do not invent budget, timeline, or requirements. Once the required details are collected, offer to connect the customer with the sales team.",
    builtIn: true,
  },
  {
    type: SKILL_TYPE.APPOINTMENT_BOOKING,
    name: "Appointment booking",
    icon: "calendar",
    whenToUse: "Customer wants to book a visit, demo or callback.",
    instructions:
      "Collect dates and guest or attendee details, then use live availability tools. Never invent slots or prices.",
    builtIn: true,
  },
];

export const CUSTOM_SKILL_SUGGESTIONS: TAiSkillSuggestion[] = [
  {
    id: "bulk_wholesale",
    label: "Bulk / wholesale",
    name: "Bulk & wholesale orders",
    icon: "package",
    whenToUse: "Customer asks about ordering in bulk or business pricing.",
    instructions:
      "Collect company name and quantity, then share the wholesale rate card and create a lead.",
  },
  {
    id: "appointment_booking",
    label: "Appointment booking",
    name: "Appointment booking",
    icon: "calendar",
    whenToUse: "Customer wants to book a visit, demo or callback.",
    instructions:
      "Collect preferred date, time, and contact details. Confirm only from live availability. Never invent slots.",
  },
  {
    id: "warranty_claim",
    label: "Warranty claim",
    name: "Warranty claim",
    icon: "shield",
    whenToUse:
      "Use this skill when a customer wants to start a warranty claim or asks if a product is still under warranty.",
    instructions:
      "Ask for the product name, purchase date, and issue description. Then hand off to a teammate if a claim must be filed.",
  },
  {
    id: "feedback",
    label: "Feedback",
    name: "Feedback collection",
    icon: "star",
    whenToUse:
      "Use this skill when a customer wants to leave feedback, a review, or a complaint about their experience.",
    instructions:
      "Ask for a short description of their experience and a rating if useful. Thank them. Hand off if they are upset.",
  },
];

export const SKILL_CONTACT_ATTRIBUTES = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "company", label: "Company" },
  { value: "tags", label: "Tags" },
  { value: "notes", label: "Notes" },
  { value: "order_id", label: "Order ID" },
  { value: "issue_description", label: "Issue description" },
];

export const findCatalogSkill = (type: string) =>
  PREBUILT_SKILLS.find((item) => item.type === type);

export const isBuiltInSkill = (skill: Pick<TAiAgentSkillConfig, "type" | "key">) =>
  Boolean(findCatalogSkill(skill.type || skill.key));

export const catalogToSkill = (item: TAiSkillCatalogItem): TAiAgentSkillConfig => ({
  key: item.type,
  type: item.type,
  enabled: true,
  name: item.name,
  icon: item.icon || "zap",
  whenToUse: item.whenToUse,
  instructions: item.instructions,
  config: { collectFields: [], connectedToolKeys: [] },
});
