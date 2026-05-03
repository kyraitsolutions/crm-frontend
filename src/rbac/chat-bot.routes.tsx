import ChatbotFlowEditor from "@/components/chatFlowEditior/ChatbotFlowEditor";
import { CHATBOT_PATHS, CHATBOT_ROUTES } from "@/constants/routes";
import { ChatBotNew, ChatBotPage } from "@/pages";
import { PERMISSIONS } from "@/rbac";
import { RequirePermission } from "@/routes/route-access/RequirePermission";
import { type RouteObject } from "react-router-dom";

export const chatBotRoutes: RouteObject[] = [
  {
    path: CHATBOT_PATHS.ROOT,
    children: [
      {
        element: (
          <RequirePermission permission={PERMISSIONS.CHATBOTS.VIEW}>
            <ChatBotPage />
          </RequirePermission>
        ),
        index: true,
      },
      {
        element: (
          <RequirePermission permission={PERMISSIONS.CHATBOTS.CREATE}>
            <ChatBotNew />
          </RequirePermission>
        ),
        path: CHATBOT_ROUTES.CREATE,
      },
      {
        element: (
          <RequirePermission
            permission={
              PERMISSIONS.CHATBOTS.VIEW || PERMISSIONS.CHATBOTS.CREATE
            }
          >
            <ChatBotNew />
          </RequirePermission>
        ),
        path: CHATBOT_ROUTES.BUILDER,
      },
      {
        element: (
          <RequirePermission
            permission={
              PERMISSIONS.CHATBOTS.VIEW || PERMISSIONS.CHATBOTS.CREATE
            }
          >
            <ChatbotFlowEditor />
          </RequirePermission>
        ),
        path: CHATBOT_ROUTES.FLOW,
      },
      // {
      //   element: <ChatBotDetailLayout />,
      //   path: ":chatBotId",
      //   children: [
      //     {
      //       element: <Navigate to="/chat-bot" />,
      //       index: true,
      //     },
      //     {
      //       element: <ChatBotNew />,
      //       path: "edit",
      //     },
      //     {
      //       element: <ChatBotUsersLayout />,
      //       path: "users",
      //       children: [
      //         {
      //           index: true,
      //           element: <ChatBotUsersPage />,
      //         },
      //         {
      //           element: <ChatBotUserResponsesLayout />,
      //           path: ":chatBotUserId",
      //           children: [
      //             {
      //               element: <Navigate to="/chat-bot" />,
      //               index: true,
      //             },
      //             {
      //               element: <ChatBotUserResponsesPage />,
      //               index: true,
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
  },
];
