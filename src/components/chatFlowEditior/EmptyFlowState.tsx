import { Button } from "@/components/ui/button";
import { Workflow, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyFlowState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-start min-h-screen bg-primary/10">
      <div className="w-full max-w-lg border rounded-xl bg-card p-10 shadow-sm mt-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center size-20 rounded-2xl bg-muted">
            <Workflow className="size-10 text-muted-foreground" />
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            No Flow Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground max-w-md">
            This chatbot flow does not exist or has not been created yet. Start
            building your conversation flow to automate user interactions and
            customer journeys.
          </p>

          <div className="flex items-center gap-3 mt-8">
            <Button
              size="lg"
              onClick={() =>
                navigate("/dashboard/settings/chatflows/flow-builder")
              }
            >
              <Plus className="mr-2 size-4" />
              Create New Flow
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/dashboard/settings/chatflows")}
            >
              Back to Flows
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyFlowState;
