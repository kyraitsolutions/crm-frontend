import { DASHBOARD_PATH } from "@/constants";
import { DashboardLayout } from "@/layouts";
import { DashboardPage } from "@/pages";
import DashboardAccount from "@/pages/dashboard-account.page";
import { Teams } from "@/pages/teams.page";
import { type RouteObject } from "react-router-dom";

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        element: <DashboardPage />,
        index: true,
      },
      {
        path: DASHBOARD_PATH.ACCOUNT,
        element: <DashboardAccount />,
      },
      {
        path: "teams",
        element: <Teams />
      }
    ],
  },
];
