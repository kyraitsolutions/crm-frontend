import { Button } from "@/components/ui/button";
import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
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

      <ButtonWithTitle
        title="Create chatflow"
        onClick={onCreateFlow}
        className="gap-2 rounded-xl  flex items-center actions-btn p-2!"
      >
        <Plus size={18} />
        Create Flow
      </ButtonWithTitle>
    </div>
  );
};

export default FlowHeader;
