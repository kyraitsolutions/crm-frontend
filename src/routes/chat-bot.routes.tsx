import ChatbotFlowEditor from "@/components/chatFlowEditior/ChatbotFlowEditor";
import { DASHBOARD_PATH } from "@/constants";
import {
  ChatBotDetailLayout,
  ChatBotLayout,
  ChatBotUserResponsesLayout,
  ChatBotUsersLayout,
} from "@/layouts";
import {
  ChatBotNew,
  ChatBotPage,
  ChatBotUserResponsesPage,
  ChatBotUsersPage,
} from "@/pages";
import { Navigate, type RouteObject } from "react-router-dom";

export const chatBotRoutes: RouteObject[] = [
  {
    path: `${DASHBOARD_PATH.ROOT}/account/:accountId/chatbot`,
    element: <ChatBotLayout />,
    children: [
      {
        element: <ChatBotPage />,
        index: true,
      },
      {
        element: <ChatBotNew />,
        path: "create",
      },
      {
        element: <ChatBotNew />,
        path: ":chatBotId/builder",
      },
      {
        element: <ChatbotFlowEditor />,
        path: ":chatBotId/builder/flow-editor",
      },
      {
        element: <ChatBotDetailLayout />,
        path: ":chatBotId",
        children: [
          {
            element: <Navigate to="/chat-bot" />,
            index: true,
          },
          {
            element: <ChatBotNew />,
            path: "edit",
          },
          {
            element: <ChatBotUsersLayout />,
            path: "users",
            children: [
              {
                index: true,
                element: <ChatBotUsersPage />,
              },
              {
                element: <ChatBotUserResponsesLayout />,
                path: ":chatBotUserId",
                children: [
                  {
                    element: <Navigate to="/chat-bot" />,
                    index: true,
                  },
                  {
                    element: <ChatBotUserResponsesPage />,
                    index: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
