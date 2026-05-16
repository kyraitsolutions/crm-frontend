import { useNavigate } from "react-router-dom";
import FlowHeader from "./components/FlowHeader";
import { useChatFlowStore } from "./store/chatflow.store";
import { useEffect } from "react";
import { useAuthStore } from "@/stores";
import FlowTable from "./components/FlowTable";

const ChatFlows = () => {
  const navigate = useNavigate();
  const { accountId } = useAuthStore((state) => state);
  const { flows, fetchFlows, isLoading } = useChatFlowStore((state) => state);

  const getAllFlows = async () => {
    fetchFlows(String(accountId));
  };

  useEffect(() => {
    if (!accountId) return;
    getAllFlows();
  }, [accountId]);

  return (
    <div>
      <FlowHeader
        onCreateFlow={() =>
          navigate("/dashboard/settings/chatflows/flow-builder")
        }
      />

      <div className="p-4">
        <FlowTable flows={flows} loading={isLoading} />
      </div>
    </div>
  );
};

export default ChatFlows;
