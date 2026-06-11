export interface ActivityLog {
  _id: string;
  entityType: string;
  entityId: string;
  action: string;

  actor: {
    type: string;
    id: string;
    name?: string;
  };

  changes: Record<string, any>;

  metadata?: {
    leadName?: string;
    automationName?: string;
  };

  createdAt: string;
}
