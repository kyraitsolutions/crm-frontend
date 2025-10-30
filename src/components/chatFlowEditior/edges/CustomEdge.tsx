import { getBezierPath } from "reactflow";
import { Plus } from "lucide-react";

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, style = {}, markerEnd, data }) => {
  // Generate a smooth bezier path
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const handleAddNode = (e) => {
    e.stopPropagation();
    data?.onAddNode?.(id);
  };

  return (
    <>
      {/* Bold, smooth edge line */}
      <path
        id={id}
        d={edgePath}
        className="react-flow__edge-path"
        style={{
          stroke: "#2563eb", // Tailwind blue-600
          strokeWidth: 3, // ⬆️ Thicker line
          fill: "none", // ⬅️ Removes fill
          strokeDasharray: "none", // ⬅️ Ensures solid line (no dots)
          ...style,
        }}
        markerEnd={markerEnd}
      />

      {/* Large + icon at the middle of the edge */}
      <foreignObject
        width={50}
        height={50}
        x={labelX - 25}
        y={labelY - 25}
        className="cursor-pointer"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div
          onClick={handleAddNode}
          className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 border-2 border-white"
        >
          <Plus size={22} />
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdge;
