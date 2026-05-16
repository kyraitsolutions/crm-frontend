import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Workflow,
  GitBranch,
  Clock3,
  Shapes,
  PlusIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import BasicTableSkeleton from "@/components/skeltons/BasicTableSkelton";

import { useNavigate } from "react-router-dom";
import type { TChatFlow, TChatFlowStatus } from "../types/chatflow.type";

import { useChatFlowStore } from "../store/chatflow.store";
import { formatDate } from "@/utils/date.utils";
import { ToastMessageService } from "@/services";

type TFlowTableProps = {
  flows: TChatFlow[];
  loading?: boolean;
};

const TABLE_HEADERS = [
  "Flow",
  "Status",
  "Nodes",
  "Connections",
  "Version",
  "Updated",
  "Actions",
];

const STATUS_OPTIONS: TChatFlowStatus[] = ["draft", "published"];

const statusVariantMap = {
  draft: "destructive",
  published: "default",
  archived: "secondary",
} as const;

const FlowTable = ({ flows, loading }: TFlowTableProps) => {
  const navigate = useNavigate();
  const toastService = new ToastMessageService();

  const { deleteFlow, updateFlow } = useChatFlowStore((state) => state);

  const handleDeleteFlow = async (flowId: string) => {
    const response = await deleteFlow(flowId);

    if (response?.status === 200) {
      toastService.success(
        response?.message || "Your request was processed successfully",
      );
    }
    console.log(response);
  };

  const handleStatusChange = async (
    flowId: string,
    status: TChatFlowStatus,
  ) => {
    await updateFlow(flowId, {
      status,
    });
  };

  if (loading) {
    return <BasicTableSkeleton rows={7} />;
  }

  if (!flows.length) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-gradient-to-b from-muted/20 to-background p-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center size-20 rounded-3xl bg-primary/10 border">
            <Workflow className="size-10 text-primary" />
          </div>

          <h2 className="mt-6 text-2xl font-semibold tracking-tight">
            No Chat Flows Yet
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Create your first chatbot flow to automate conversations, guide
            users, and build interactive customer journeys.
          </p>

          <Button
            size="lg"
            className="mt-4 rounded-xl"
            onClick={() =>
              navigate("/dashboard/settings/chatflows/flow-builder")
            }
          >
            <PlusIcon /> Create Flow
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border bg-white rounded-xl">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-white bg-slate-700 p-3">
              #
            </TableHead>
            {TABLE_HEADERS.map((header) => (
              <TableHead
                key={header}
                className="text-xs font-semibold uppercase tracking-wide text-white bg-slate-700 p-3"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {flows.map((flow, index) => (
            <TableRow
              key={flow.id}
              className="group border-b transition-colors hover:bg-muted/20 odd:bg-gray-100"
            >
              <TableCell className="">
                <p className="flex items-center gap-4">
                  {(index + 1).toString().padStart(2, "0")}
                </p>
              </TableCell>
              {/* FLOW */}
              <TableCell className="">
                <div className="flex items-center gap-4">
                  <div className="flex size-7 items-center justify-center rounded-2xl border bg-primary/10">
                    <Workflow className="size-4 text-primary" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold tracking-tight">
                      {flow.name}
                    </h3>

                    <p className=" truncate text-xs text-muted-foreground">
                      {flow.description}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* STATUS */}
              <TableCell>
                <Select
                  value={flow.status}
                  onValueChange={(value: TChatFlowStatus) =>
                    handleStatusChange(flow.id, value)
                  }
                >
                  <SelectTrigger className="border-none shadow-none">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={statusVariantMap[status]}
                            className="capitalize border-none"
                          >
                            {status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>

              {/* NODES */}
              <TableCell>
                <div className="flex items-center gap-2 font-medium">
                  <Shapes className="size-4 text-muted-foreground" />

                  {flow.nodes?.length || 0}
                </div>
              </TableCell>

              {/* EDGES */}
              <TableCell>
                <div className="flex items-center gap-2 font-medium">
                  <GitBranch className="size-4 text-muted-foreground" />

                  {flow.edges?.length || 0}
                </div>
              </TableCell>

              {/* VERSION */}
              <TableCell>
                <Badge variant="outline" className="rounded-md px-2 py-1">
                  v {flow.version.toFixed(1) || 1}
                </Badge>
              </TableCell>

              {/* UPDATED */}
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="size-4" />

                  {formatDate(flow.updatedAt)}
                </div>
              </TableCell>

              {/* ACTIONS */}
              <TableCell>
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="opacity-60 transition-opacity group-hover:opacity-100"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/dashboard/settings/chatflows/${flow.id}/flow-builder`,
                          )
                        }
                      >
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer text-red-500 focus:text-red-500"
                        onClick={() => handleDeleteFlow(flow.id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delet
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FlowTable;

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import { MoreHorizontal, Pencil, Trash2, Workflow } from "lucide-react";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// import BasicTableSkeleton from "@/components/skeltons/BasicTableSkelton";
// import { useNavigate } from "react-router-dom";
// import type { TChatFlow } from "../types/chatflow.type";
// import { useChatFlowStore } from "../store/chatflow.store";
// import { ToastMessageService } from "@/services";

// type TFlowTableProps = {
//   flows: TChatFlow[];
//   loading?: boolean;
// };

// const FlowTable = ({ flows, loading }: TFlowTableProps) => {
//   const navigate = useNavigate();
//   const toastService = new ToastMessageService();
//   const { deleteFlow } = useChatFlowStore((state) => state);

//   const handleDeleteFlow = async (flowId: string) => {
//     const response = await deleteFlow(flowId);
//     console.log(response);
//   };

//   if (loading) {
//     return <BasicTableSkeleton rows={7} />;
//   }

//   if (!flows.length) {
//     return (
//       <div className="border border-dashed rounded-2xl bg-background p-16 mt-6">
//         <div className="flex flex-col items-center justify-center text-center">
//           <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
//             <Workflow className="size-8 text-muted-foreground" />
//           </div>

//           <h2 className="mt-5 text-xl font-semibold">No chat flows created</h2>

//           <p className="mt-2 text-sm text-muted-foreground max-w-md">
//             Create your first chatbot flow to automate conversations and build
//             interactive customer journeys.
//           </p>

//           <Button
//             className="mt-6"
//             onClick={() =>
//               navigate("/dashboard/settings/chatflows/flow-builder")
//             }
//           >
//             Create Flow
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-6 rounded-2xl border bg-background overflow-hidden">
//       <Table>
//         <TableHeader className="bg-muted/40">
//           <TableRow>
//             <TableHead className="pl-6">Flow Name</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Nodes</TableHead>
//             <TableHead>Edges</TableHead>
//             <TableHead>Version</TableHead>
//             <TableHead>Last Updated</TableHead>
//             <TableHead className="text-right pr-6">Actions</TableHead>
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {flows.map((flow) => (
//             <TableRow
//               key={flow._id}
//               className="hover:bg-muted/30 transition-colors"
//             >
//               <TableCell className="pl-6">
//                 <div>
//                   <h3 className="font-medium text-sm">{flow.name}</h3>

//                   <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
//                     {flow.description || "No description provided"}
//                   </p>
//                 </div>
//               </TableCell>

//               <TableCell>
//                 <Badge
//                   variant={
//                     flow.status === "published"
//                       ? "default"
//                       : flow.status === "archived"
//                         ? "secondary"
//                         : "outline"
//                   }
//                   className="capitalize"
//                 >
//                   {flow.status}
//                 </Badge>
//               </TableCell>

//               <TableCell>
//                 <span className="font-medium">{flow.nodes?.length || 0}</span>
//               </TableCell>

//               <TableCell>
//                 <span className="font-medium">{flow.edges?.length || 0}</span>
//               </TableCell>

//               <TableCell>
//                 <Badge variant="secondary">v{flow.version || 1}</Badge>
//               </TableCell>

//               <TableCell>
//                 <span className="text-sm text-muted-foreground">
//                   {/* {formatDistanceToNow(new Date(flow.updatedAt), {
//                     addSuffix: true,
//                   })} */}
//                 </span>
//               </TableCell>

//               <TableCell className="pr-6">
//                 <div className="flex justify-end">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         className="cursor-pointer"
//                         size="icon"
//                         variant="ghost"
//                       >
//                         <MoreHorizontal className="size-4" />
//                       </Button>
//                     </DropdownMenuTrigger>

//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem
//                         onClick={() =>
//                           navigate(
//                             `/dashboard/settings/chatflows/${flow._id}/flow-builder`,
//                           )
//                         }
//                         className="cursor-pointer"
//                       >
//                         <Pencil className="mr-2 size-4" />
//                         Edit Flow
//                       </DropdownMenuItem>

//                       <DropdownMenuItem
//                         onClick={() => handleDeleteFlow(flow._id)}
//                         className="text-red-500 focus:text-red-500 cursor-pointer"
//                       >
//                         <Trash2 className="mr-2 size-4" />
//                         Delete
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default FlowTable;
