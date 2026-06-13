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

import FlowModal from "@/pages/ChatFlows/components/FlowModal";
import { chatflowService } from "@/pages/ChatFlows/services/chatflow.service";
import { hasPermission, PERMISSIONS } from "@/rbac";
import { ChatBotService, ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import { useAccountAccessStore } from "@/stores/account-access.store";
import type { ApiError } from "@/types";
import { ArrowLeft, Upload, Workflow } from "lucide-react";
import { MdAdd, MdOutlineDrafts } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import type { Connection, NodeMouseHandler } from "reactflow";
import Loader from "../Loader";
import { Button } from "../ui/button";
import CustomConnectionLine from "./edges/CustomConnectionLine";
import CustomEdge from "./edges/CustomEdge";
import EmptyFlowState from "./EmptyFlowState";
import FlowEditorLoading from "./FlowEditorLoading";
import { nodeTypes } from "./nodes";
import NodeSettingsRenderer from "./nodeSetting/NodeSettingsRenderer";
import NodeSidebar from "./sidebar/NodeSidebar";
import type {
  TAppEdge,
  TAppNode,
  TAppNodeData,
  TButtonNodeData,
} from "./types/types";
import { createInitialElementsData } from "./utils/utils";
import {
  validateButtonNode,
  validateSendMessageNode,
} from "./utils/nodesValidation";

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
  const { chatflowId } = useParams();
  const toastMessageService = new ToastMessageService();

  const { user: authUser, accountId } = useAuthStore((state) => state);
  const { permissions } = useAccountAccessStore((state) => state);

  const [nodes, setNodes, onNodesChange] = useNodesState<TAppNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<TAppEdge>([]);
  const [selectedNode, setSelectedNode] = useState<TAppNode | null>(null);
  const [nodeSettingOpen, setNodeSettingOpen] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [flowId, setFlowId] = useState<string | null>(null);

  const [flowModalOpen, setFlowModalOpen] = useState(false);
  const [fieldOpen, setFieldOpen] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [loading, setLoading] = useState(true);

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
    let validateObj: {
      message: string;
      isValid: boolean;
    } | null = null;


    console.log(validateObj)
    for (const value of nodes) {
      switch (value.type) {
        case "send_message":
          validateObj = validateSendMessageNode(value.data.payload);
          // console.log(value.data.payload)
          // console.log(validateSendMessageNode(value.data.payload));
          break;
        case "button":
          validateObj = validateButtonNode(value.data.payload as TButtonNodeData["payload"],);
          break;
        default:
          validateObj = {
            message: "jhg",
            isValid: true,
          }
      }
    }

    console.log(validateObj);

    if (!validateObj?.isValid) {
      toastMessageService.error(validateObj?.message ?? "Validation error");
      return false;
    }

    return true;
  };

  const addNewNode = (type: string, label: string) => {
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
    setLoading(true);
    try {
      const response = await chatflowService.getChatFlow(
        String(accountId),
        String(chatflowId),
      );

      if (response?.status === 200 || response?.status === 201) {
        const data = response?.data?.doc;
        const nodes = data?.nodes || [];
        const edges = data?.edges || [];
        const hydEdges = hydratedEdges(edges);
        setNodes(nodes);
        setEdges(hydEdges);
        setFlowName(data?.name || "");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const publishChanges = async (status: string) => {
    console.log(status)
    if (!validateFlow()) return;
    setPublishLoading(true);
    try {
      const payloadData = {
        nodes,
        edges,
        name: flowName,
        status,
      };

      if (authUser) {
        const response =
          (chatflowId && flowName) || flowId
            ? await chatflowService.updateChatFlow(
              String(chatflowId || flowId),
              payloadData,
            )
            : await chatflowService.createChatFlow(
              String(accountId),
              payloadData,
            );

        if (response?.status === 200 || response?.status === 201) {
          toastMessageService.success(
            response?.message || "Your request was processed successfully",
          );

          setFlowId(response?.data.doc.id);
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

  const handleFieldOpen = () => {
    if (!flowName) return setFlowModalOpen(true);

    setFieldOpen(!fieldOpen);
  };

  useEffect(() => {
    if (!chatflowId) return setLoading(false);
    getChatbotFlow();
  }, []);

  if (loading) {
    return <FlowEditorLoading />;
  }

  if (chatflowId && !nodes.length) {
    return <EmptyFlowState />;
  }

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

          <div className="flex z-50 w-full h-16 justify-between! items-center px-5 bg-gray-100 absolute">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate(-1)}
                className=" cursor-pointer bg-gray-300 rounded-full size-8 text-primary"
              >
                <ArrowLeft size={12} />
                {/* <span className="text-sm text-white">Back</span> */}
              </Button>

              <div className="flex items-center gap-2 px-3 py-2">
                <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
                  <Workflow className="size-4 text-primary" />
                </div>

                <div className="flex flex-col">
                  <h1 className="text-sm font-semibold text-foreground leading-none">
                    {flowName || "Untitled Flow"}
                  </h1>

                  <span className="text-[11px] text-muted-foreground mt-1">
                    Chat Flow
                  </span>
                </div>
              </div>
            </div>

            {hasPermission(
              permissions,
              PERMISSIONS.CHATBOTS.CREATE || PERMISSIONS.CHATBOTS.UPDATE,
            ) && (
                <div className="flex items-center gap-3.5">
                  <Button
                    disabled={!flowName || !nodes?.length}
                    className="actions-btn p-2!"
                    onClick={() => publishChanges("draft")}
                  >
                    <MdOutlineDrafts size={18} />

                    <span>Draft</span>
                  </Button>

                  <Button
                    disabled={publishLoading}
                    onClick={() => publishChanges("published")}
                    className="bg-primary text-white px-5 py-2 rounded-xl flex items-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    <Upload size={16} />

                    <span>Publish</span>

                    {publishLoading && <Loader />}
                  </Button>

                  <button
                    onClick={handleFieldOpen}
                    className="flex cursor-pointer bg-primary text-white p-2 rounded-full justify-end"
                  >
                    <div
                      className={`${fieldOpen && "-rotate-45"
                        } transition-all duration-300`}
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

      <FlowModal
        open={flowModalOpen}
        onClose={() => {
          setFlowModalOpen(false);
        }}
        handleSave={(value) => {
          setFlowName(value);
          setFlowModalOpen(false);
          setFieldOpen(true);
        }}
      />
    </div>
  );
}
