import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import { hasPermission, PERMISSIONS } from "@/rbac";
import { ChatBotService, ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import { useAccountAccessStore } from "@/stores/account-access.store";
import type { ApiError } from "@/types";
import { ArrowLeft } from "lucide-react";
import { MdAdd } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import type { Connection, NodeMouseHandler } from "reactflow";
import Loader from "../Loader";
import { Button } from "../ui/button";
import CustomEdge from "./edges/CustomEdge";
import { nodeTypes } from "./nodes";
import NodeSettingsRenderer from "./nodeSetting/NodeSettingsRenderer";
import NodeSidebar from "./sidebar/NodeSidebar";
import type { TAppEdge, TAppNode, TAppNodeData } from "./types/types";
import { createInitialElementsData } from "./utils/utils";
import CustomConnectionLine from "./edges/CustomConnectionLine";

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
      value: "email",
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
  const { permissions } = useAccountAccessStore((state) => state);

  const [nodes, setNodes, onNodesChange] = useNodesState<TAppNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<TAppEdge>([]);
  const [selectedNode, setSelectedNode] = useState<TAppNode | null>(null);
  const [nodeSettingOpen, setNodeSettingOpen] = useState(false);

  const [fieldOpen, setFieldOpen] = useState(false);

  const [publishLoading, setPublishLoading] = useState(false);

  const handleCloseSidebar = () => {
    setFieldOpen(false);
  };

  // const onConnect = useCallback(
  //   (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
  //   [setEdges],
  // );
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) =>
      addEdge(
        {
          id: crypto.randomUUID(), // 🔥 important
          ...params,
          type: "custom",
          data: {
            onDelete: (id: string) =>
              setEdges((eds) => eds.filter((e) => e.id !== id)),
          },
        },
        eds,
      ),
    );
  }, []);

  const validateFlow = () => {
    // const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    // const edgeMap = edges;

    // RULE: Check nodes does not empty content
    const isNodeWithEmptyContent = nodes.some((n) =>
      n.data?.elements?.some((el: any) => el.content === ""),
    );

    if (isNodeWithEmptyContent) {
      toastMessageService.error("All nodes must have content.");
      return false;
    }

    // 1️⃣ RULE: Check at least one end node exists

    const endNodes = nodes.filter((n) => n.data?.label === "End Chat");
    // if (endNodes.length === 0) {
    //   toastMessageService.error("You must create an End Chat node.");
    //   return false;
    // }

    // 2️⃣ RULE: Every node (except End Chat) must have outgoing edges
    for (const node of nodes) {
      if (node.data?.label === "End Chat") continue;

      const out = edges.filter((e) => e.source === node.id);

      if (out.length === 0) {
        toastMessageService.error(
          `Node "${node.data?.label}" must connect to another node.`,
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
            `Option "${opts[i]}" in "${node.data.label}" must connect to a node.`,
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
          `Node "${node.data?.label}" must be connected or deleted.`,
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

  const addNewNode = (type: string, label: string) => {
    console.log(type);
    const newNode = {
      id: crypto.randomUUID(),
      type: type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label,
        type,
        payload: createInitialElementsData(type),
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(node as TAppNode); // safe cast
    setNodeSettingOpen(true);
    setFieldOpen(false);
  }, []);

  const hydratedEdges = function (edges: TAppEdge[]) {
    return edges.map((edge: any) => ({
      ...edge,
      type: "custom",
      data: {
        ...edge.data,
        onDelete: (id: string) =>
          setEdges((eds) => eds.filter((e) => e.id !== id)),
      },
    }));
  };

  const getChatbotFlow = async () => {
    try {
      const response = await chatbot.getChatBotFlow(
        String(accountId),
        String(chatBotId),
      );

      if (response?.status === 200 || response?.status === 201) {
        const data = response?.data?.doc;
        const nodes = data?.nodes || [];
        const edges = data?.edges || [];
        const hydEdges = hydratedEdges(edges);

        setNodes(nodes);
        setEdges(hydEdges);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const publishChanges = async () => {
    if (!validateFlow()) return;
    setPublishLoading(true);
    try {
      const payloadData = {
        nodes,
        edges,
      };

      if (authUser) {
        const response = await chatbot.createChatBotFlow(
          String(accountId),
          String(chatBotId),
          payloadData,
        );

        if (response?.status === 200 || response?.status === 201) {
          toastMessageService.success(
            response?.message || "Your request was processed successfully",
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

  useEffect(() => {
    getChatbotFlow();
  }, []);

  return (
    <div className="w-full relative gap-4 p-4">
      {/*LEFT: REACT FLOW EDITOR */}
      <div className=" h-[90dvh] absolute top-0 left-0 w-full overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // onConnectEnd={onConnectEnd}
          onNodeClick={onNodeClick}
          defaultChecked
          connectionLineComponent={CustomConnectionLine}
          // connectionLineStyle={""}
          edgeTypes={{ custom: CustomEdge }}
          defaultEdgeOptions={{
            type: "custom",
          }}
        >
          <Controls showFitView className="bg-gray-100! rounded-md" />
          <Background
            variant={BackgroundVariant.Lines}
            gap={100}
            size={2}
            className="bg-gray-200"
          />

          <div className="flex z-50 w-full h-14 justify-between! items-center px-5 bg-gray-100 absolute">
            <Button
              onClick={() => navigate(-1)}
              className=" cursor-pointer text-[#37322F]flex justify-center items-center rounded-md gap-1 transition"
            >
              <ArrowLeft size={16} /> <span className="text-sm">Back</span>
            </Button>

            {hasPermission(
              permissions,
              PERMISSIONS.CHATBOTS.CREATE || PERMISSIONS.CHATBOTS.UPDATE,
            ) && (
              <div className="flex items-center gap-4">
                <Button
                  disabled={publishLoading}
                  onClick={publishChanges}
                  className="bg-primary text-white px-5 py-2 rounded-full flex items-center gap-2 disabled:opacity-60"
                >
                  Publish
                  {publishLoading && <Loader />}
                </Button>

                <button
                  onClick={() => setFieldOpen(!fieldOpen)}
                  className="flex cursor-pointer bg-primary text-white  p-2 rounded-full justify-end "
                >
                  <div
                    className={`${fieldOpen && "-rotate-45"} transition-all duration-300`}
                  >
                    <MdAdd size={20} />
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* NODE SETTING SIDEBAR RENDERER  */}

          <NodeSettingsRenderer
            open={nodeSettingOpen}
            onClose={() => setNodeSettingOpen(false)}
            node={selectedNode as TAppNode}
          />
        </ReactFlow>
      </div>

      {/* RIGHT: NODES SIDEBAR */}
      {fieldOpen && (
        <NodeSidebar onAddNode={addNewNode} onClose={handleCloseSidebar} />
      )}
    </div>
  );
}
