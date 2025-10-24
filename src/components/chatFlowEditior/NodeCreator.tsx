import React from "react";

interface NodeCreatorProps {
  onCreate: (type: string) => void;
}

export const NodeCreator: React.FC<NodeCreatorProps> = ({ onCreate }) => {
  return (
    <div className="flex gap-2 mb-2">
      <button
        onClick={() => onCreate("textNode")}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        + Text Node
      </button>
      <button
        onClick={() => onCreate("optionsNode")}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        + Options Node
      </button>
    </div>
  );
};
