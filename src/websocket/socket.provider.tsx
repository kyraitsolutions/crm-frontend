import { useCallback, useEffect } from "react";
import { socketManager } from "./socket.client";
import { WS_BASE_URL, WEBSOCKET_EVENTS } from "@/constants";
import { useLeadsStore } from "@/pages/LeadCentre/store/lead.store";
import { useSocketEvent } from "./socket.hook";

interface Props {
  children: React.ReactNode;
  accountId: string;
}

export const SocketProvider = ({ children, accountId }: Props) => {
  const prependLead = useLeadsStore((state) => state.prependLead);

  useEffect(() => {
    if (!accountId || accountId === "undefined") return;

    socketManager.connect(`${WS_BASE_URL}?accountId=${accountId}`);

    return () => {
      socketManager.disconnect();
    };
  }, [accountId]);

  useSocketEvent(
    WEBSOCKET_EVENTS["Chatbot Lead Created"],
    useCallback(
      (data) => {
        prependLead(data?.lead || data);
      },
      [prependLead],
    ),
  );

  return children;
};
