import { ACCOUNT_ROUTES, ROUTES } from "@/constants/routes";
import { DashboardLayout } from "@/layouts";
import DashboardAccount from "@/pages/dashboard-account.page";
import DashboardOverviewPage from "@/pages/Dashboard/DashboardOverviewPage";
import { SubscriptionPage } from "@/pages/subscription.page";
import { type RouteObject } from "react-router-dom";

export const dashboardRoutes: RouteObject[] = [
  {
    path: `${ROUTES.DASHBOARD}`,
    element: <DashboardLayout />,
    children: [
      // {
      //   element: <DashboardPage />,
      //   index: true,
      // },
      {
        path: ACCOUNT_ROUTES.ACCOUNT,
        // element: <DashboardAccount />,
        element: <DashboardOverviewPage />,
      },
      {
        path: "subscription",
        element: <SubscriptionPage />,
      },
    ],
  },
];
