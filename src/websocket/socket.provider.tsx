// websocket/socket.provider.tsx

import { useEffect } from "react";
import { socketManager } from "./socket.client";
import { WS_BASE_URL } from "@/constants";

interface Props {
  children: React.ReactNode;
  accountId: string;
}

export const SocketProvider = ({ children, accountId }: Props) => {
  useEffect(() => {
    if (!accountId) return;
    socketManager.disconnect();

    setTimeout(() => {
      socketManager.connect(`${WS_BASE_URL}?accountId=${accountId}`);
    }, 1000);

    return () => {
      socketManager.disconnect();
    };
  }, [accountId]);

  return children;
};
