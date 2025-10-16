import { DataTable, type Column } from "@/components/common";

interface ChatBotUser {
  id: string;
  name: string;
  lastInteraction: string;
  totalResponses: number;
}

const mockData: ChatBotUser[] = [
  {
    id: "cbu-001",
    name: "John Doe",
    lastInteraction: "Sep 21, 2025",
    totalResponses: 132,
  },
  {
    id: "cbu-002",
    name: "Jane Smith",
    lastInteraction: "Sep 21, 2025",
    totalResponses: 143,
  },
  {
    id: "cbu-003",
    name: "John Doe",
    lastInteraction: "Sep 21, 2025",
    totalResponses: 1432,
  },
  {
    id: "cbu-004",
    name: "John Doe",
    lastInteraction: "Sep 21, 2025",
    totalResponses: 14325,
  },
];

export function ChatBotUsersPage() {
  const columns: Column<ChatBotUser>[] = [
    {
      key: "name",
      header: "User",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.id}</div>
        </div>
      ),
    },
    {
      key: "lastInteraction",
      header: "Last Interaction",
      cellClassName: "whitespace-nowrap text-gray-700",
    },
    {
      key: "totalResponses",
      header: "Total Responses",
      cellClassName: "whitespace-nowrap text-gray-700",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium `}
        >
          {row.totalResponses.toLocaleString()}
        </span>
      ),
    },
  ];
  return (
    <div className="space-y-6 lg:px-4 px-2 py-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Automate Assist</h1>
        <p className="text-muted-foreground">
          Review individual user engagement and jump into conversation history.
        </p>
      </div>
      <DataTable
        data={mockData}
        columns={columns}
        pageSize={3}
        sortable={true}
        paginated={true}
        tableContainerClassName="max-h-[calc(100vh-270px)] sm:max-h-[calc(100vh-220px)] shadow-none"
      />
    </div>
  );
}
