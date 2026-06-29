import { ArrayChange } from "./ArrayChange";
import { PrimitiveChange } from "./PrimitiveChange";

interface ChangeRendererProps {
  from: unknown;
  to: unknown;
}

export function ChangeRenderer({ from, to }: ChangeRendererProps) {
  if (Array.isArray(from) || Array.isArray(to)) {
    return (
      <ArrayChange
        from={Array.isArray(from) ? from : []}
        to={Array.isArray(to) ? to : []}
      />
    );
  }

  return <PrimitiveChange from={from} to={to} />;
}
