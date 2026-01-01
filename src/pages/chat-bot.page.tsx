import { DataTable, type Column } from "@/components/common";
import { Switch } from "@/components/ui/switch";
import { DASHBOARD_PATH } from "@/constants";
import { ChatBotService, ToastMessageService } from "@/services";
import { ChatBotManager, useChatBotStore } from "@/stores";
import { alertManager } from "@/stores/alert.store";
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
      key: "lastActivity",
      header: "Last Activity",
      cellClassName: "whitespace-nowrap text-gray-700",
      render: (row) => (
        <div>
          <div className="font-medium capitalize text-gray-900">
            {moment(row.updatedAt).fromNow()}
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
            className="text-red-600 hover:text-red-800 p-2 rounded-md flex-shrink-0 cursor-pointer"
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

  const deleteChatBot = async (chatbotId: string) => {
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

  const handleDeleteChatbot = async (chatbotId: string) => {
    alertManager.show({
      type: "warning",
      title: "Delete Account",
      message: "Are you sure you want to delete this account?",
      onConfirm: () => {
        deleteChatBot(chatbotId);
      },
    });
    // otpimistic delete
  };

  useEffect(() => {
    getChatBotsList();
  }, []);

  return (
    <div className="space-y-6 lg:px-4 px-2 py-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chatbot Directory</h1>
          <p className="text-muted-foreground">
            Manage deployment status, monitor engagement, and open detailed user
            insights.
          </p>
        </div>
        {chatBotLists.length > 0 && <div className="flex justify-end">
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
        }
      </div>

      {/* <div className="grid grid-cols-[2fr_1fr]"> */}
      {chatBotLists.length > 0 ? <div className="">
        <DataTable<ChatBotListItem>
          data={chatBotLists}
          columns={columns}
          pageSize={20}
          onRowClick={(row) => {
            navigate(
              `${DASHBOARD_PATH?.getAccountPath(String(accountId))}/chatbot/${row.id
              }/builder`
            );
          }}
          sortable={true}
          paginated={true}
          tableContainerClassName="max-h-[calc(100vh-270px)] sm:max-h-[calc(100vh-220px)] shadow-none"
          loading={loading}
        />
      </div>
        :
        <div className="flex w-full justify-center items-center h-[75vh]">
          <div className="flex flex-col justify-center items-center max-w-xl w-full gap-6 p-10 text-center shadow-sm rounded-2xl border border-dashed">
            {/* Plus Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>

            {/* Text */}
            <div>
              <h2 className="text-xl font-semibold">No chatbot found</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first chatbot for your website or app.
              </p>
            </div>

            {/* CTA Button */}
            <Link
              to={`${DASHBOARD_PATH?.getAccountPath(
                String(accountId)
              )}/chatbot/create`}
              className="inline-flex items-center gap-1 rounded-2xl border border-slate-300 bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Create First Chatbot
            </Link>
          </div>
        </div>
      }
    </div>
  );
}
