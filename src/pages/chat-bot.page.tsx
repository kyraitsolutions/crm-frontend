import { DataTable, type Column } from "@/components/common";
import { ChatBotService, ToastMessageService } from "@/services";
import { ChatBotManager, useChatBotStore } from "@/stores";
import type { ChatBotListItem } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export function ChatBotPage() {
  const navigate = useNavigate();
  const chatBotService = new ChatBotService();
  const chatBotManager = new ChatBotManager();
  const toastMessageService = new ToastMessageService();
  const chatBotLists = useChatBotStore((state) => state.chatBotsList);
  const [loading, setLoading] = useState(false);

  const columns: Column<ChatBotListItem>[] = [
    // {
    //   key: "id",
    //   header: "Id",
    //   className: "min-w-[200px]",
    //   render: (row) => (
    //     <div>
    //       <div className="font-medium text-gray-900">{row.id}</div>
    //     </div>
    //   ),
    // },
    {
      key: "name",
      header: "Chatbot",
      className: "min-w-[200px]",

      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.description}</div>
        </div>
      ),
    },
    {
      key: "createdDisplay",
      header: "Created",
      cellClassName: "whitespace-nowrap text-gray-700",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {moment(row.createdAt).format("DD-MM-YYYY")}
          </div>
        </div>
      ),
    },
  ];

  const getChatBotsList = async () => {
    try {
      setLoading(true);
      const res: any = await chatBotService.getChatBotsList();
      chatBotManager.setChatBotsList(res.data?.docs ?? []);
    } catch (error) {
      toastMessageService.apiError(error as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChatBotsList();
  }, []);

  return (
    <div className="space-y-6 lg:px-4 px-2 py-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chatbot Directory</h1>
        <p className="text-muted-foreground">
          Manage deployment status, monitor engagement, and open detailed user
          insights.
        </p>
      </div>

      <DataTable
        data={chatBotLists}
        columns={columns}
        pageSize={20}
        onRowClick={(row) => navigate(`/chat-bot/${row._id}/users`)}
        sortable={true}
        paginated={true}
        tableContainerClassName="max-h-[calc(100vh-270px)] sm:max-h-[calc(100vh-220px)] shadow-none"
        loading={loading}
      />
    </div>
  );
}
