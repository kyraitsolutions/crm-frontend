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
import CompanyDetails from "@/pages/Profile/CompanyDetails";
import SettingPage from "@/pages/setting.page";
import { SubscriptionPage } from "@/pages/subscription.page";
import Role from "@/pages/UsersAndControl/role.page";
import Teams from "@/pages/UsersAndControl/teams2.page";
import ChatbotFlowEditor from "@/components/chatFlowEditior/ChatbotFlowEditor";
import Webhook from "@/pages/Developer/Webhook/Webhook";
import MySubscriptionPage from "@/pages/PlanAndSubscription/mysubscription.page";
import ProfilePage from "@/pages/Profile/UserProfile/pages/Profile";
import ActivityLogsPage from "@/pages/Settings/activityLogs/ActivityLogsPage";
import AiAgentPage from "@/pages/Settings/ai-agent/AiAgentPage";
import ConfigurationPage from "@/pages/Settings/configuration/ConfigurationPage";
import { PERMISSIONS } from "@/rbac";
import { type ReactNode } from "react";
import { type RouteObject } from "react-router-dom";
import { RequirePermission } from "./route-access/RequirePermission";

function Guard({
  permission,
  children,
}: {
  permission: string | string[];
  children: ReactNode;
}) {
  return (
    <RequirePermission permission={permission}>{children}</RequirePermission>
  );
}

export const settingRoutes: RouteObject[] = [
  {
    path: ROUTES.DASHBOARD,
    children: [
      {
        path: "settings",
        element: <SettingLayout />,
        children: [
          { index: true, element: <SettingPage /> },

          { path: "profile", element: <ProfilePage /> },
          {
            path: "company-details",
            element: (
              <Guard permission={PERMISSIONS.ORGANIZATION.VIEW}>
                <CompanyDetails />
              </Guard>
            ),
          },
          { path: "notifications", element: <NotificationSettingPage /> },

          {
            path: "users",
            element: (
              <Guard permission={PERMISSIONS.TEAMS.VIEW}>
                <Teams />
              </Guard>
            ),
          },
          {
            path: "roles",
            element: (
              <Guard permission={PERMISSIONS.ROLE.VIEW}>
                <Role />
              </Guard>
            ),
          },
          {
            path: "workspace",
            element: (
              <Guard permission={PERMISSIONS.ACCOUNTS.VIEW}>
                <DashboardPage />
              </Guard>
            ),
          },

          { path: "subscription", element: <SubscriptionPage /> },
          { path: "my-plan", element: <MySubscriptionPage /> },

          {
            path: "integrations",
            element: (
              <Guard permission={PERMISSIONS.INTEGRATIONS.VIEW}>
                <Integrations />
              </Guard>
            ),
          },

          {
            path: "instagram",
            element: (
              <Guard permission={PERMISSIONS.INSTAGRAM.VIEW}>
                <Instagram />
              </Guard>
            ),
          },
          {
            path: "telegram",
            element: (
              <Guard permission={PERMISSIONS.TELEGRAM.VIEW}>
                <Telegram />
              </Guard>
            ),
          },

          {
            path: "webhook",
            element: (
              <Guard permission={PERMISSIONS.WEBHOOKS.VIEW}>
                <Webhook />
              </Guard>
            ),
          },

          {
            path: "chatbot",
            element: (
              <Guard permission={PERMISSIONS.CHATBOTS.VIEW}>
                <ChatBotPage />
              </Guard>
            ),
          },
          {
            path: "chatflows",
            element: (
              <Guard permission={PERMISSIONS.CHATBOTS.VIEW}>
                <ChatFlows />
              </Guard>
            ),
          },
          {
            path: "ai-agent",
            element: (
              <Guard permission={PERMISSIONS.WHATSAPP.VIEW}>
                <AiAgentPage />
              </Guard>
            ),
          },
          {
            path: "chatflows/flow-builder",
            element: (
              <Guard
                permission={[
                  PERMISSIONS.CHATBOTS.VIEW,
                  PERMISSIONS.CHATBOTS.CREATE,
                ]}
              >
                <ChatbotFlowEditor />
              </Guard>
            ),
          },
          {
            path: "chatflows/:chatflowId/flow-builder",
            element: (
              <Guard
                permission={[
                  PERMISSIONS.CHATBOTS.VIEW,
                  PERMISSIONS.CHATBOTS.CREATE,
                ]}
              >
                <ChatbotFlowEditor />
              </Guard>
            ),
          },

          {
            path: "recyclebin",
            element: (
              <Guard permission={PERMISSIONS.RECYCLE_BIN.VIEW}>
                <Recyclebin />
              </Guard>
            ),
          },
          {
            path: "storage",
            element: (
              <Guard permission={PERMISSIONS.STORAGE.VIEW}>
                <Storage />
              </Guard>
            ),
          },

          {
            path: "configuration",
            element: (
              <Guard permission={PERMISSIONS.CONFIGURATION.VIEW}>
                <ConfigurationPage />
              </Guard>
            ),
          },
          {
            path: "activity-logs",
            element: (
              <Guard permission={PERMISSIONS.ACTIVITY_LOGS.VIEW}>
                <ActivityLogsPage />
              </Guard>
            ),
          },
        ],
      },
    ],
  },
];
