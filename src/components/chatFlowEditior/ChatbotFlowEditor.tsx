import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import type { Connection, Edge } from "reactflow";
import { nodeTypes } from "./nodes";
import {
  User,
  Mail,
  Phone,
  ListChecks,
  MessageSquare,
  Smile,
  Bot,
  Link,
  Database,
  Zap,
  Clock,
  FileText,
  Tags,
  ClipboardCheck,
  Settings,
  Filter,
  BarChart3,
  MessageCircle,
  Send,
} from "lucide-react";
export default function ChatbotFlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeCount, setNodeCount] = useState(1);

  const [publishLoading, setPublishLoading] = useState(false);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

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

  // const addNewNode = () => {
  //   const id = `${nodeCount}`;
  //   const newNode = {
  //     id,
  //     type: "chat",
  //     position: { x: Math.random() * 500, y: Math.random() * 400 },
  //     data: {
  //       elements: [], // starts fully empty
  //       updateNode: (nodeId: string, elements: any[]) => {
  //         setNodes((nds) =>
  //           nds.map((n) =>
  //             n.id === nodeId
  //               ? { ...n, data: { ...n.data, elements, deleteNode } }
  //               : n
  //           )
  //         );
  //       },
  //     },
  //   };
  //   setNodes((nds) => [...nds, newNode]);
  //   setNodeCount((prev) => prev + 1);
  // };

  const addNewNode = (value, label) => {
    const newNode = {
      id: crypto.randomUUID(),
      type: "chat",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { elements: [], deleteNode, updateNode, value, label }, // ✅ inject deleteNode here
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const publishChanges = () => {
    setPublishLoading(true);
    const serializableNodes = nodes.map(({ data, ...rest }) => ({
      ...rest,
      data: { elements: data.elements },
    }));

    localStorage.setItem("nodes", JSON.stringify(serializableNodes));
    localStorage.setItem("edges", JSON.stringify(edges));

    setTimeout(() => {
      setPublishLoading(false);
    }, 2000);
  };

  const onEdgeClick = useCallback((event: any, edge: any) => {
    event.stopPropagation();
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, []);

  // useEffect(() => {
  //   const isNodes = JSON.parse(localStorage.getItem("nodes") || "[]");
  //   const isEdges = JSON.parse(localStorage.getItem("edges") || "[]");

  //   if (!isNodes && !isEdges) {
  //     localStorage.setItem("nodes", JSON.stringify(nodes));
  //     localStorage.setItem("edges", JSON.stringify(edges));
  //   } else {
  //     const newNodes = [...isNodes, ...nodes];
  //     const newEdges = [...isEdges, ...edges];
  //     localStorage.setItem("nodes", JSON.stringify(newNodes));
  //     localStorage.setItem("edges", JSON.stringify(newEdges));
  //   }
  // }, [nodes, edges]);

  useEffect(() => {
    // const isNodes = JSON.parse(localStorage.getItem("nodes") || "");
    // const isEdges = JSON.parse(localStorage.getItem("edges") || "");

    const savedNodes = localStorage.getItem("nodes");
    const savedEdges = localStorage.getItem("edges");

    if (savedNodes && savedEdges) {
      const parsedNodes = JSON.parse(savedNodes);
      const parsedEdges = JSON.parse(savedEdges);

      // ✅ Reattach functions to every node
      const hydratedNodes = parsedNodes.map((node: any) => ({
        ...node,
        data: {
          ...node.data,
          deleteNode,
          updateNode,
        },
      }));

      setNodes(hydratedNodes);
      setEdges(parsedEdges);
    }
  }, []);

  const chatbotFields = [
    { label: "Name", value: "text", icon: <User className="w-4 h-4 text-primary" /> },
    { label: "Email", value: "text", icon: <Mail className="w-4 h-4 text-primary" /> },
    { label: "Phone", value: "text", icon: <Phone className="w-4 h-4 text-primary" /> },
    { label: "Provided Option", value: "option", icon: <ListChecks className="w-4 h-4 text-primary" /> },
    { label: "End Chat", value: "text", icon: <MessageSquare className="w-4 h-4 text-primary" /> },
    { label: "Greeting Message", value: "text", icon: <Smile className="w-4 h-4 text-primary" /> },

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
    <div className="w-full grid grid-cols-8  p-2 bg-gray-50 gap-2">
      <div className="col-span-6">


        <div className="flex justify-end">
          {/* <button
            onClick={addNewNode}
            className="bg-green-600 text-white px-4 py-1 rounded mb-2 cursor-pointer"
          >
            + Add Node
          </button> */}

          <button
            onClick={publishChanges}
            className="bg-slate-800 text-white px-4 py-1 rounded mb-2 cursor-pointer ml-2 flex items-center gap-2"
          >
            Publish{" "}
            {publishLoading && (
              <div className="size-4 border-t border-t-white rounded-full animate-spin" />
            )}
          </button>
        </div>

        <div className="h-[70vh] border border-gray-300 rounded">
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
        <p>Predefined Button</p>
        <div className="grid grid-cols-3 gap-5 mt-3 ">
          {chatbotFields.map((item, index) => (
            <div onClick={() => addNewNode(item.value, item.label)} key={index} className="">
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
