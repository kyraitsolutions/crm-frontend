import { DataTable, type Column } from "@/components/common";
import { ChatBotService, ToastMessageService } from "@/services";
import { ChatBotManager, useChatBotStore } from "@/stores";
import type { ChatBotListItem } from "@/types";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Chatbot from "@/components/chatFlowEditior/ChatBot";
import { DASHBOARD_PATH } from "@/constants";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";

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
      key: "status",
      header: "Status",
      className: "min-w-[200px]",

      render: (row) => (
        <div>
          <Switch
            checked={row.status}
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
  ];

  const getChatBotsList = async () => {
    try {
      setLoading(true);
      const res: any = await chatBotService.getChatBotsList(String(accountId));
      console.log(res.data.docs);
      chatBotManager.setChatBotsList(res.data.docs ?? []);
    } catch (error) {
      toastMessageService.apiError(error as any);
    } finally {
      setLoading(false);
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
            console.log(row);
            navigate(
              `${DASHBOARD_PATH?.getAccountPath(String(accountId))}/chatbot/${row.id
              }/builder`
            );
          }}
          // navigate(
          //   `/dashboard/account/690c79520e764af69f4302ed/chatbot/create`
          // )

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
