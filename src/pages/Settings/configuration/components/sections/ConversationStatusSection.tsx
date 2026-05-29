// ConversationStatusSection.tsx

import { useState } from "react";

import {
  Circle,
  GripVertical,
  Lock,
  MessageSquare,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import StatsCard from "../cards/StatsCard";

import BadgeCell from "../table/cells/BadgeCell";
import ColorCell from "../table/cells/ColorCell";
import StatusActions from "../table/cells/StatusActions";

import { DataTable } from "../table/DataTable";
import LeadStatusModal from "../../modals/LeadStatusModal";

const INITIAL_CONVERSATION_STATUS = [
  {
    id: 1,
    order: 1,
    label: "Open",
    key: "open",
    color: "#22C55E",
    system: true,
  },

  {
    id: 2,
    order: 2,
    label: "Pending",
    key: "pending",
    color: "#F59E0B",
    system: true,
  },

  {
    id: 3,
    order: 3,
    label: "Closed",
    key: "closed",
    color: "#EF4444",
    system: true,
  },
];

const ConversationStatusSection = () => {
  const [statuses, setStatuses] = useState(INITIAL_CONVERSATION_STATUS);

  const [openModal, setOpenModal] = useState(false);

  const [editingStatus, setEditingStatus] = useState<any>(null);

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

  return (
    <>
      <div className="space-y-4">
        {/* TOP */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-700">
              Conversation Statuses
            </h2>

            <p className="mt-2 text-sm text-[#6B7280]">
              Manage conversation lifecycle statuses
            </p>
          </div>

          <Button onClick={handleCreate} className="actions-btn p-2!">
            + Add Status
          </Button>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-6">
          {/* LEFT */}
          <div>
            {/* STATS */}
            <div className="mb-8 grid grid-cols-3 gap-5">
              <StatsCard
                title="Total Statuses"
                value={String(statuses.length)}
                icon={<MessageSquare className="size-4 text-[#16A34A]" />}
                subtitle="All conversation statuses"
                iconBg="bg-[#DCFCE7]"
              />

              <StatsCard
                title="System Statuses"
                value={String(statuses.filter((item) => item.system).length)}
                icon={<Lock className="size-4 text-[#3B82F6]" />}
                subtitle="Cannot be deleted"
                iconBg="bg-[#DBEAFE]"
              />

              <StatsCard
                title="Custom Statuses"
                value={String(statuses.filter((item) => !item.system).length)}
                icon={<Pencil className="size-4 text-[#8B5CF6]" />}
                subtitle="Created by you"
                iconBg="bg-[#F3E8FF]"
              />
            </div>

            {/* TABLE */}
            <DataTable columns={columns} data={statuses} />

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
              <h3 className="text-lg font-semibold text-[#111827]">
                Status Preview
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                This is how statuses appear in conversation dropdowns.
              </p>

              <div className="mt-6 space-y-4">
                {statuses.map((item) => (
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
              <h3 className="mb-4 text-lg font-semibold text-[#166534]">
                Tips
              </h3>

              <ul className="space-y-3 text-sm leading-6 text-[#166534]">
                <li>• Use clear statuses for conversation tracking</li>

                <li>• System statuses cannot be removed</li>

                <li>• Custom statuses help teams organize chats</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <LeadStatusModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        initialData={editingStatus}
      />
    </>
  );
};

export default ConversationStatusSection;
