import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
  onCreateFlow: () => void;
};

const FlowHeader = ({ onCreateFlow }: Props) => {
  return (
    <div className="flex items-center justify-between bg-primary/5 px-4 py-2">
      <div>
        <h1 className="text-lg font-semibold text-slate-700">Chat Flows</h1>

        <p className="text-xs text-slate-500">
          Create and manage your chatbot conversation flows.
        </p>
      </div>

      <Button
        onClick={onCreateFlow}
        className="gap-2 rounded-xl actions-btn p-2!"
      >
        <Plus size={18} />
        Create Flow
      </Button>
    </div>
  );
};

export default FlowHeader;
