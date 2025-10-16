import {
  ChatBotDetailLayout,
  ChatBotLayout,
  ChatBotUserResponsesLayout,
  ChatBotUsersLayout,
} from "@/layouts";
import {
  ChatBotPage,
  ChatBotNew,
  ChatBotUsersPage,
  ChatBotUserResponsesPage,
} from "@/pages";
import { Navigate, type RouteObject } from "react-router-dom";

export const chatBotRoutes: RouteObject[] = [
  {
    path: "/chat-bot",
    element: <ChatBotLayout />,
    children: [
      {
        element: <ChatBotPage />,
        index: true,
      },
      {
        element: <ChatBotNew />,
        path: "new",
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
