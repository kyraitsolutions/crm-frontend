import { DASHBOARD_PATH } from "@/constants";
import { DashboardLayout } from "@/layouts";
import ProfilePage from "@/pages/Profile/Profile";
import { type RouteObject } from "react-router-dom";

export const profileRoutes: RouteObject[] = [
  {
    path: `${DASHBOARD_PATH.ROOT}/:account_type/:accountId`,
    element: <DashboardLayout />,
    children: [
      {
        path: "profile",
        element: <ProfilePage />,
        index: true,
      },
      // {
      //     element: <LeadFormNew />,
      //     path: "create",
      // },
    ],
  },
];
