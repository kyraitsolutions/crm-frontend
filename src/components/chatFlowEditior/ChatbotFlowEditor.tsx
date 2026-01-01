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

  const [publishLoading, setPublishLoading] = useState(false);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const validateFlow = () => {
    // const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    // const edgeMap = edges;

    // 1️⃣ RULE: Check at least one end node exists
    const endNodes = nodes.filter((n) => n.data?.label === "End Chat");
    if (endNodes.length === 0) {
      toastMessageService.error("You must create an End Chat node.");
      return false;
    }

    // 2️⃣ RULE: Every node (except End Chat) must have outgoing edges
    for (const node of nodes) {
      if (node.data?.label === "End Chat") continue;

      const out = edges.filter((e) => e.source === node.id);

      if (out.length === 0) {
        toastMessageService.error(
          `Node "${node.data?.label}" must connect to another node.`
        );
        return false;
      }
    }

    // 3️⃣ RULE: Every option must have an edge
    for (const node of nodes) {
      if (node.data?.value !== "option") continue;

      const opts = node.data.elements[0]?.choices || [];

      for (let i = 0; i < opts.length; i++) {
        const el = node.data.elements[0];
        const expectedHandle = `${el.id}-choice-${i}`;

        const edgeExists = edges.some((e) => e.sourceHandle === expectedHandle);
        if (!edgeExists) {
          toastMessageService.error(
            `Option "${opts[i]}" in "${node.data.label}" must connect to a node.`
          );
          return false;
        }
      }
    }

    for (const node of nodes) {
      const incoming = edges.some((e) => e.target === node.id);
      const outgoing = edges.some((e) => e.source === node.id);

      // Allow start node to have no incoming
      const isStartNode = node.id === nodes[0].id;

      if (!incoming && !outgoing && !isStartNode) {
        toastMessageService.error(
          `Node "${node.data?.label}" must be connected or deleted.`
        );
        return false;
      }
    }

    // 4️⃣ RULE: End node must be reachable in the flow
    // const visited = new Set();

    // const dfs = (nodeId: string) => {
    //   visited.add(nodeId);
    //   const out = edges.filter((e) => e.source === nodeId);

    //   for (const e of out) {
    //     if (!visited.has(e.target)) dfs(e.target);
    //   }
    // };

    // const startNode = nodes[0]?.id;
    // dfs(startNode);

    // for (const endNode of endNodes) {
    //   if (!visited.has(endNode.id)) {
    //     toastMessageService.error(
    //       "Your flow must end at an End Chat node. Some paths do not reach it."
    //     );
    //     return false;
    //   }
    // }

    return true;
  };

  const addNewNode = (value: string, label: string) => {
    const newNode = {
      id: crypto.randomUUID(),
      type: "chat",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { elements: [], deleteNode, updateNode, value, label }, // ✅ inject deleteNode here
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, []);

  const updateNode = useCallback((id: string, newElements: any) => {
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
    if (!validateFlow()) return;

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

      if (authUser) {
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
      {/* LEFT: Flow Builder */}
      <div className="col-span-6 flex flex-col gap-3">
        {/* Header Buttons */}
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => navigate(-1)}
            className="
          bg-[rgba(55,50,47,0.08)]
          text-[#37322F]
          flex justify-center items-center
          h-8 w-10
          rounded-md
          shadow-[0px_2px_4px_rgba(55,50,47,0.12)]
          hover:bg-[rgba(55,50,47,0.12)]
          transition
        "
          >
            <ArrowLeft size={16} />
          </button>

          <button
            onClick={publishChanges}
            className="
          bg-[#37322F]
          text-[#FBFAF9]
          px-4 py-1
          rounded-[99px]
          flex items-center gap-2
          shadow-[0px_2px_4px_rgba(55,50,47,0.12)]
          hover:bg-[#2e2a28]
          transition
        "
          >
            Publish
            {publishLoading && (
              <div className="h-4 w-4 border-t-2 border-t-white rounded-full animate-spin" />
            )}
          </button>
        </div>

        {/* React Flow Area */}
        <div
          className="
        h-[80vh]
        rounded-xl
        border border-[rgba(50,45,43,0.12)]
        bg-[#FBFAF9]
        shadow-[0px_12px_24px_rgba(55,50,47,0.12)]
        overflow-hidden
      "
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeClick={onEdgeClick}
            onConnect={onConnect}
            fitView
          >
            <Controls
              className="
            bg-[#FBFAF9]/70
            rounded-md
            p-1
            shadow-[0px_2px_4px_rgba(55,50,47,0.12)]
          "
            />
            <Background className="bg-[rgba(55,50,47,0.04)]" />
          </ReactFlow>
        </div>
      </div>

      {/* RIGHT: Predefined Fields */}
      <div className="col-span-2 flex flex-col gap-4">
        <p className="text-sm font-medium text-[#37322F]">Predefined Fields</p>

        <div className="grid grid-cols-4 gap-4">
          {chatbotFields.map((item, index) => (
            <div
              key={index}
              onClick={() => addNewNode(item.value, item.label)}
              className="
            flex flex-col items-center
            cursor-pointer
            transition
            hover:scale-[1.03] hover:shadow-[0px_4px_8px_rgba(55,50,47,0.12)]
          "
            >
              <p className="text-xs text-[#847971] whitespace-nowrap">{item.label}</p>
              <div
                className="
              h-20 w-full
              rounded-xl
              border border-[rgba(50,45,43,0.12)]
              flex items-center justify-center
              text-[#847971]
              bg-[rgba(55,50,47,0.04)]
              hover:bg-[rgba(55,50,47,0.08)]
              transition
            "
              >
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}
