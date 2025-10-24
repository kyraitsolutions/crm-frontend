export function OptionsNode({ data }: any) {
  return (
    <div className="bg-white border border-gray-400 rounded-md p-3 w-60 shadow-sm">
      <h4 className="font-bold mb-2 text-sm">Question Node</h4>
      <input
        className="w-full text-xs border rounded p-1 mb-1"
        placeholder="Enter question..."
        value={data.question || ""}
        onChange={(e) => data.onChange?.("question", e.target.value)}
      />
      <div className="space-y-1">
        {data.options?.map((opt: string, i: number) => (
          <input
            key={i}
            className="w-full text-xs border rounded p-1"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => data.updateOption?.(i, e.target.value)}
          />
        ))}
      </div>
      <button
        className="text-xs mt-2 bg-blue-500 text-white px-2 py-1 rounded"
        onClick={data.addOption}
      >
        + Add Option
      </button>
    </div>
  );
}
