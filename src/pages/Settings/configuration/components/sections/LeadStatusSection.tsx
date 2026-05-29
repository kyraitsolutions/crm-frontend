// LeadStatusSection.tsx

import { Circle, GripVertical, Lock, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import StatsCard from "../cards/StatsCard";
import BadgeCell from "../table/cells/BadgeCell";
import ColorCell from "../table/cells/ColorCell";
import StatusActions from "../table/cells/StatusActions";
import { DataTable } from "../table/DataTable";
import LeadStatusModal from "../../modals/LeadStatusModal";
import { useState } from "react";

const LEAD_STATUS = [
  {
    order: 1,
    label: "Open",
    key: "open",
    color: "#22C55E",
    system: true,
    default: true,
  },

  {
    order: 2,
    label: "Potential",
    key: "potential",
    color: "#F59E0B",
    system: true,
    default: false,
  },

  {
    order: 3,
    label: "Converted",
    key: "converted",
    color: "#3B82F6",
    system: true,
    default: false,
  },

  {
    order: 4,
    label: "Interested",
    key: "interested",
    color: "#8B5CF6",
    system: false,
    default: false,
  },

  {
    order: 5,
    label: "Not Interested",
    key: "not_interested",
    color: "#EC4899",
    system: false,
    default: false,
  },

  {
    order: 6,
    label: "Junk / Spam",
    key: "junk",
    color: "#F97316",
    system: false,
    default: false,
  },
];

const LeadStatusSection = () => {
  const [statuses, setStatuses] = useState(LEAD_STATUS);
  const [openModal, setOpenModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<any>(null);

  const columns = [
    {
      key: "drag",
      title: "",
      render: () => <GripVertical className="size-4 text-[#94A3B8]" />,
    },

    {
      key: "order",
      title: "Order",
      render: (value: number) => (
        <div className="flex h-10 w-14 items-center justify-center rounded-xl border border-[#E5E7EB] text-sm font-medium">
          {value}
        </div>
      ),
    },

    {
      key: "label",
      title: "Status Name",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <Circle
            className="size-3 fill-current"
            style={{
              color: row.color,
            }}
          />

          <span className="text-sm font-medium text-[#111827]">{value}</span>
        </div>
      ),
    },

    {
      key: "key",
      title: "Key",
      render: (value: string) => (
        <div className="inline-flex rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-1 text-sm text-[#475569]">
          {value}
        </div>
      ),
    },

    {
      key: "color",
      title: "Color",
      render: (value: string) => <ColorCell color={value} />,
    },

    {
      key: "system",
      title: "Type",
      render: (value: boolean) => (
        <BadgeCell
          label={value ? "System" : "Custom"}
          variant={value ? "success" : "purple"}
        />
      ),
    },

    {
      key: "actions",
      title: "Actions",
      render: (_: unknown, row: any) => (
        <StatusActions
          row={row}
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDelete(row.id)}
        />
      ),
    },
  ];

  const handleCreate = () => {
    setEditingStatus(null);
    setOpenModal(true);
  };

  const handleEdit = (row: any) => {
    setEditingStatus(row);
    setOpenModal(true);
  };

  const handleDelete = (id: number) => {
    setStatuses((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (values: any) => {
    if (editingStatus) {
      setStatuses((prev) =>
        prev.map((item) =>
          item.id === editingStatus.id
            ? {
                ...item,
                ...values,
              }
            : item,
        ),
      );
    } else {
      setStatuses((prev) => [
        ...prev,
        {
          id: Date.now(),
          order: prev.length + 1,
          system: false,
          ...values,
        },
      ]);
    }

    setOpenModal(false);
  };

  return (
    <div className="space-y-4">
      {/* TOP */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-700">
            Lead Statuses
          </h2>

          <p className="mt-2 text-sm text-[#6B7280]">
            Manage and customize lead statuses for your organization.
          </p>
        </div>

        <Button onClick={handleCreate} className="actions-btn p-2!">
          + Add Status
        </Button>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-[1fr_260px] gap-6">
        {/* LEFT */}
        <div>
          {/* STATS */}
          <div className="mb-8 grid grid-cols-3 gap-5">
            <StatsCard
              title="Total Statuses"
              value="6"
              icon={<GripVertical className="size-4 text-[#16A34A]" />}
              subtitle="All lead statuses"
              iconBg="bg-[#DCFCE7]"
            />

            <StatsCard
              title="System Statuses"
              value="3"
              icon={<Lock className="size-4 text-[#3B82F6]" />}
              subtitle="Cannot be deleted"
              iconBg="bg-[#DBEAFE]"
            />

            <StatsCard
              title="Custom Statuses"
              value="3"
              icon={<Pencil className="size-4 text-[#8B5CF6]" />}
              subtitle="Created by you"
              iconBg="bg-[#F3E8FF]"
            />
          </div>

          {/* TABS */}
          {/* <div className="mb-5 flex items-center justify-between border-b border-[#E5E7EB]">
            <div className="flex gap-8">
              <button className="relative pb-4 text-sm font-medium text-[#16A34A]">
                All Statuses
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#16A34A]" />
              </button>

              <button className="pb-4 text-sm font-medium text-[#64748B]">
                System Statuses
              </button>

              <button className="pb-4 text-sm font-medium text-[#64748B]">
                Custom Statuses
              </button>
            </div>

            <button className="pb-4 text-sm text-[#64748B]">Reorder</button>
          </div> */}

          {/* TABLE */}
          <DataTable columns={columns} data={LEAD_STATUS} />

          {/* ALERT */}
          <div className="mt-5 rounded-2xl border border-[#DCFCE7] bg-[#F0FDF4] px-5 py-4 text-sm text-[#15803D]">
            System statuses cannot be deleted but you can edit their name and
            color.
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-5">
          {/* PREVIEW */}
          {/* <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
            <h3 className="text-xl font-semibold text-[#111827]">
              Status Preview
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              This is how statuses will appear in lead dropdowns.
            </p>

            <div className="mt-6 space-y-4">
              {LEAD_STATUS.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <Circle
                    className="size-3 fill-current"
                    style={{
                      color: item.color,
                    }}
                  />

                  <span className="text-sm font-medium text-[#111827]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div> */}

          {/* TIPS */}
          <div className="rounded-3xl border border-[#DCFCE7] bg-[#F0FDF4] p-6">
            <h3 className="mb-4 text-lg font-semibold text-[#166534]">Tips</h3>

            <ul className="space-y-3 text-sm leading-6 text-[#166534]">
              <li>• Drag and drop to reorder statuses</li>

              <li>• Only custom statuses can be deleted</li>

              <li>
                • Default status will be pre-selected while creating new leads
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <LeadStatusModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        initialData={editingStatus}
      />
    </div>
  );
};

export default LeadStatusSection;

// import StatsCard from "../cards/StatsCard";
// import BadgeCell from "../table/cells/BadgeCell";
// import ColorCell from "../table/cells/ColorCell";
// import StatusActions from "../table/cells/StatusActions";
// import { DataTable } from "../table/DataTable";

// const LEAD_STATUS = [
//   {
//     label: "Open",
//     key: "open",
//     color: "#22C55E",
//     system: true,
//   },

//   {
//     label: "Potential",
//     key: "potential",
//     color: "#F59E0B",
//     system: true,
//   },

//   {
//     label: "Converted",
//     key: "converted",
//     color: "#3B82F6",
//     system: true,
//   },

//   {
//     label: "Interested",
//     key: "interested",
//     color: "#8B5CF6",
//     system: false,
//   },
// ];

// const columns = [
//   // {
//   //   key: "drag",
//   //   title: "",
//   // },
//   {
//     key: "label",

//     title: "Label",
//   },

//   {
//     key: "key",

//     title: "Key",
//   },

//   {
//     key: "color",
//     title: "Color",
//     render: (value: string) => <ColorCell color={value} />,
//   },

//   {
//     key: "system",
//     title: "Type",
//     render: (value: boolean) => (
//       <BadgeCell
//         label={value ? "System" : "Custom"}
//         variant={value ? "success" : "purple"}
//       />
//     ),
//   },

//   {
//     key: "actions",
//     title: "Actions",
//     render: (_: unknown, row: any) => <StatusActions row={row} />,
//   },
// ];

// const LeadStatusSection = () => {
//   return (
//     <div>
//       {/* TOP */}
//       <div className="mb-8 flex items-start justify-between">
//         <div>
//           <h2 className="text-[30px] font-semibold text-[#111827]">
//             Lead Statuses
//           </h2>

//           <p className="mt-2 text-sm text-[#6B7280]">
//             Customize lead statuses for your CRM workflow
//           </p>
//         </div>

//         <button className="rounded-xl bg-[#16a34a] px-5 py-3 text-sm font-medium text-white">
//           + Add Status
//         </button>
//       </div>

//       {/* STATS */}
//       <div className="mb-8 grid grid-cols-3 gap-5">
//         <StatsCard title="System Status" value="3" />
//         <StatsCard title="Custom Status" value="1" />
//         <StatsCard title="Total Status" value="4" />
//       </div>

//       {/* TABLE */}
//       <DataTable columns={columns} data={LEAD_STATUS} />
//       {/* <StatusTable data={LEAD_STATUS} /> */}
//     </div>
//   );
// };

// export default LeadStatusSection;
