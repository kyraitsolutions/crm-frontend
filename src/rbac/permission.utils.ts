export const ALL_ACTIONS = ["create", "edit", "delete", "view", "export"];

export const modules = ["accounts", "leads", "chatbots", "leadForms", "teams"];

export const generateAllPermissions = () => {
  return modules.flatMap(
    (module) => ALL_ACTIONS.map((action) => `${module}.${action}`), // ✅ FIXED (dot not :)
  );
};
