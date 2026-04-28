import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grip } from "lucide-react";

type TSortableItemProps = {
  id: string;
  children: React.ReactNode;
  length: number;
};

export function SortableItem({ id, children, length }: TSortableItemProps) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {length > 1 && (
        <div
          {...attributes}
          {...listeners}
          className="nodrag cursor-move active:cursor-grabbing text-sm flex items-center justify-center text-orange-500 w-fit mb-1.5"
        >
          <Grip size={12} />
        </div>
      )}

      {/* YOUR ACTUAL CONTENT */}
      {children}
    </div>
  );
}
