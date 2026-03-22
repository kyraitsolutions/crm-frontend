import { DASHBOARD_PATH } from "@/constants";
import { DashboardLayout } from "@/layouts";
import { SettingLayout } from "@/layouts/setting.layout";
import { DashboardPage } from "@/pages";
import Integrations from "@/pages/Integration/Integrations";
import CompanyDetails from "@/pages/Profile/CompanyDetails";
import ProfilePage from "@/pages/Profile/Profile";
import SettingPage from "@/pages/setting.page";
import { SubscriptionPage } from "@/pages/subscription.page";
import Role from "@/pages/UsersAndControl/role.page";
import { Teams } from "@/pages/UsersAndControl/teams.page";
import { type RouteObject } from "react-router-dom";

export const settingRoutes: RouteObject[] = [
    {
        path: `${DASHBOARD_PATH.ROOT}/:account_type/:accountId`,
        element: <DashboardLayout />,
        children: [
            {
                path: "setting",
                element: <SettingLayout />,
                children: [
                    { index: true, element: <SettingPage /> },

                    // General Link
                    { path: "profile", element: <ProfilePage /> },
                    { path: "company-details", element: <CompanyDetails /> },


                    // User Control
                    { path: "users", element: <Teams /> },
                    { path: "roles", element: <Role /> },
                    { path: "workspace", element: <DashboardPage /> },

                    // Plan and Subscription
                    { path: "subscription", element: <SubscriptionPage /> },


                    // Integrations
                    { path: "integrations", element: <Integrations /> }

                    // { path: "automations", element: <Automations /> },
                ]
            },

        ],
    },
];
