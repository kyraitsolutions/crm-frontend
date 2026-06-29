// activityLogs/config/field.config.ts
export const SKIP_CHANGE_KEYS = new Set([
  "meta",
  "updatedAt",
  "createdAt",
  "__v",
  "_id",
]);

export const FIELD_LABELS: Record<string, string> = {
  assignedTo: "Assigned to",
  stage: "Stage",
  status: "Status",
  notes: "Notes",
  firstName: "First name",
  lastName: "Last name",
  name: "Name",
  email: "Email",
  phone: "Phone",
  pipeline: "Pipeline",
  dealValue: "Deal value",
  closeDate: "Close date",
  priority: "Priority",
  dueDate: "Due date",
  tags: "Tags",
  source: "Source",
  description: "Description",
};
