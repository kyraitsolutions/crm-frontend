import { type RouteObject } from "react-router-dom";
import { LIVE_CHAT_PATHS } from "@/constants/routes/livechat.path";
import LiveChat from "@/pages/LiveChat/livechat.page";

export const liveChatRoutes: RouteObject[] = [
  {
    path: LIVE_CHAT_PATHS.ROOT,
    children: [
      {
        element: <LiveChat />,
        index: true,
      },
    ],
  },
];
