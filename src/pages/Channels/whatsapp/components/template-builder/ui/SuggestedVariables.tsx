import React from "react";
import { VariableChip } from "./VariableChip";

interface SuggestedVariablesProps {
  variables: string[];
  onInsert: (varName: string) => void;
}

const PREFIXED_VARS = new Set([
  "order_id",
  "order_date",
  "tracking_number",
  "appointment_date",
]);

const getChipLabel = (v: string): string => {
  if (
    PREFIXED_VARS.has(v) ||
    v.startsWith("order_") ||
    v.startsWith("tracking_") ||
    v.startsWith("appointment_")
  ) {
    return `+ ${v}`;
  }
  return v;
};

export const SuggestedVariables: React.FC<SuggestedVariablesProps> = ({
  variables,
  onInsert,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {variables.map((v) => (
        <VariableChip
          key={v}
          label={getChipLabel(v)}
          onClick={() => onInsert(v)}
          variant="default"
        />
      ))}
    </div>
  );
};
