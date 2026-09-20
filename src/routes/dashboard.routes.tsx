import { ACCOUNT_ROUTES, ROUTES } from "@/constants/routes";
import { DashboardLayout } from "@/layouts";
import DashboardHomePage from "@/pages/Dashboard/DashboardHomePage";
import DashboardOverviewPage from "@/pages/Dashboard/DashboardOverviewPage";
import { SubscriptionPage } from "@/pages/subscription.page";
import { type RouteObject } from "react-router-dom";

export const dashboardRoutes: RouteObject[] = [
  {
    path: `${ROUTES.DASHBOARD}`,
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },
      {
        path: ACCOUNT_ROUTES.ACCOUNT,
        element: <DashboardOverviewPage />,
      },
      {
        path: "subscription",
        element: <SubscriptionPage />,
      },
    ],
  },
];
