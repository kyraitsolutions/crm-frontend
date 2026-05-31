export const CONFIGURATION_TABS = [
  {
    key: "lead-status",
    label: "Lead Status",
  },

  {
    key: "conversation-status",
    label: "Conversation Status",
  },

  {
    key: "pipeline",
    label: "Pipelines",
  },
];

export const CONFIGURATION_MAP = {
  "lead-status": {
    module: "lead",
    configType: "status",
  },

  "conversation-status": {
    module: "conversation",
    configType: "status",
  },

  "lead-pipeline": {
    module: "lead",
    configType: "pipeline",
  },
};
