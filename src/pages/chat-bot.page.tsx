import Chatbot from "@/components/chatFlowEditior/ChatBot";
import { DataTable, type Column } from "@/components/common";
import { Switch } from "@/components/ui/switch";
import { DASHBOARD_PATH } from "@/constants";
import { ChatBotService, ToastMessageService } from "@/services";
import { ChatBotManager, useChatBotStore } from "@/stores";
import type { ApiError, ChatBotListItem } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export function ChatBotPage() {
  const { accountId } = useParams();

  // const [nodes, setNodes] = useState([]);
  // const [edges, setEdges] = useState([]);
  const navigate = useNavigate();
  const chatBotService = new ChatBotService();
  const chatBotManager = new ChatBotManager();
  const toastMessageService = new ToastMessageService();
  const chatBotLists = useChatBotStore((state) => state.chatBotsList);
  const [loading, setLoading] = useState(false);

  const columns: Column<ChatBotListItem>[] = [
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
      key: "status",
      header: "Status",
      className: "min-w-[200px]",

      render: (row) => (
        <div>
          <Switch
            checked={row.status}
            className="cursor-pointer"
            onClick={(e) => handleUpdateStatus(e, row.id)}
          />
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
    {
      key: "action",
      header: "Action",
      cellClassName: "whitespace-nowrap text-gray-700",
      render: (row) => (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteChatbot(row.id);
            }}
            className="text-red-600 hover:text-red-800 p-2 rounded-md flex-shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const getChatBotsList = async () => {
    try {
      setLoading(true);
      const res: any = await chatBotService.getChatBotsList(String(accountId));
      chatBotManager.setChatBotsList(res.data.docs ?? []);
    } catch (error) {
      toastMessageService.apiError(error as any);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    e: React.MouseEvent<HTMLButtonElement>,
    chatbotId: string
  ) => {
    e.stopPropagation();

    const chatbot = chatBotLists.find((chatbot) => chatbot.id === chatbotId);
    if (!chatbot) return;

    const previousStatus = chatbot.status;
    const newStatus = !previousStatus;

    chatBotManager.updateChatBotStatus(chatbotId, newStatus);

    try {
      const updatedData = {
        status: newStatus,
      };
      const response = await chatBotService.updateChatBot(
        String(accountId),
        chatbotId,
        updatedData
      );

      if (response.status === 200) {
        toastMessageService.apiSuccess(response.message);
      }
    } catch (error) {
      const err = error as ApiError;
      if (err) {
        chatBotManager.updateChatBotStatus(chatbotId, previousStatus);
        toastMessageService.apiError(err.message);
      }
    }
  };

  const handleDeleteChatbot = async (chatbotId: string) => {
    // otpimistic delete

    const chatbot = chatBotLists.find((chatbot) => chatbot.id === chatbotId);
    if (!chatbot) return;

    chatBotManager.deleteChatBot(chatbotId);

    try {
      const response = await chatBotService.deleteChatBot(
        String(accountId),
        chatbotId
      );

      if (response.status === 200) {
        toastMessageService.apiSuccess(response.message);
      }
    } catch (error) {
      const err = error as ApiError;
      if (err) {
        chatBotManager.setChatBotsList(chatBotLists);
        toastMessageService.apiError(err.message);
      }
    }
  };

  useEffect(() => {
    getChatBotsList();
  }, []);

  const nodes = JSON.parse(localStorage.getItem("nodes") || "[]");
  const edges = JSON.parse(localStorage.getItem("edges") || "[]");

  // useEffect(() => {
  //   const webSocket = new WebSocket("ws://localhost:3000");

  //   webSocket.onopen = function () {
  //     // console.log("WebSocket connection opened");
  //     // const payload = JSON.stringify({ event: "chat:messages" });
  //     // webSocket.send(payload);
  //   };

  //   webSocket.onmessage = function (event) {
  //     const wsResponse = JSON.parse(event.data);

  //     console.log(wsResponse);

  //     // setNodes(wsResponse?.data?.nodes);
  //     // setEdges(wsResponse?.data?.edges);
  //   };
  // }, []);

  return (
    <div className="space-y-6 lg:px-4 px-2 py-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chatbot Directory</h1>
        <p className="text-muted-foreground">
          Manage deployment status, monitor engagement, and open detailed user
          insights.
        </p>
      </div>

      <div className="flex justify-end">
        {/* create button and redicrect on the /builder/:id */}
        <Link
          to={`${DASHBOARD_PATH?.getAccountPath(
            String(accountId)
          )}/chatbot/create`}
          className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <Plus size={18} />
          Create Chatbot
        </Link>
      </div>

      <div className="grid grid-cols-[2fr_1fr]">
        <DataTable<ChatBotListItem>
          data={chatBotLists}
          columns={columns}
          pageSize={20}
          onRowClick={(row) => {
            navigate(
              `${DASHBOARD_PATH?.getAccountPath(String(accountId))}/chatbot/${
                row.id
              }/builder`
            );
          }}
          sortable={true}
          paginated={true}
          tableContainerClassName="max-h-[calc(100vh-270px)] sm:max-h-[calc(100vh-220px)] shadow-none"
          loading={loading}
        />
        <Chatbot nodes={nodes && nodes} edges={edges && edges} />
      </div>
    </div>
  );
}
