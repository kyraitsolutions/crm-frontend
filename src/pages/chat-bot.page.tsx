import { DataTable, type Column } from "@/components/common";
import { ChatBotService, ToastMessageService } from "@/services";
import { ChatBotManager, useChatBotStore } from "@/stores";
import type { ChatBotListItem } from "@/types";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import Chatbot from "@/components/chatFlowEditior/ChatBot";

export function ChatBotPage() {
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
      chatBotManager.setChatBotsList(res.data ?? []);
    } catch (error) {
      toastMessageService.apiError(error as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // getChatBotsList();
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

      <div>
        <Chatbot nodes={nodes && nodes} edges={edges && edges} />
      </div>

      {/* <DataTable<ChatBotListItem>
        data={chatBotLists}
        columns={columns}
        pageSize={20}
        onRowClick={(row) => navigate(`/chat-bot/${row._id}/users`)}
        sortable={true}
        paginated={true}
        tableContainerClassName="max-h-[calc(100vh-270px)] sm:max-h-[calc(100vh-220px)] shadow-none"
        loading={loading}
      />
      <div>
        {/* create button and redicrect on the /builder/:id */}
      <Link
        to="/chat-bot/builder/2"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create New Chatbot
      </Link>
    </div>
  );
}
