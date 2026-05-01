import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ALL_ACTIONS, PERMISSION_CONFIG } from "@/rbac";
import { ArrowLeft, Check, Save } from "lucide-react";

type PermissionManagerProps = {
  roleName: string;
  setRoleName: (val: string) => void;
  active: string;
  permissions: string[];
  setPermissions: (permissions: string[]) => void;
  isEditable?: boolean;
  isLoading?: boolean;
  onBack?: () => void;
  onSave?: () => void;
};

const PermissionManager: React.FC<PermissionManagerProps> = ({
  roleName,
  setRoleName,
  active,
  permissions,
  setPermissions,
  isEditable = false,
  isLoading = false,
  onBack = () => { },
  onSave = () => { },
}) => {
  const safePermissions = Array.isArray(permissions) ? permissions : [];

  // ✅ Track initial state
  const [initialState, setInitialState] = useState({
    roleName: "",
    permissions: [] as string[],
  });

  useEffect(() => {
    setInitialState({
      roleName,
      permissions,
    });
  }, []);

  // Detect changes
  const isChanged =
    roleName !== initialState.roleName ||
    JSON.stringify(permissions) !== JSON.stringify(initialState.permissions);

  const isCreate = active?.toLowerCase() === "create role";
  const isEdit = active?.toLowerCase() === "edit role";

  //  Toggle permission
  const togglePermission = (moduleKey: string, action: string) => {
    if (!isEditable) return;

    const key = `${moduleKey}.${action}`;

    if (permissions.includes(key)) {
      setPermissions(permissions.filter((p) => p !== key));
    } else {
      setPermissions([...permissions, key]);
    }
  };

  // Toggle all module permissions
  const toggleAllModulePermissions = (moduleKey: string, actions: string[]) => {
    if (!isEditable) return;

    const keys = actions.map((a) => `${moduleKey}.${a}`);
    const allSelected = keys.every((k) => permissions.includes(k));

    if (allSelected) {
      setPermissions(permissions.filter((p) => !keys.includes(p)));
    } else {
      setPermissions([...new Set([...permissions, ...keys])]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      {/* HEADER */}
      <header className="flex items-center justify-between bg-white px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <ArrowLeft onClick={onBack} className="cursor-pointer" />
          <h1 className="text-lg font-semibold capitalize">{active}</h1>
        </div>

        <div className="flex items-center gap-3">
          {(isCreate || isEdit) && (
            <Input
              placeholder="Role Name"
              value={roleName}
              disabled={!isEditable}
              onChange={(e) => setRoleName(e.target.value)}
              className="max-w-xs"
            />
          )}

          {/* ✅ Show button only in create/edit */}
          {isEditable && (
            <Button
              disabled={!roleName || isLoading || !isChanged}
              onClick={onSave}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              {isCreate ? "Create Role" : "Update Role"}
              {isLoading && <Loader />}
            </Button>
          )}
        </div>
      </header>

      {/* BODY */}
      <main className="p-6 space-y-6">
        {PERMISSION_CONFIG.map((section) => (
          <div
            key={section.title}
            className="bg-white border rounded-lg overflow-hidden"
          >
            <div className="px-4 py-3 border-b bg-gray-50 font-semibold text-sm uppercase">
              {section.title}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left w-50">Module</th>

                    {ALL_ACTIONS.map((action) => (
                      <th key={action} className="text-center px-4 py-3 capitalize">
                        {action}
                      </th>
                    ))}

                    {isEditable && (
                      <th className="text-center px-4 py-3">All</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {section.modules.map((module) => {
                    const moduleKeys = module.actions.map(
                      (a: string) => `${module.key}.${a}`,
                    );

                    const allSelected = moduleKeys.every((k) =>
                      safePermissions.includes(k),
                    );

                    return (
                      <tr key={module.key} className="border-t">
                        <td className="px-4 py-4 font-medium">
                          {module.label}
                        </td>

                        {ALL_ACTIONS.map((action) => {
                          const key = `${module.key}.${action}`;
                          const hasAccess = safePermissions.includes(key);
                          const allowed = module.actions.includes(action);

                          return (
                            <td key={action} className="text-center py-4">
                              {!allowed ? (
                                <span className="text-gray-300">—</span>
                              ) : isEditable ? (
                                <input
                                  type="checkbox"
                                  checked={hasAccess}
                                  onChange={() =>
                                    togglePermission(module.key, action)
                                  }
                                />
                              ) : hasAccess ? (
                                <Check className="mx-auto text-green-500" />
                              ) : (
                                "—"
                              )}
                            </td>
                          );
                        })}

                        {isEditable && (
                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={() =>
                                toggleAllModulePermissions(
                                  module.key,
                                  module.actions,
                                )
                              }
                            />
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default PermissionManager;
