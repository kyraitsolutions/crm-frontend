import { ROUTES } from "@/constants";
import { FacebookLayout } from "@/layouts/facebook.layout";
import Facebook from "@/pages/Channels/facebook/pages/FacebookPage";
import InsightsPage from "@/pages/Channels/facebook/pages/InsightsPage";
import LeadFormsPage from "@/pages/Channels/facebook/pages/LeadFormsPage";
import LeadsPage from "@/pages/Channels/facebook/pages/LeadsPage";
import MetaCallbackPage from "@/pages/Channels/facebook/pages/MetaCallbackPage";
import PostsPage from "@/pages/Channels/facebook/pages/PostsPage";
import Setting from "@/pages/Channels/facebook/pages/Setting";
import { MetaRouteGuard } from "@/pages/Channels/facebook/routes/MetaRouteGuard";
import MetaWorkspace from "@/pages/Channels/facebook/sections/MetaWorkspace";
import { PERMISSIONS } from "@/rbac";
import type { RouteObject } from "react-router-dom";
import { RequirePermission } from "./route-access/RequirePermission";

export const facebookRoutes: RouteObject[] = [
  {
    path: ROUTES.DASHBOARD,
    children: [
      {
        path: ROUTES.DASHBOARD,
        children: [
          {
            path: "settings/facebook",
            element: (
              <RequirePermission permission={PERMISSIONS.FACEBOOK.VIEW}>
                <MetaRouteGuard />
              </RequirePermission>
            ),
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
                    path: "posts",
                    element: <PostsPage />,
                  },
                  {
                    path: "lead-forms",
                    element: <LeadFormsPage />,
                  },
                  {
                    path: "leads",
                    element: <LeadsPage />,
                  },
                  {
                    path: "insights",
                    element: <InsightsPage />,
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
