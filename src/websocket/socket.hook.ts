// websocket/socket.hooks.ts

import { useEffect } from "react";
import { socketManager } from "./socket.client";

export const useSocketEvent = (
  event: string,
  callback: (data: any) => void,
) => {
  useEffect(() => {
    const unsubscribe = socketManager.subscribe(event, callback);
    return unsubscribe;
  }, [event, callback]);
};
