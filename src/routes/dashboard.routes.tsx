import { DashboardLayout } from "@/layouts";
import { DashboardPage } from "@/pages";
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
    ],
  },
];
