import { Users, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import PermissionManager from "./permissionManager";
import { RBACService } from "@/services/rbac.service";
import { Button } from "@/components/ui/button";
import { alertManager } from "@/stores/alert.store";
import { ALERT_MESSAGES } from "@/constants/alert-and-toast-messages.path";
import { ToastMessageService } from "@/services";
import type { ApiError } from "@/types";
import RolesSkeleton from "@/components/skeltons/RolesSkeleton";
import { ROLES } from "@/rbac";
import { useAuthStore } from "@/stores";
import { RolesStoreManager, useRolesStore } from "@/stores/rbac.store";

export type TRole = {
  id: string;
  name: string;
  organizationId: string;
  permissions?: string[];
  isSystemRole?: boolean;
};

type Mode = "list" | "create" | "edit" | "view";

const Role = () => {
  const roleService = new RBACService();
  const toastService = new ToastMessageService();
  const rolesManager = new RolesStoreManager();

  const { user } = useAuthStore((state) => state);
  const { roles } = useRolesStore((state) => state);

  // const [roles, setRoles] = useState<TRole[]>([]);
  const [mode, setMode] = useState<Mode>("list");
  const [original, setOriginal] = useState({
    roleName: "",
    permissions: [] as string[],
  });

  const [form, setForm] = useState({
    roleId: "",
    roleName: "",
    permissions: [] as string[],
  });

  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const startCreate = () => {
    setForm({
      roleId: "",
      roleName: "",
      permissions: [],
    });
    setMode("create");
  };

  const startEdit = async (role: TRole) => {
    const res = await roleService.getPermissionsByRole(role.id);

    setForm({
      roleId: role.id,
      roleName: role.name,
      permissions: res.data.docs,
    });

    setOriginal({
      roleName: role.name,
      permissions: res.data.docs,
    });

    setMode("edit");
  };

  const startView = async (role: TRole) => {
    const res = await roleService.getPermissionsByRole(role.id);

    setForm({
      roleId: role.id,
      roleName: role.name,
      permissions: res.data.docs,
    });

    setOriginal({
      roleName: role.name,
      permissions: res.data.docs,
    });

    setMode("view");
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (mode === "create") {
        const response = await roleService.createRole({
          roleName: form.roleName,
          permissions: form.permissions,
        });

        if (response?.status === 201 || response?.status === 200) {
          const role = response?.data?.doc;
          const message = response?.message || "Role created successfully";
          rolesManager.setRoleTop(role);
          toastService.success(message);
        }
      }

      if (mode === "edit") {
        const payload: any = {};

        if (form.roleName !== original.roleName) {
          payload.roleName = form.roleName;
        }

        if (
          JSON.stringify(form.permissions) !==
          JSON.stringify(original.permissions)
        ) {
          payload.permissions = form.permissions;
        }

        await roleService.updateRole(form.roleId, payload);

        toastService.success("Role updated successfully");
      }

      setMode("list");
      // fetchRoles();
    } catch (err) {
      const error = err as ApiError;
      toastService.apiError(error.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    alertManager.show({
      type: "warning",
      title: "Delete Role",
      message: ALERT_MESSAGES.ROLE.CONFIRM_DELETE,
      onConfirm: () => handleDeleteRoleById(roleId),
    });
  };

  const handleDeleteRoleById = async (roleId: string) => {
    const rollback = rolesManager.deleteRoleOptimistic(roleId);
    try {
      const response = await roleService.deleteRole(roleId);

      if (response?.status === 200) {
        toastService.success(response?.message || "Role deleted successfully");
      }
    } catch (error) {
      rollback();
      const err = error as ApiError;
      toastService.apiError(err.message || "Failed to delete role");
    }
  };

  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const response = await roleService.getRoles();
      if (response.status === 200) {
        rolesManager.setRoles(response.data.docs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const currentMode =
    mode === "create"
      ? "Create Role"
      : mode === "edit"
        ? "Edit Role"
        : form.roleName;

  if (isLoadingRoles) {
    return <RolesSkeleton />;
  }

  if (mode !== "list") {
    return (
      <PermissionManager
        active={currentMode}
        permissions={form.permissions}
        setPermissions={(p: string[]) =>
          setForm((prev) => ({ ...prev, permissions: p }))
        }
        roleName={form.roleName}
        setRoleName={(name: string) =>
          setForm((prev) => ({ ...prev, roleName: name }))
        }
        isEditable={mode !== "view"}
        onBack={() => setMode("list")}
        onSave={handleSave}
        isLoading={isSaving}
      />
    );
  }

  return (
    <div className="w-full bg-gray-50">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Roles</h2>

          <button
            onClick={startCreate}
            className="bg-primary text-white px-4 py-2 text-sm font-medium rounded-lg cursor-pointer"
          >
            + Create Role
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => startView(role)}
              className="group flex items-center justify-between p-4 rounded-xl border bg-white cursor-pointer"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Users size={18} />
                </div>

                <div>
                  <p className="font-medium text-gray-800">{role.name}</p>

                  {role.isSystemRole ? (
                    <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-md flex items-center gap-1 w-fit mt-1">
                      <ShieldCheck size={12} /> System Role
                    </span>
                  ) : (
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                      Custom Role
                    </span>
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              {!role.isSystemRole && user?.role?.name === ROLES.OWNER && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition"
                >
                  <Button
                    className="size-8 bg-primary/70 rounded-full flex items-center justify-center hover:bg-primary"
                    onClick={() => startEdit(role)}
                  >
                    <Pencil size={14} />
                  </Button>

                  <Button
                    className="size-8 bg-red-200/80 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white"
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Role;

// import { Users, Pencil, Trash2, ShieldCheck, Save } from "lucide-react";
// import { useEffect, useState } from "react";
// import PermissionManager from "./permissionManager";
// import { RBACService } from "@/services/rbac.service";
// import Loader from "@/components/Loader";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { alertManager } from "@/stores/alert.store";
// import { ALERT_MESSAGES } from "@/constants/alert-and-toast-messages.path";
// import { ToastMessageService } from "@/services";
// import type { ApiError } from "@/types";
// import RolesSkeleton from "@/components/skeltons/RolesSkeleton";

// export type TRole = {
//   id: string;
//   name: string;
//   organizationId: string;
//   permissions?: string[];
//   isSystemRole?: boolean;
// };

// const Role = () => {
//   const roleService = new RBACService();
//   const toastService = new ToastMessageService();

//   const [roles, setRoles] = useState<TRole[]>([]);
//   const [active, setActive] = useState<TRole | null>(null);
//   const [isCreating, setIsCreating] = useState(false);
//   const [isEditingRole, setIsEditingRole] = useState<TRole | null>(null);

//   const [roleName, setRoleName] = useState("");
//   const [permissions, setPermissions] = useState<string[]>([]);

//   // loading state
//   const [isLoadingRoles, setIsLoadingRoles] = useState(false);
//   const [isLoadingCreate, setIsLoadingCreate] = useState(false);

//   const getPermissions = async (role: TRole) => {
//     try {
//       const response = await roleService.getPermissionsByRole(role.id);

//       if (response.status === 200) {
//         setActive({
//           ...role,
//           permissions: response.data.docs,
//         });
//       }
//     } catch (error) {
//       const err = error as ApiError;
//       toastService.apiError(err.message || "Failed to fetch permissions");
//     }
//   };

//   // ================= FETCH ROLES =================
//   const fetchRoles = async () => {
//     setIsLoadingRoles(true);
//     try {
//       const response = await roleService.getRoles();
//       if (response.status === 200) {
//         setRoles(response.data.docs);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoadingRoles(false);
//     }
//   };

//   const handleCreateRole = async () => {
//     try {
//       setIsLoadingCreate(true);
//       const payload = { roleName: roleName, permissions };
//       const response = await roleService.createRole(payload);
//       if (response.status === 201) {
//         setIsCreating(false);
//         toastService.success(response?.message || "Role created successfully");
//       }
//     } catch (error) {
//       const err = error as ApiError;
//       toastService.apiError(err.message || "Failed to create role");
//     } finally {
//       setIsLoadingCreate(false);
//     }
//   };

//   const handleUpdateRole = async (data: any, isEdit: boolean) => {
//     try {
//       // setIsLoadingCreate(true);
//       const payload = { roleName: isEditingRole?.name, permissions };
//       const response = await roleService.updateRole(
//         isEditingRole?.id as string,
//         payload,
//       );
//       if (response.status === 201) {
//         setIsCreating(false);
//         toastService.success(response?.message || "Role created successfully");
//       }
//     } catch (error) {
//       const err = error as ApiError;
//       toastService.apiError(err.message || "Failed to create role");
//     } finally {
//       // setIsLoadingCreate(false);
//     }
//   };

//   const handleEditRole = async (role: TRole) => {
//     try {
//       const response = await roleService.getPermissionsByRole(role.id);

//       if (response.status === 200) {
//         setPermissions(response.data.docs);
//         setIsEditingRole(role);
//       }
//     } catch (error) {
//       const err = error as ApiError;
//       toastService.apiError(err.message || "Failed to load role");
//     }
//   };
//   const handleDeleteRole = async (roleId: string) => {
//     alertManager.show({
//       type: "warning",
//       title: "Delete Role",
//       message: ALERT_MESSAGES.ROLE.CONFIRM_DELETE,
//       onConfirm: () => {
//         handleDeleteRoleById(roleId);
//       },
//     });
//   };
//   const handleDeleteRoleById = async (roleId: string) => {
//     try {
//       const response = await roleService.deleteRole(roleId);
//       if (response.status === 200) {
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   if (isLoadingRoles) {
//     return <RolesSkeleton />;
//   }

//   if (isCreating) {
//     return (
//       <div>
//         <PermissionManager
//           active="Create Role"
//           permissions={permissions}
//           setPermissions={setPermissions}
//           isEditable={true}
//           roleName={roleName}
//           setRoleName={setRoleName}
//           onBack={() => setIsCreating(false)}
//           isLoading={isLoadingCreate}
//           onSaveAndUpdate={handleCreateRole}
//         />
//       </div>
//     );
//   }

//   if (isEditingRole) {
//     return (
//       <PermissionManager
//         active={`${isEditingRole.name}`}
//         permissions={permissions || []}
//         setPermissions={setPermissions}
//         roleName={isEditingRole.name}
//         setRoleName={(value: string) =>
//           setIsEditingRole({ ...isEditingRole, name: value })
//         }
//         onBack={() => setIsEditingRole(null)}
//         onSave={handleUpdateRole}
//         isEditable={true}
//       />
//     );
//   }

//   if (active) {
//     return (
//       <PermissionManager
//         active={active.name}
//         setActive={() => setActive(null)}
//         permissions={active?.permissions || []}
//         onBack={() => setActive(null)}
//         isEditable={false}
//       />
//     );
//   }

//   console.log(active);

//   return (
//     <div className="w-full bg-gray-50">
//       <div className="p-4">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold">Roles</h2>

//           <button
//             onClick={() => setIsCreating(true)}
//             className="bg-primary text-white px-4 py-2  text-sm font-medium hover:opacity-90 transition rounded-lg cursor-pointer"
//           >
//             + Create Role
//           </button>
//         </div>

//         {/* List */}
//         <div className="space-y-3">
//           {roles.map((role) => (
//             <div
//               key={role.id}
//               onClick={() => getPermissions(role)}
//               className="group flex items-center justify-between p-4 rounded-xl border bg-white transition cursor-pointer"
//             >
//               {/* LEFT */}
//               <div className="flex items-center gap-4">
//                 <div className="p-2 rounded-lg bg-gray-100">
//                   <Users size={18} />
//                 </div>

//                 <div>
//                   <p className="font-medium text-gray-800">{role.name}</p>

//                   {/* Badge */}
//                   {role.isSystemRole ? (
//                     <span className="text-xs text-primary bg-green-100 px-2 py-1 rounded-md flex items-center gap-1 w-fit mt-1">
//                       <ShieldCheck size={12} /> System Role
//                     </span>
//                   ) : (
//                     <span className="text-xs text-primary bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1 w-fit">
//                       Custom Role
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* RIGHT ACTIONS */}
//               {!role.isSystemRole && (
//                 <div
//                   onClick={(e) => e.stopPropagation()}
//                   className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition"
//                 >
//                   <Button
//                     className="size-8 bg-primary/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/60 hover:text-white text-primary"
//                     onClick={() => handleEditRole(role)}
//                   >
//                     <Pencil size={4} className="" />
//                   </Button>

//                   <Button
//                     className=" hover:bg-red-300 size-8 bg-red-200 rounded-full flex items-center justify-center cursor-pointer"
//                     onClick={() => handleDeleteRole(role?.id)}
//                   >
//                     <Trash2 size={12} className="text-red-500" />
//                   </Button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Role;

// import { Users } from "lucide-react";
// import { useEffect, useState } from "react";
// import PermissionManager from "./permissionManager";
// import { ALL_ACTIONS, generateAllPermissions } from "@/rbac";
// import axios from "axios";
// import { RBACService } from "@/services/rbac.service";

// const managerPermissions = [
//   // accounts → view + edit
//   "accounts:view",
//   "accounts:edit",

//   // teams → create + view + edit
//   "teams:create",
//   "teams:view",
//   "teams:edit",

//   // leads → all
//   ...ALL_ACTIONS.map((a) => `leads:${a}`),

//   // chatbots → all
//   ...ALL_ACTIONS.map((a) => `chatbots:${a}`),

//   // leadform → all
//   ...ALL_ACTIONS.map((a) => `leadform:${a}`),
// ];

// // const Roles = [
// //   {
// //     id: "1",
// //     name: "Admin",
// //     permissions: generateAllPermissions(),
// //   },
// //   {
// //     id: "2",
// //     name: "Manager",
// //     permissions: managerPermissions,
// //   },
// // ];

// const Role = () => {
//   const roleService = new RBACService();
//   const [roles, setRoles] = useState();
//   const [active, setActive] = useState<any>(null);
//   const [isCreating, setIsCreating] = useState(false);

//   const [roleName, setRoleName] = useState("");
//   const [permissions, setPermissions] = useState<string[]>([]);

//   // VIEW ROLE
//   if (active) {
//     return (
//       <PermissionManager
//         active={active.name}
//         setActive={() => setActive(null)}
//         permissions={active.permissions}
//         isEditable={false}
//       />
//     );
//   }

//   // CREATE ROLE
//   if (isCreating) {
//     return (
//       <div>
//         <input
//           placeholder="Role Name"
//           value={roleName}
//           onChange={(e) => setRoleName(e.target.value)}
//           className="border p-2 m-4"
//         />

//         <PermissionManager
//           active="Create Role"
//           setActive={() => setIsCreating(false)}
//           permissions={permissions}
//           setPermissions={setPermissions}
//           isEditable={true}
//         />

//         <button
//           onClick={() => {
//             console.log({ roleName, permissions });
//           }}
//           className="m-4 bg-blue-600 text-white px-4 py-2"
//         >
//           Save Role
//         </button>
//       </div>
//     );
//   }

//   const getPermissions = async (roleId: string) => {
//     const response = await roleService.getPermissionsByRole(roleId);
//   };

//   const fetchRoles = async () => {
//     const response = await roleService.getRoles();
//     console.log(response);
//     if (response.status === 200) {
//       setRoles(response?.data?.docs);
//     }
//   };

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   // ROLE LIST
//   return (
//     <div>
//       <button
//         onClick={() => setIsCreating(true)}
//         className="px-4 py-2 bg-primary text-white rounded m-4"
//       >
//         + Create Role
//       </button>

//       {roles &&
//         roles?.length > 0 &&
//         roles.map((role) => (
//           <div
//             key={role.id}
//             // onClick={() => setActive(role)}
//             onClick={() => getPermissions(role?.id)}
//             className="cursor-pointer flex border-b items-center gap-6 px-10 py-5"
//           >
//             <Users size={30} />
//             <div>
//               <p>{role.name}</p>
//             </div>
//           </div>
//         ))}
//     </div>
//   );
// };

// export default Role;
