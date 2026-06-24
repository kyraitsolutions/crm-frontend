import React from "react";

interface VariableChipProps {
  label: string;
  onClick: () => void;
  variant?: "default" | "custom";
}

export const VariableChip: React.FC<VariableChipProps> = ({
  label,
  onClick,
  variant = "default",
}) => {
  const baseClass =
    "px-2.5 py-1 rounded-full border text-xs transition-colors cursor-pointer";
  const variantClass =
    variant === "custom"
      ? "border-green-300 text-green-700 hover:bg-green-50"
      : "border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-700 hover:bg-green-50";

  return (
    <button className={`${baseClass} ${variantClass}`} onClick={onClick}>
      {label}
    </button>
  );
};
