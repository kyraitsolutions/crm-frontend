import { DataTable, type Column } from "@/components/common";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { ACCOUNT_PATHS, CHATBOT_PATHS } from "@/constants/routes";
import { hasPermission, PERMISSIONS } from "@/rbac";
import { ChatBotService, ToastMessageService } from "@/services";
import { ChatBotManager, useChatBotStore } from "@/stores";
import { useAccountAccessStore } from "@/stores/account-access.store";
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
  const { permissions } = useAccountAccessStore((state) => state);

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
            disabled={!hasPermission(permissions, PERMISSIONS.CHATBOTS?.UPDATE)}
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
        <div className="">
          {hasPermission(permissions, PERMISSIONS.CHATBOTS?.DELETE) ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChatbot(row.id);
              }}
              className="bg-red-200 rounded-full text-red-500 hover:bg-red-500 duration-300 hover:text-white p-2  flex-shrink-0 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <span className="text-center">-</span>
          )}
        </div>
      ),
    },
  ];

  const getChatBotsList = async () => {
    try {
      setLoading(true);
      const res: any = await chatBotService.getChatBotsList(String(accountId));
      if (res.status === 200) {
        chatBotManager.setChatBotsList(res.data.docs ?? []);
      }
    } catch (error) {
      const err = error as ApiError;
      if (err) {
        toastMessageService.apiError(err?.message || "An error occurred");
        navigate(ACCOUNT_PATHS.byId(accountId as string));
      }
      chatBotManager.setChatBotsList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    e: React.MouseEvent<HTMLButtonElement>,
    chatbotId: string,
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
        updatedData,
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
        chatbotId,
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
  }, [accountId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:px-3 px-2 py-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-[#37322F]">
            Chatbot Directory
          </h1>
          <p className="mt-2 text-sm text-[#847971]">
            Manage deployment status, monitor engagement, and open detailed user
            insights.
          </p>
        </div>
        {chatBotLists.length > 0 &&
          hasPermission(permissions, PERMISSIONS.CHATBOTS?.CREATE) && (
            <div className="flex justify-end">
              <Link
                to={`${CHATBOT_PATHS.getCreate(String(accountId))}`}
                className="inline-flex items-center gap-1 rounded-md  bg-primary/90 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary transition-colors duration-200 focus:outline-none"
              >
                <Plus size={18} />
                Create Chatbot
              </Link>
            </div>
          )}
      </div>

      {/* <div className="grid grid-cols-[2fr_1fr]"> */}

      {chatBotLists.length > 0 ? (
        <div className="">
          <DataTable<ChatBotListItem>
            data={chatBotLists}
            columns={columns}
            pageSize={20}
            onRowClick={(row) => {
              navigate(
                `${CHATBOT_PATHS.getBuilder(
                  String(accountId),
                  String(row.id),
                )}`,
              );
            }}
            sortable={true}
            paginated={true}
            tableContainerClassName="max-h-[calc(100vh-270px)] sm:max-h-[calc(100vh-220px)] shadow-none"
            loading={loading}
          />
        </div>
      ) : (
        <div className="flex w-full justify-center items-center h-[75vh]">
          <div
            className="
          flex flex-col justify-center items-center
          max-w-xl w-full
          gap-6
          p-10
          text-center
          rounded-2xl
          border-2 border-dashed border-[rgba(50,45,43,0.20)]
          bg-[rgba(255,255,255,0)]
        "
          >
            {/* Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full  bg-primary text-white border-2 ">
              <Plus className="h-8 w-8]" />
            </div>

            {/* Text */}
            <div>
              <h2 className="text-xl font-medium text-[#37322F]">
                No Chatbot found
              </h2>
              <p className="mt-2 text-sm text-[#847971]">
                Get started by creating your first chatbot for your website or
                app.
              </p>
            </div>

            {/* CTA */}
            {hasPermission(permissions, PERMISSIONS.CHATBOTS?.CREATE) && (
              <Link
                to={`${CHATBOT_PATHS.getCreate(String(accountId))}`}
                className="
            inline-flex items-center gap-2
            rounded-[99px]
            bg-primary
            px-5 py-2
            text-sm font-medium text-[#FBFAF9]
            shadow-[0px_2px_4px_rgba(55,50,47,0.12)]
            transition
            hover:opacity-90
          "
              >
                + Create First Chatbot
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
