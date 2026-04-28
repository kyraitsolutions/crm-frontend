import ButtonClose from "@/components/ui/Buttons/ButtonClose";
import {
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "reactflow";

export default function CustomEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
  } = props;

  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      {/* Glow */}
      <path
        d={path}
        stroke="#16a34a"
        strokeWidth={4}
        fill="none"
        opacity={0.15}
      />

      {/* Main animated dashed edge */}
      <path
        d={path}
        stroke="#16a34a"
        strokeWidth={2}
        fill="none"
        strokeDasharray="4 4"
        markerEnd={`url(#arrow-${id})`} // ✅ unique arrow
        style={{
          animation: "dash 1s linear infinite",
        }}
      />

      {/* Arrow marker (UNIQUE per edge) */}
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="#16a34a" />
        </marker>
      </defs>

      {/* ❌ DELETE BUTTON (your original feature preserved) */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <ButtonClose onClose={() => data?.onDelete?.(id)} />
        </div>
      </EdgeLabelRenderer>

      {/* Animation */}
      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: -12;
            }
          }
        `}
      </style>
    </>
  );
}
