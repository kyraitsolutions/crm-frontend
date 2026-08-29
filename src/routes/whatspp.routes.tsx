import { ROUTES } from "@/constants";
import { WhatsappLayout } from "@/layouts/whatsapp.layout";
import CreateMessage from "@/pages/Channels/whatsapp/components/canned/CreateMessage";
import { TemplateBuilder } from "@/pages/Channels/whatsapp/components/template-builder/TemplateBuilder";
import CannedMessage from "@/pages/Channels/whatsapp/pages/CannedMessage";
import LiveChatSetting from "@/pages/Channels/whatsapp/pages/LiveChatSetting";
import OptinPage from "@/pages/Channels/whatsapp/pages/OptinPage";
import Setting from "@/pages/Channels/whatsapp/pages/Setting";
import TemplatesPage from "@/pages/Channels/whatsapp/pages/TemplatesPage";
import { Whatsapp } from "@/pages/Channels/whatsapp/pages/WhatsAppPage";
import { WhatsappRouteGuard } from "@/pages/Channels/whatsapp/routes/WhatsappRouteGuard";
import WhatsAppWorkspace from "@/pages/Channels/whatsapp/sections/WhatsAppWorkspace";
import type { RouteObject } from "react-router-dom";
export const whatsappRoutes: RouteObject[] = [
  {
    // path: WHATSAPP_PATHS.ROOT,
    path: ROUTES.DASHBOARD,

    children: [
      {
        path: ROUTES.DASHBOARD,
        children: [
          {
            path: "settings/whatsapp",
            element: <WhatsappRouteGuard />,
            children: [
              {
                index: true,
                element: <Whatsapp />,
              },

              {
                element: <WhatsappLayout />,
                children: [
                  {
                    path: "overview",
                    element: <WhatsAppWorkspace />,
                  },
                  {
                    path: "template-messages",
                    element: <TemplatesPage />,
                  },
                  {
                    path: "template-messages/create",
                    element: <TemplateBuilder />,
                  },
                  {
                    path: "optin",
                    element: <OptinPage />,
                  },
                  {
                    path: "chat-setting",
                    element: <LiveChatSetting />,
                  },
                  {
                    path: "canned-messages",
                    element: <CannedMessage />,
                  },
                  {
                    path: "canned-messages/create",
                    element: <CreateMessage />,
                  },
                  {
                    path: "call-settings",
                    element: <TemplatesPage />,
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
      // {
      //   path: "settings/whatsapp",
      //   // element: <WhatsappLayout />,
      //   children: [
      //     {
      //       element: <Whatsapp />,
      //       index: true,
      //     },
      //     // {
      //     //   element: <WhatsAppWorkspace />,
      //     //   path: "overview",
      //     // },
      //     {
      //       element: <TemplatesPage />,
      //       path: "template-messages",
      //     },
      //     {
      //       element: <TemplateBuilder />,
      //       path: "template-messages/create",
      //     },
      //     {
      //       element: <OptinPage />,
      //       path: "optin",
      //     },
      //     {
      //       element: <LiveChatSetting />,
      //       path: "chat-setting",
      //     },
      //     {
      //       element: <CannedMessage />,
      //       path: "canned-messages",
      //     },
      //     {
      //       element: <CreateMessage />,
      //       path: "canned-messages/create",
      //     },
      //     {
      //       element: <TemplatesPage />,
      //       path: "call-settings",
      //     },
      //     {
      //       element: <Setting />,
      //       path: "setting",
      //     },
      //   ],
      // },
    ],
  },
];
