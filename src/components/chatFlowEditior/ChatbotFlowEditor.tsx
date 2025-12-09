import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import { ChatBotService, ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import {
  ArrowLeft,
  ListChecks,
  Mail,
  MessageSquare,
  Phone,
  Smile,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import type { Connection, Edge } from "reactflow";
import { nodeTypes } from "./nodes";
import type { ApiError } from "@/types";

export const mandatoryNodes = [
  {
    id: crypto.randomUUID(),
    type: "chat",
    position: {
      x: -533.3324949205546,
      y: -292.33168131775733,
    },
    width: 256,
    height: 233,
    selected: false,
    positionAbsolute: {
      x: -533.3324949205546,
      y: -292.33168131775733,
    },
    dragging: false,
    data: {
      elements: [
        {
          id: crypto.randomUUID(),
          type: "text",
          content: "Welcome to my chatbot!",
          date: "",
        },
        {
          id: crypto.randomUUID(),
          type: "text",
          content: "May I know your name?",
          date: "",
        },
      ],
      value: "text",
      label: "Greeting Message",
    },
  },
  {
    id: crypto.randomUUID(),
    type: "chat",
    position: {
      x: -529.4490032042012,
      y: -21.96189036116155,
    },
    width: 256,
    height: 167,
    selected: false,
    positionAbsolute: {
      x: -529.4490032042012,
      y: -21.96189036116155,
    },
    dragging: false,
    data: {
      elements: [
        {
          id: crypto.randomUUID(),
          type: "text",
          content: "What is your email?",
          date: "",
        },
      ],
      value: "text",
      label: "Email",
    },
  },
  {
    id: crypto.randomUUID(),
    type: "chat",
    position: {
      x: -207.27863400149675,
      y: -163.5291921440941,
    },
    width: 256,
    height: 167,
    selected: false,
    positionAbsolute: {
      x: -207.27863400149675,
      y: -163.5291921440941,
    },
    dragging: false,
    data: {
      elements: [
        {
          id: crypto.randomUUID(),
          type: "text",
          content: "What is your mobile number?",
          date: "",
        },
      ],
      value: "text",
      label: "Phone",
    },
  },
  {
    id: crypto.randomUUID(),
    type: "chat",
    position: {
      x: 101.8910186592114,
      y: -164.72482082041157,
    },
    width: 256,
    height: 167,
    selected: true,
    positionAbsolute: {
      x: 101.8910186592114,
      y: -164.72482082041157,
    },
    dragging: false,
    data: {
      elements: [
        {
          id: crypto.randomUUID(),
          type: "text",
          content: "Thank you for contacting us.",
          date: "",
        },
      ],
      value: "text",
      label: "End Chat",
    },
  },
];

export const mandatoryEdges = [
  {
    id: crypto.randomUUID(),
    source: mandatoryNodes[0].id,
    target: mandatoryNodes[1].id,
    animated: true,
  },
  {
    id: crypto.randomUUID(),
    source: mandatoryNodes[1].id,
    target: mandatoryNodes[2].id,
    animated: true,
  },
  {
    id: crypto.randomUUID(),
    source: mandatoryNodes[2].id,
    target: mandatoryNodes[3].id,
    animated: true,
  },
];

export default function ChatbotFlowEditor() {
  const navigate = useNavigate();
  const chatbot = new ChatBotService();
  const { accountId, chatBotId } = useParams();
  const toastMessageService = new ToastMessageService();

  const authUser = useAuthStore((state) => state.user);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeCount, setNodeCount] = useState(1);

  const [publishLoading, setPublishLoading] = useState(false);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNewNode = (value, label) => {
    const newNode = {
      id: crypto.randomUUID(),
      type: "chat",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { elements: [], deleteNode, updateNode, value, label }, // ✅ inject deleteNode here
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const deleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, []);

  const updateNode = useCallback((id, newElements) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                elements: newElements,
                deleteNode,
                updateNode,
              },
            }
          : node
      )
    );
  }, []);

  const onEdgeClick = useCallback((event: any, edge: any) => {
    event.stopPropagation();
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, []);

  const getChatbotFlow = async () => {
    try {
      const response = await chatbot.getChatBotFlow(
        String(accountId),
        String(chatBotId)
      );

      if (response?.status === 200 || response?.status === 201) {
        const data = response?.data?.docs;
        const nodes = data?.nodes || [];
        const edges = data?.edges || [];

        handleRestore(nodes, edges);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const publishChanges = async () => {
    alert("sdhfs");
    setPublishLoading(true);
    const serializableNodes = nodes.map(({ data, ...rest }) => ({
      ...rest,
      data: { ...data, elements: data.elements },
    }));

    try {
      const payloadData = {
        nodes: serializableNodes,
        edges,
      };

      if (authUser && authUser?.account?.id) {
        const response = await chatbot.createChatBotFlow(
          String(accountId),
          String(chatBotId),
          payloadData
        );

        if (response?.status === 200 || response?.status === 201) {
          toastMessageService.success(
            response?.message || "Your request was processed successfully"
          );
        }
      }
    } catch (error) {
      const err = error as ApiError;

      if (err) {
        toastMessageService.apiError(err.message);
      }
    } finally {
      setPublishLoading(false);
    }
  };

  const handleRestore = (nodes: any, edges: any) => {
    if (nodes && edges) {
      // ✅ Reattach functions to every node
      const hydratedNodes = nodes.map((node: any) => ({
        ...node,
        data: {
          ...node.data,
          deleteNode,
          updateNode,
        },
      }));

      setNodes(hydratedNodes);
      setEdges(edges);
    }
  };

  useEffect(() => {
    getChatbotFlow();
  }, []);

  // useEffect(() => {
  //   const savedNodes = localStorage.getItem("nodes");
  //   const savedEdges = localStorage.getItem("edges");

  //   if (savedNodes && savedEdges) {
  //     const parsedNodes = JSON.parse(savedNodes);
  //     const parsedEdges = JSON.parse(savedEdges);

  //     // ✅ Reattach functions to every node
  //     const hydratedNodes = parsedNodes.map((node: any) => ({
  //       ...node,
  //       data: {
  //         ...node.data,
  //         deleteNode,
  //         updateNode,
  //       },
  //     }));

  //     setNodes(hydratedNodes);
  //     setEdges(parsedEdges);
  //   }
  // }, []);

  const chatbotFields = [
    {
      label: "Name",
      value: "text",
      icon: <User className="w-4 h-4 text-primary" />,
    },
    {
      label: "Email",
      value: "text",
      icon: <Mail className="w-4 h-4 text-primary" />,
    },
    {
      label: "Phone",
      value: "text",
      icon: <Phone className="w-4 h-4 text-primary" />,
    },
    {
      label: "Provided Option",
      value: "option",
      icon: <ListChecks className="w-4 h-4 text-primary" />,
    },
    {
      label: "End Chat",
      value: "text",
      icon: <MessageSquare className="w-4 h-4 text-primary" />,
    },
    {
      label: "Greeting Message",
      value: "text",
      icon: <Smile className="w-4 h-4 text-primary" />,
    },

    // 🔹 Common CRM Chatbot Builder Fields
    // { name: "Bot Personality", icon: <Bot className="w-4 h-4 text-primary" /> },
    // { name: "Integrations", icon: <Link className="w-4 h-4 text-primary" /> },
    // { name: "Knowledge Base", icon: <Database className="w-4 h-4 text-primary" /> },
    // { name: "Automation Flow", icon: <Zap className="w-4 h-4 text-primary" /> },
    // { name: "Follow-up Reminder", icon: <Clock className="w-4 h-4 text-primary" /> },
    // { name: "Custom Forms", icon: <FileText className="w-4 h-4 text-primary" /> },
    // { name: "Lead Tagging", icon: <Tags className="w-4 h-4 text-primary" /> },
    // { name: "Qualification Questions", icon: <ClipboardCheck className="w-4 h-4 text-primary" /> },
    // { name: "Bot Settings", icon: <Settings className="w-4 h-4 text-primary" /> },
    // { name: "Conditional Logic", icon: <Filter className="w-4 h-4 text-primary" /> },
    // { name: "Analytics & Reports", icon: <BarChart3 className="w-4 h-4 text-primary" /> },
    // { name: "Live Chat Handoff", icon: <MessageCircle className="w-4 h-4 text-primary" /> },
    // { name: "Auto Reply Templates", icon: <Send className="w-4 h-4 text-primary" /> },
  ];

  return (
    <div className="w-full grid grid-cols-8 gap-6">
      <div className="col-span-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-slate-700 text-white flex justify-center items-center h-7 w-10 rounded cursor-pointer "
          >
            <ArrowLeft size={16} />
          </button>

          <button
            onClick={publishChanges}
            className="bg-slate-800 text-white px-4 py-1 rounded  cursor-pointer flex items-center gap-2"
          >
            Publish{" "}
            {publishLoading && (
              <div className="size-4 border-t border-t-white rounded-full animate-spin" />
            )}
          </button>
        </div>

        <div className="h-[70vh] border border-gray-300 rounded mt-2">
          {/* <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeClick={onEdgeClick}
            onConnect={onConnect}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow> */}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeClick={onEdgeClick}
            onConnect={onConnect}
            // connectable={true}
            fitView
          >
            {/* <MiniMap /> */}
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>

      <div className="col-span-2">
        <p>Predefined Fields</p>
        <div className="grid grid-cols-4 gap-5 mt-3 ">
          {chatbotFields.map((item, index) => (
            <div
              onClick={() => addNewNode(item.value, item.label)}
              key={index}
              className=""
            >
              <p className="text-xs whitespace-nowrap">{item.label}</p>
              <div className="border h-20 rounded-xl flex items-center mt-2 justify-center text-gray-400 cursor-pointer hover:bg-gray-100">
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
