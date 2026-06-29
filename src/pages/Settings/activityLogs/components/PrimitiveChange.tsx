import { formatChangeValue } from "../utils/activity-logs.utils";
import { ChangeValue } from "./ChangeValue";

interface PrimitiveChangeProps {
  from: unknown;
  to: unknown;
}

export function PrimitiveChange({ from, to }: PrimitiveChangeProps) {
  const fromValue = formatChangeValue(from);
  const toValue = formatChangeValue(to);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {fromValue.type !== "empty" && (
        <>
          <ChangeValue value={fromValue} variant="from" />

          <i className="ti-arrow-right text-[9px] text-muted-foreground" />
        </>
      )}

      <ChangeValue value={toValue} variant="to" />
    </div>
  );
}
