// FloatingEdge.tsx
import { EdgeLabelRenderer, getBezierPath, type EdgeProps } from "reactflow";

export default function FloatingEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, data } = props;

  // Draw short forward line (like arrow direction)
  const targetX = sourceX + 120;
  const targetY = sourceY;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      {/* Dashed forward line */}
      <path
        d={edgePath}
        stroke="#9ca3af"
        strokeWidth={2}
        fill="none"
        strokeDasharray="5 5"
      />

      {/* ➕ Button */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <button
            onClick={() => data?.onAddNode?.(id)}
            className="w-7 h-7 rounded-full bg-primary text-white shadow-md hover:scale-110 transition"
          >
            +
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
