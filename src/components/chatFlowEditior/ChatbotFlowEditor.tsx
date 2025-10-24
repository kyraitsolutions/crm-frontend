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

  const addNewNode = () => {
    const newNode = {
      id: crypto.randomUUID(),
      type: "chat",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { elements: [], deleteNode, updateNode }, // ✅ inject deleteNode here
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

  return (
    <div className="w-full p-2 bg-gray-50">
      <div className="flex">
        <button
          onClick={addNewNode}
          className="bg-green-600 text-white px-4 py-1 rounded mb-2 cursor-pointer"
        >
          + Add Node
        </button>

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
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
