import { cn } from "@/lib/utils";
import { alertManager } from "@/stores/alert.store";
import { Copy, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";
import { useNodeId, useReactFlow } from "reactflow";

type TNodeHeaderProps = {
  title: string;
  icon?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const NodeHeader = ({ title, icon, ...props }: TNodeHeaderProps) => {
  const nodeId = useNodeId();
  const { getNode, getNodes, setNodes, setEdges } = useReactFlow();

  const stopCanvasEvent = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const copyNode = (event: MouseEvent) => {
    stopCanvasEvent(event);
    if (!nodeId) return;

    const source = getNode(nodeId);
    if (!source) return;

    const {
      position,
      data,
      selected: _selected,
      dragging: _dragging,
      ...rest
    } = source;
    const nodes = getNodes();
    let x = position.x + 48;
    let y = position.y + 48;

    for (let step = 0; step < 12; step += 1) {
      const blocked = nodes.some(
        (item) =>
          Math.abs(item.position.x - x) < 24 &&
          Math.abs(item.position.y - y) < 24,
      );
      if (!blocked) break;
      x += 48;
      y += 48;
    }

    const copy = {
      ...rest,
      id: crypto.randomUUID(),
      position: { x, y },
      selected: true,
      dragging: false,
      data: structuredClone(data),
    };
    delete (copy as { positionAbsolute?: unknown }).positionAbsolute;

    setNodes((current) => [
      ...current.map((node) => ({ ...node, selected: false })),
      copy,
    ]);
  };

  const askDelete = (event: MouseEvent) => {
    stopCanvasEvent(event);
    if (!nodeId) return;

    alertManager.show({
      type: "warning",
      title: "Delete node",
      message: `Delete this ${title} node? Connections to it will be removed.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => {
        setNodes((current) => current.filter((node) => node.id !== nodeId));
        setEdges((current) =>
          current.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId,
          ),
        );
      },
    });
  };

  return (
    <div
      {...props}
      className={cn(
        "flex items-center gap-2 p-4 text-white",
        props.className,
      )}
    >
      {icon}
      <h2 className="min-w-0 flex-1 truncate text-sm font-bold">{title}</h2>
      <div className="nodrag nopan ml-auto flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={`Copy ${title}`}
          title="Copy"
          onMouseDown={stopCanvasEvent}
          onClick={copyNode}
          className="inline-flex size-7 items-center justify-center rounded-md text-white/85 hover:bg-white/15 hover:text-white"
        >
          <Copy size={14} />
        </button>
        <button
          type="button"
          aria-label={`Delete ${title}`}
          title="Delete"
          onMouseDown={stopCanvasEvent}
          onClick={askDelete}
          className="inline-flex size-7 items-center justify-center rounded-md text-white/85 hover:bg-white/15 hover:text-white"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default NodeHeader;
