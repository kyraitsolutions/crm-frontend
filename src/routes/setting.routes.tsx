import { ROUTES } from "@/constants/routes";
import { SettingLayout } from "@/layouts/setting.layout";
import { DashboardPage } from "@/pages";
import Instagram from "@/pages/Channels/instagram.page";
import Telegram from "@/pages/Channels/telegram.page";
import Whatsapp from "@/pages/Channels/whatsapp.page";
import Recyclebin from "@/pages/DataAdministration/recyclebin.page";
import Storage from "@/pages/DataAdministration/storage.page";
import Webhook from "@/pages/Developer/Webhook";
import Integrations from "@/pages/Integration/Integrations";
import Notification from "@/pages/Notification/notification.page";
import CompanyDetails from "@/pages/Profile/CompanyDetails";
import ProfilePage from "@/pages/Profile/Profile";
import SettingPage from "@/pages/setting.page";
import { SubscriptionPage } from "@/pages/subscription.page";
import Role from "@/pages/UsersAndControl/role.page";
import Teams from "@/pages/UsersAndControl/teams2.page";
// import { Teams } from "@/pages/UsersAndControl/teams.page";
import { type RouteObject } from "react-router-dom";

export const settingRoutes: RouteObject[] = [
  {
    path: ROUTES.DASHBOARD,
    children: [
      {
        path: "settings",
        element: <SettingLayout />,
        children: [
          { index: true, element: <SettingPage /> },

          // General Link
          { path: "profile", element: <ProfilePage /> },
          { path: "company-details", element: <CompanyDetails /> },
          { path: "notifications", element: <Notification /> },


          // User Control
          { path: "users", element: <Teams /> },
          { path: "roles", element: <Role /> },
          { path: "workspace", element: <DashboardPage /> },

          // Plan and Subscription
          { path: "subscription", element: <SubscriptionPage /> },

          // Integrations
          { path: "integrations", element: <Integrations /> },

          // Channels
          { path: "whatsapp", element: <Whatsapp /> },
          { path: "instagram", element: <Instagram /> },
          { path: "telegram", element: <Telegram /> },


          // Developer
          { path: "webhook", element: <Webhook /> },


          // Data Administrator
          { path: "recyclebin", element: <Recyclebin /> },
          { path: "storage", element: <Storage /> },
        ],
      },
    ],
  },
];
