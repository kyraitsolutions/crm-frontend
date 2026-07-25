import { WHATSAPP_PATHS } from "@/constants/routes/whatsapp.path";
import { WhatsappLayout } from "@/layouts/whatsapp.layout";
import CreateMessage from "@/pages/Channels/whatsapp/components/canned/CreateMessage";
import { TemplateBuilder } from "@/pages/Channels/whatsapp/components/template-builder/TemplateBuilder";
import CannedMessage from "@/pages/Channels/whatsapp/pages/CannedMessage";
import LiveChatSetting from "@/pages/Channels/whatsapp/pages/LiveChatSetting";
import OptinPage from "@/pages/Channels/whatsapp/pages/OptinPage";
import TemplatesPage from "@/pages/Channels/whatsapp/pages/TemplatesPage";
import { Whatsapp } from "@/pages/Channels/whatsapp/pages/WhatsAppPage";
import type { RouteObject } from "react-router-dom";
export const whatsappRoutes: RouteObject[] = [
    {
        path: WHATSAPP_PATHS.ROOT,
        element: <WhatsappLayout />,
        children: [
            {
                element: <Whatsapp />,
                index: true,
            },
            {
                element: <TemplatesPage />,
                path: "template-messages",
            },
            {
                element: <TemplateBuilder />,
                path: "template-messages/create",
            },
            {
                element: <OptinPage />,
                path: "optin",
            },
            {
                element: <LiveChatSetting />,
                path: "chat-setting",
            },
            {
                element: <CannedMessage />,
                path: "canned-messages",
            },
            {
                element: <CreateMessage />,
                path: "canned-messages/create",
            },
            {
                element: <TemplatesPage />,
                path: "call-settings",
            },
        ],
    },
];
