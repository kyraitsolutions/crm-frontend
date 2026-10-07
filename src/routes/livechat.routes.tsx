import { type RouteObject } from "react-router-dom";
import { LIVE_CHAT_PATHS } from "@/constants/routes/livechat.path";
import LiveChat from "@/pages/LiveChat/livechat.page";
import { PERMISSIONS } from "@/rbac";
import { RequirePermission } from "./route-access/RequirePermission";

export const liveChatRoutes: RouteObject[] = [
  {
    path: LIVE_CHAT_PATHS.ROOT,
    children: [
      {
        element: (
          <RequirePermission permission={PERMISSIONS.LIVE_CHAT.VIEW}>
            <LiveChat />
          </RequirePermission>
        ),
        index: true,
      },
    ],
  },
];
