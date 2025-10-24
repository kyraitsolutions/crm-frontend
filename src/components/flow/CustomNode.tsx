const CustomNode = () => {
  return <div>CustomNode</div>;
};

export default CustomNode;

// import React, { useCallback } from "react";
// import ReactFlow, {
//   addEdge,
//   Background,
//   Controls,
//   MiniMap,
//   useEdgesState,
//   useNodesState,
// } from "reactflow";

// import type { Edge, Connection } from "reactflow";
// import "reactflow/dist/style.css";

// const initialNodes = [
//   //   {
//   //     id: "1",
//   //     position: { x: 250, y: 0 },
//   //     data: { label: "Node 1" },
//   //   },
//   //   {
//   //     id: "2",
//   //     position: { x: 100, y: 100 },
//   //     data: { label: "Node 2" },
//   //   },
// ];

// const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

// function CustomNode() {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const onConnect = useCallback(
//     (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   return (
//     <div style={{ width: "100vw", height: "100vh" }}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//       >
//         <MiniMap />
//         <Controls />
//         <Background />
//       </ReactFlow>
//     </div>
//   );
// }

// export default CustomNode;
