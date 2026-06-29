import { AppLayout, RootLayout } from "@/layouts";
import { AuthCallbackPage, LoginPage, OnBoardingPage, Register } from "@/pages";
import { createBrowserRouter, Navigate } from "react-router-dom";
// import { builderRoutes } from "./builder.routes";
import { dashboardRoutes } from "./dashboard.routes";
import { formRoutes } from "./form.routes";
import { leadRoutes } from "./lead.route";
// import ProductPage from "@/pages/product.page";
// import About from "@/pages/about.page";

import { broadcastRoutes } from "./broadcast.routes";
import { contactRoutes } from "./contact.routes";
import { settingRoutes } from "./setting.routes";
import { PublicOnly } from "./route-access/PublicOnly";
import { ProtectedOnly } from "./route-access/ProtectedOnly";
import Teams from "@/pages/UsersAndControl/teams2.page";
import { liveChatRoutes } from "./livechat.routes";
import { chatBotRoutes } from "@/rbac/chat-bot.routes";
// import { dealsRoutes } from "./deal.routes";

export const appRoutes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <Navigate to="/dashboard" replace />,
        index: true,
      },

      // Auth PUBLIC ONLY (not logged in)
      {
        element: <PublicOnly />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <Register /> },
        ],
      },

      //PROTECTED (logged in)
      {
        // element: <ProtectedOnly />,
        children: [
          {
            element: <AppLayout />,
            children: [
              ...dashboardRoutes,
              // ...builderRoutes,
              ...liveChatRoutes,
              ...chatBotRoutes,
              ...leadRoutes,
              ...formRoutes,
              ...broadcastRoutes,
              ...contactRoutes,
              ...settingRoutes,
              // ...dealsRoutes,

              {
                path: "/teams",
                element: <Teams />,
              },
            ],
          },
          {
            path: "/on-boarding",
            element: <OnBoardingPage />,
          },
        ],
      },
      {
        path: "/auth/callback",
        element: <AuthCallbackPage />,
      },
    ],
  },
]);
