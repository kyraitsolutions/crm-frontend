import { ROUTES } from "@/constants";
import { FacebookLayout } from "@/layouts/facebook.layout";
import Facebook from "@/pages/Channels/facebook/pages/FacebookPage";
import MetaCallbackPage from "@/pages/Channels/facebook/pages/MetaCallbackPage";
import Setting from "@/pages/Channels/facebook/pages/Setting";
import { MetaRouteGuard } from "@/pages/Channels/facebook/routes/MetaRouteGuard";
import MetaWorkspace from "@/pages/Channels/facebook/sections/MetaWorkspace";
import type { RouteObject } from "react-router-dom";

export const facebookRoutes: RouteObject[] = [
  {
    path: ROUTES.DASHBOARD,
    children: [
      {
        path: ROUTES.DASHBOARD,
        children: [
          {
            path: "settings/facebook",
            element: <MetaRouteGuard />,
            children: [
              {
                index: true,
                element: <Facebook />,
              },
              {
                path: "callback",
                element: <MetaCallbackPage />,
              },
              {
                element: <FacebookLayout />,
                children: [
                  {
                    path: "overview",
                    element: <MetaWorkspace />,
                  },
                  {
                    path: "setting",
                    element: <Setting />,
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
