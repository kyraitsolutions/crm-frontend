import { Handle, Position } from "reactflow";

export default function InputNode({ data, id }: any) {
  return (
    <div className="p-3 bg-yellow-100 rounded w-[220px]">
      <div className="font-semibold">Input</div>

      <select
        value={data.inputType}
        onChange={(e) =>
          data.updateNode(id, {
            ...data,
            inputType: e.target.value,
          })
        }
      >
        <option value="text">Text</option>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
        <option value="date">Date</option>
      </select>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
