import React, { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PERMISSION_CONFIG,
  actionsForSection,
  type PermissionSectionConfig,
} from "@/rbac";
import { RBACService } from "@/services/rbac.service";
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

const rbacService = new RBACService();

const PermissionManager: React.FC<PermissionManagerProps> = ({
  roleName,
  setRoleName,
  active,
  permissions,
  setPermissions,
  isEditable = false,
  isLoading = false,
  onBack = () => {},
  onSave = () => {},
}) => {
  const safePermissions = Array.isArray(permissions) ? permissions : [];
  const [catalog, setCatalog] =
    useState<PermissionSectionConfig[]>(PERMISSION_CONFIG);
  const [catalogLoading, setCatalogLoading] = useState(true);

  const [initialState, setInitialState] = useState({
    roleName: "",
    permissions: [] as string[],
  });

  useEffect(() => {
    setInitialState({
      roleName,
      permissions,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- capture once on mount
  }, []);

  useEffect(() => {
    let cancelled = false;
    setCatalogLoading(true);
    rbacService
      .getPermissionCatalog()
      .then((res) => {
        const sections = res?.data?.sections;
        if (!cancelled && Array.isArray(sections) && sections.length > 0) {
          setCatalog(sections);
        }
      })
      .catch(() => {
        if (!cancelled) setCatalog(PERMISSION_CONFIG);
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isChanged =
    roleName !== initialState.roleName ||
    JSON.stringify(permissions) !== JSON.stringify(initialState.permissions);

  const isCreate = active?.toLowerCase() === "create role";
  const isEdit = active?.toLowerCase() === "edit role";

  const togglePermission = (moduleKey: string, action: string) => {
    if (!isEditable) return;
    const key = `${moduleKey}.${action}`;
    if (safePermissions.includes(key)) {
      setPermissions(safePermissions.filter((p) => p !== key));
    } else {
      setPermissions([...safePermissions, key]);
    }
  };

  const toggleAllModulePermissions = (moduleKey: string, actions: string[]) => {
    if (!isEditable) return;
    const keys = actions.map((a) => `${moduleKey}.${a}`);
    const allSelected = keys.every((k) => safePermissions.includes(k));
    if (allSelected) {
      setPermissions(safePermissions.filter((p) => !keys.includes(p)));
    } else {
      setPermissions([...new Set([...safePermissions, ...keys])]);
    }
  };

  const sections = useMemo(() => catalog, [catalog]);

  return (
    <div className="h-[calc(100vh-114px)] overflow-y-scroll hide-scrollbar bg-gray-50 text-slate-700">
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

      <main className="p-6 space-y-6">
        <p className="text-sm text-gray-500">
          Modules are independent. Granting WhatsApp channel access does not
          grant WhatsApp Marketing (broadcasts), and vice versa.
        </p>

        {catalogLoading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : (
          sections.map((section) => {
            const columns = actionsForSection(section);
            return (
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
                        {columns.map((action) => (
                          <th
                            key={action}
                            className="text-center px-4 py-3 capitalize"
                          >
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
                          (a) => `${module.key}.${a}`,
                        );
                        const allSelected = moduleKeys.every((k) =>
                          safePermissions.includes(k),
                        );

                        return (
                          <tr key={module.key} className="border-t">
                            <td className="px-4 py-4">
                              <p className="font-medium">{module.label}</p>
                              {module.description && (
                                <p className="text-xs text-gray-500 mt-0.5 max-w-xs">
                                  {module.description}
                                </p>
                              )}
                            </td>

                            {columns.map((action) => {
                              const key = `${module.key}.${action}`;
                              const hasAccess = safePermissions.includes(key);
                              const allowed = module.actions.includes(
                                action as (typeof module.actions)[number],
                              );

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
            );
          })
        )}
      </main>
    </div>
  );
};

export default PermissionManager;
