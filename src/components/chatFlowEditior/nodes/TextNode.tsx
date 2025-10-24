export function TextNode({ data }: any) {
  return (
    <div className="bg-white border border-gray-400 rounded-md p-3 w-48 shadow-sm">
      <h4 className="font-bold mb-1 text-sm">Text Message</h4>
      <textarea
        className="w-full text-xs border rounded p-1"
        placeholder="Enter message..."
        value={data.text || ""}
        onChange={(e) => data.onChange?.("text", e.target.value)}
      />
    </div>
  );
}
