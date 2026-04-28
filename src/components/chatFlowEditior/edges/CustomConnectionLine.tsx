import {
  type ConnectionLineComponentProps,
  getSmoothStepPath,
} from "reactflow";

export default function CustomConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
}: ConnectionLineComponentProps) {
  const [path] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
    sourcePosition: fromPosition, // 🔥 IMPORTANT
    targetPosition: toPosition, // 🔥 IMPORTANT
  });

  return (
    <>
      {/* Glow */}
      <path
        d={path}
        stroke="#16a34a"
        strokeWidth={1}
        fill="none"
        opacity={0.15}
      />

      {/* Main dashed */}
      <path
        d={path}
        stroke="#16a34a"
        strokeWidth={2}
        fill="none"
        strokeDasharray="4 4"
        style={{
          animation: "dash 1s linear infinite",
        }}
      />

      {/* End dot */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="#16a34a" />
        </marker>
      </defs>

      <path
        d={path}
        stroke="#16a34a"
        strokeWidth={2}
        fill="none"
        strokeDasharray="4 4"
        markerEnd="url(#arrowhead)" // 🔥 arrow here
        style={{
          animation: "dash 1s linear infinite",
        }}
      />

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
