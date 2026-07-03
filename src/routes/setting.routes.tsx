import { ROUTES } from "@/constants/routes";
import { SettingLayout } from "@/layouts/setting.layout";
import { ChatBotPage, DashboardPage } from "@/pages";
import Instagram from "@/pages/Channels/instagram.page";
import Telegram from "@/pages/Channels/telegram.page";
import ChatFlows from "@/pages/ChatFlows/ChatFlows";
import Recyclebin from "@/pages/DataAdministration/recyclebin.page";
import Storage from "@/pages/DataAdministration/storage.page";
import Integrations from "@/pages/Integration/Integrations";
import NotificationSettingPage from "@/pages/Notification/NotificationSettingPage";
// import Notification from "@/pages/Notification/notification.page";
import CompanyDetails from "@/pages/Profile/CompanyDetails";
import ProfilePage from "@/pages/Profile/Profile";
import SettingPage from "@/pages/setting.page";
import { SubscriptionPage } from "@/pages/subscription.page";
import Role from "@/pages/UsersAndControl/role.page";
import Teams from "@/pages/UsersAndControl/teams2.page";
// import { Teams } from "@/pages/UsersAndControl/teams.page";
import ChatbotFlowEditor from "@/components/chatFlowEditior/ChatbotFlowEditor";
import { PERMISSIONS } from "@/rbac";
import { type RouteObject } from "react-router-dom";
import { RequirePermission } from "./route-access/RequirePermission";
import ConfigurationPage from "@/pages/Settings/configuration/ConfigurationPage";
import MySubscriptionPage from "@/pages/PlanAndSubscription/mysubscription.page";
import ActivityLogsPage from "@/pages/Settings/activityLogs/ActivityLogsPage";
import { Whatsapp } from "@/pages/Channels/whatsapp/pages/WhatsAppPage";
import Webhook from "@/pages/Developer/Webhook/Webhook";
import Facebook from "@/pages/Channels/facebook.page";

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
          { path: "notifications", element: <NotificationSettingPage /> },

          // User Control
          { path: "users", element: <Teams /> },
          { path: "roles", element: <Role /> },
          { path: "workspace", element: <DashboardPage /> },

          // Plan and Subscription
          { path: "subscription", element: <SubscriptionPage /> },
          { path: "my-plan", element: <MySubscriptionPage /> },

          // Integrations
          { path: "integrations", element: <Integrations /> },

          // Channels
          { path: "whatsapp", element: <Whatsapp /> },
          { path: "instagram", element: <Instagram /> },
          { path: "telegram", element: <Telegram /> },
          { path: "facebook", element: <Facebook /> },

          // Developer
          { path: "webhook", element: <Webhook /> },

          // Bot
          { path: "chatbot", element: <ChatBotPage /> },
          { path: "chatflows", element: <ChatFlows /> },
          {
            path: "chatflows/flow-builder",
            element: (
              <RequirePermission
                permission={
                  PERMISSIONS.CHATBOTS.VIEW || PERMISSIONS.CHATBOTS.CREATE
                }
              >
                <ChatbotFlowEditor />
              </RequirePermission>
            ),
          },
          {
            path: "chatflows/:chatflowId/flow-builder",
            element: (
              <RequirePermission
                permission={
                  PERMISSIONS.CHATBOTS.VIEW || PERMISSIONS.CHATBOTS.CREATE
                }
              >
                <ChatbotFlowEditor />
              </RequirePermission>
            ),
          },
          // Data Administrator
          { path: "recyclebin", element: <Recyclebin /> },
          { path: "storage", element: <Storage /> },

          // configuration
          { path: "configuration", element: <ConfigurationPage /> },
          { path: "activity-logs", element: <ActivityLogsPage /> },
        ],
      },
    ],
  },
];
