import React, { useState } from "react";
import { Handle, Position } from "reactflow";

export const ChatNode = ({ data }: any) => {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  const [text, setText] = useState(data.text || "");
  const [options, setOptions] = useState(data.options || [""]);

  const addOption = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOptions([...options, ""]);
  };

  const updateOption = (i: number, val: string) => {
    const newOpts = [...options];
    newOpts[i] = val;
    setOptions(newOpts);
  };

  return (
    <div
      style={{
        padding: 10,
        background: "#f5f5f5",
        border: "2px solid #1976d2",
        borderRadius: 8,
        width: 220,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Chat Step</div>
      <textarea
        placeholder="Enter message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onClick={stopPropagation}
        style={{
          width: "100%",
          borderRadius: 6,
          padding: 4,
          resize: "none",
          border: "1px solid #ccc",
        }}
      />

      <div style={{ marginTop: 8 }}>
        <strong>Options:</strong>
        {options.map((opt: any, i: number) => (
          <input
            key={i}
            type="text"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
            onClick={stopPropagation}
            style={{
              width: "100%",
              marginTop: 4,
              padding: 4,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        ))}
        <button
          onClick={addOption}
          //   onClickCapture={stopPropagation}
          style={{
            marginTop: 6,
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: 4,
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          {/* + Add Option */}
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
