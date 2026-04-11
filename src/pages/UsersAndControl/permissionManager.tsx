import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ALL_ACTIONS, PERMISSION_CONFIG } from "@/rbac";
import { ArrowLeft, Check, Save } from "lucide-react";

type Props = {
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

const PermissionManager: React.FC<Props> = ({
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

  // ✅ Detect changes
  const isChanged =
    roleName !== initialState.roleName ||
    JSON.stringify(permissions) !== JSON.stringify(initialState.permissions);

  const isCreate = active?.toLowerCase() === "create role";
  const isEdit = active?.toLowerCase() === "edit role";

  // ================= TOGGLES =================

  const togglePermission = (moduleKey: string, action: string) => {
    if (!isEditable) return;

    const key = `${moduleKey}.${action}`;

    if (permissions.includes(key)) {
      setPermissions(permissions.filter((p) => p !== key));
    } else {
      setPermissions([...permissions, key]);
    }
  };

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
                    <th className="px-4 py-3 text-left">Module</th>

                    {ALL_ACTIONS.map((action) => (
                      <th key={action} className="text-center px-4 py-3">
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
// import Loader from "@/components/Loader";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ALL_ACTIONS, PERMISSION_CONFIG } from "@/rbac";
// import { ArrowLeft, Check, Save } from "lucide-react";

// const PermissionManager = ({
//   roleName,
//   setRoleName,
//   active,
//   permissions,
//   setPermissions,
//   isEditable = false,
//   isLoading = false,
//   onBack = () => {},
//   onSave = (data: any, isEdit = false) => {},
// }: any) => {
//   // ✅ toggle
//   const togglePermission = (moduleKey: string, action: string) => {
//     const key = `${moduleKey}.${action}`;

//     if (!isEditable) return;

//     setPermissions((prev: string[]) =>
//       prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key],
//     );
//   };

//   const handleBack = () => {
//     if (onBack) onBack();
//   };

//   const handleSaveAndUpdate = () => {
//     if (onSave) onSave({ name: roleName, permissions }, isEditable);
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-600 font-sans">
//       {/* Header */}
//       <header className="flex items-center justify-between gap-4 bg-white px-6 py-3 border-b">
//         <div className="flex items-center gap-4">
//           <ArrowLeft onClick={() => handleBack()} className="cursor-pointer" />
//           <h1 className="text-lg font-medium capitalize">{active}</h1>
//         </div>

//         <div className="p-4 flex items-center gap-4">
//           <Input
//             placeholder="Role Name"
//             value={roleName}
//             onChange={(e) => setRoleName(e.target.value)}
//             className="focus-visible:ring-0 focus-visible:border-primary/60 border-primary/60 rounded-xl max-w-80"
//           />

//           {isEditable ? (
//             <Button
//               disabled={isLoading}
//               onClick={handleSaveAndUpdate}
//               className="bg-primary cursor-pointer text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Save /> Update Role {isLoading && <Loader />}{" "}
//             </Button>
//           ) : (
//             <Button
//               disabled={!roleName || isLoading}
//               onClick={handleSaveAndUpdate}
//               className="bg-primary cursor-pointer text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Save /> Save Role {isLoading && <Loader />}{" "}
//             </Button>
//           )}
//         </div>
//       </header>

//       <main className="p-6 space-y-8">
//         {PERMISSION_CONFIG.map((section, idx) => (
//           <div key={idx} className="bg-white border rounded shadow-sm">
//             {/* Title */}
//             <div className="px-4 py-3 border-b">
//               <h2 className="text-sm font-semibold uppercase">
//                 {section.title}
//               </h2>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full table-fixed">
//                 <thead>
//                   <tr>
//                     <th className="px-4 py-3 text-left">Action</th>

//                     {/* Dynamic columns */}
//                     {ALL_ACTIONS.map((col) => (
//                       <th key={col} className="px-4 py-3 capitalize">
//                         {col}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {section.modules.map((module) => (
//                     <tr key={module.key}>
//                       <td className="px-4 py-4">{module.label}</td>
//                       {ALL_ACTIONS.map((action) => {
//                         const key = `${module.key}.${action}`;
//                         const hasAccess = permissions?.includes(key);
//                         const allowed = module?.actions?.includes(action);

//                         return (
//                           <td key={action} className="px-4 py-4 text-center">
//                             {!allowed ? (
//                               <span className="text-slate-300">—</span>
//                             ) : isEditable ? (
//                               <input
//                                 type="checkbox"
//                                 checked={hasAccess}
//                                 onChange={() =>
//                                   togglePermission(module.key, action)
//                                 }
//                               />
//                             ) : hasAccess ? (
//                               <div className="flex justify-center">
//                                 <Check className="w-5 h-5 text-green-500 stroke-[2px]" />
//                               </div>
//                             ) : (
//                               "—"
//                             )}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ))}
//       </main>
//     </div>
//   );
// };

// export default PermissionManager;

// import { ArrowLeft, Check } from "lucide-react"; // Using Lucide for the icons

// type PermissionRow = {
//   actionName: string;
//   permissions: {
//     create?: boolean;
//     edit?: boolean;
//     delete?: boolean;
//     view?: boolean;
//     export?: boolean;
//     launch?: boolean;
//     viewReport?: boolean;
//   };
// };

// type PermissionSection = {
//   title: string;
//   columns: string[];
//   rows: PermissionRow[];
// };

// const managerData: PermissionSection[] = [
//   {
//     title: "CONTACTS AND LISTS",
//     columns: ["Create", "Edit", "Delete", "View", "Export"],
//     rows: [
//       {
//         actionName: "Contacts",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           export: true,
//         },
//       },
//       {
//         actionName: "Mailing Lists",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           export: false,
//         },
//       },
//       {
//         actionName: "Segments",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           export: false,
//         },
//       },
//       {
//         actionName: "Tags",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           export: false,
//         },
//       },
//     ],
//   },
//   {
//     title: "LEAD GENERATION",
//     columns: ["Create", "Edit", "Delete", "View", "Launch", "View Report"],
//     rows: [
//       {
//         actionName: "Signup Forms",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           launch: true,
//           viewReport: true,
//         },
//       },
//     ],
//   },
//   {
//     title: "MARKETING CHANNELS",
//     columns: [
//       "Create",
//       "Edit",
//       "Delete",
//       "View",
//       "Export",
//       "Launch",
//       "View Report",
//     ],
//     rows: [
//       {
//         actionName: "Regular and Advanced Campaigns",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           export: true,
//           launch: true,
//           viewReport: true,
//         },
//       },
//       {
//         actionName: "SMS",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           export: false,
//           launch: true,
//           viewReport: true,
//         },
//       },
//       {
//         actionName: "Workflows",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           export: false,
//           launch: true,
//           viewReport: true,
//         },
//       },
//     ],
//   },
// ];
// const adminData: PermissionSection[] = [
//   {
//     title: "CONTACTS AND LISTS",
//     columns: ["Create", "Edit", "Delete", "View", "Export"],
//     rows: [
//       {
//         actionName: "Contacts",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           export: true,
//         },
//       },
//       {
//         actionName: "Mailing Lists",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           export: false,
//         },
//       },
//       {
//         actionName: "Segments",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           export: false,
//         },
//       },
//       {
//         actionName: "Tags",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           export: false,
//         },
//       },
//     ],
//   },
//   {
//     title: "LEAD GENERATION",
//     columns: ["Create", "Edit", "Delete", "View", "Launch", "View Report"],
//     rows: [
//       {
//         actionName: "Signup Forms",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           launch: true,
//           viewReport: true,
//         },
//       },
//     ],
//   },
//   {
//     title: "MARKETING CHANNELS",
//     columns: [
//       "Create",
//       "Edit",
//       "Delete",
//       "View",
//       "Export",
//       "Launch",
//       "View Report",
//     ],
//     rows: [
//       {
//         actionName: "Regular and Advanced Campaigns",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           export: true,
//           launch: true,
//           viewReport: true,
//         },
//       },
//       {
//         actionName: "SMS",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           export: false,
//           launch: true,
//           viewReport: true,
//         },
//       },
//       {
//         actionName: "Workflows",
//         permissions: {
//           create: true,
//           edit: true,
//           delete: true,
//           view: true,
//           export: false,
//           launch: true,
//           viewReport: true,
//         },
//       },
//     ],
//   },
// ];
// const editorData: PermissionSection[] = [
//   {
//     title: "CONTACTS AND LISTS",
//     columns: ["Create", "Edit", "Delete", "View", "Export"],
//     rows: [
//       {
//         actionName: "Contacts",
//         permissions: {
//           create: false,
//           edit: true,
//           delete: false,
//           view: true,
//           export: true,
//         },
//       },
//       {
//         actionName: "Mailing Lists",
//         permissions: {
//           create: false,
//           edit: true,
//           delete: false,
//           view: true,
//           export: false,
//         },
//       },
//       {
//         actionName: "Segments",
//         permissions: {
//           create: false,
//           edit: true,
//           delete: false,
//           view: true,
//           export: false,
//         },
//       },
//       {
//         actionName: "Tags",
//         permissions: {
//           create: false,
//           edit: true,
//           delete: false,
//           view: true,
//           export: false,
//         },
//       },
//     ],
//   },
//   {
//     title: "LEAD GENERATION",
//     columns: ["Create", "Edit", "Delete", "View", "Launch", "View Report"],
//     rows: [
//       {
//         actionName: "Signup Forms",
//         permissions: {
//           create: false,
//           edit: true,
//           delete: false,
//           view: true,
//           launch: false,
//           viewReport: true,
//         },
//       },
//     ],
//   },
//   {
//     title: "MARKETING CHANNELS",
//     columns: [
//       "Create",
//       "Edit",
//       "Delete",
//       "View",
//       "Export",
//       "Launch",
//       "View Report",
//     ],
//     rows: [
//       {
//         actionName: "Regular and Advanced Campaigns",
//         permissions: {
//           create: false,
//           edit: true,
//           delete: false,
//           view: true,
//           export: false,
//           launch: false,
//           viewReport: true,
//         },
//       },
//       {
//         actionName: "SMS",
//         permissions: {
//           create: false,
//           edit: true,
//           delete: false,
//           view: true,
//           export: false,
//           launch: false,
//           viewReport: true,
//         },
//       },
//       {
//         actionName: "Workflows",
//         permissions: {
//           create: false,
//           edit: true,
//           delete: false,
//           view: true,
//           export: true,
//           launch: false,
//           viewReport: true,
//         },
//       },
//     ],
//   },
// ];
// const viewerData: PermissionSection[] = [
//   {
//     title: "CONTACTS AND LISTS",
//     columns: ["Create", "Edit", "Delete", "View", "Export"],
//     rows: [
//       {
//         actionName: "Contacts",
//         permissions: {
//           create: false,
//           edit: false,
//           delete: false,
//           view: true,
//           export: false,
//         },
//       },
//       {
//         actionName: "Mailing Lists",
//         permissions: {
//           create: false,
//           edit: false,
//           delete: false,
//           view: true,
//           export: false,
//         },
//       },
//       {
//         actionName: "Segments",
//         permissions: {
//           create: false,
//           edit: false,
//           delete: false,
//           view: true,
//           export: false,
//         },
//       },
//       {
//         actionName: "Tags",
//         permissions: {
//           create: false,
//           edit: false,
//           delete: false,
//           view: true,
//           export: false,
//         },
//       },
//     ],
//   },
//   {
//     title: "LEAD GENERATION",
//     columns: ["Create", "Edit", "Delete", "View", "Launch", "View Report"],
//     rows: [
//       {
//         actionName: "Signup Forms",
//         permissions: {
//           create: false,
//           edit: false,
//           delete: false,
//           view: true,
//           launch: false,
//           viewReport: true,
//         },
//       },
//     ],
//   },
//   {
//     title: "MARKETING CHANNELS",
//     columns: [
//       "Create",
//       "Edit",
//       "Delete",
//       "View",
//       "Export",
//       "Launch",
//       "View Report",
//     ],
//     rows: [
//       {
//         actionName: "Regular and Advanced Campaigns",
//         permissions: {
//           create: false,
//           edit: false,
//           delete: false,
//           view: true,
//           export: false,
//           launch: false,
//           viewReport: true,
//         },
//       },
//       {
//         actionName: "SMS",
//         permissions: {
//           create: false,
//           edit: false,
//           delete: false,
//           view: true,
//           export: false,
//           launch: false,
//           viewReport: true,
//         },
//       },
//       {
//         actionName: "Workflows",
//         permissions: {
//           create: false,
//           edit: false,
//           delete: false,
//           view: true,
//           export: false,
//           launch: false,
//           viewReport: true,
//         },
//       },
//     ],
//   },
// ];

// const PermissionManager = ({ active, setActive, roles }: any) => {
//   console.log("active", active);
//   let permissionData: PermissionSection[] = [];
//   switch (active) {
//     case "admin":
//       permissionData = adminData;
//       break;

//     case "manager":
//       permissionData = managerData;
//       break;
//     case "editor":
//       permissionData = editorData;
//       break;

//     case "viewer":
//       permissionData = viewerData;
//       break;

//     default:
//       permissionData = [];
//       break;
//   }
//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-600 font-sans">
//       {/* Top Header */}
//       <header className="flex items-center justify-between gap-4 bg-white px-6 py-3 border-b border-slate-200">
//         <div className="flex items-center gap-4">
//           <ArrowLeft
//             onClick={() => setActive(null)}
//             className="w-5 h-5 cursor-pointer hover:text-primary-600"
//           />
//           <h1 className="text-lg font-medium text-primary capitalize">
//             {active}
//           </h1>
//         </div>
//         {/* {active !== "admin" && active !== "manager" && <div>
//           <Button className='rounded'><Edit />Edit</Button>
//         </div>} */}
//       </header>

//       <main className="p-6 space-y-8">
//         {permissionData?.map((section, idx) => (
//           <div
//             key={idx}
//             className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden"
//           >
//             {/* Section Title */}
//             <div className="bg-[#fcfdfe] px-4 py-3 border-b border-slate-100">
//               <h2 className="text-sm font-semibold text-slate-500 tracking-wide uppercase">
//                 {section.title}
//               </h2>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse table-fixed">
//                 <thead>
//                   <tr className="bg-[#f8fafc]">
//                     <th className="px-4 py-3 text-sm font-bold text-slate-700 w-1/4">
//                       Action
//                     </th>
//                     {section.columns.map((col) => (
//                       <th
//                         key={col}
//                         className="px-4 py-3 table-fixed text-sm font-bold text-slate-700"
//                       >
//                         {col}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {section.rows.map((row, rowIdx) => (
//                     <tr
//                       key={rowIdx}
//                       className="hover:bg-slate-50 transition-colors"
//                     >
//                       <td className="px-4 py-4 text-sm font-medium text-slate-600">
//                         {row.actionName}
//                       </td>
//                       {section.columns.map((col) => {
//                         // Logic to match column header to the specific permission key
//                         const key = col
//                           .toLowerCase()
//                           .replace(" ", "") as keyof typeof row.permissions;
//                         const hasAccess = row.permissions[key];

//                         return (
//                           <td key={col} className="px-4 py-4">
//                             {hasAccess === true ? (
//                               <Check className="w-5 h-5 text-green-500 stroke-[2px]" />
//                             ) : hasAccess === false ? (
//                               <span className="text-slate-300">—</span>
//                             ) : null}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ))}
//       </main>
//     </div>
//   );
// };

// export default PermissionManager;
