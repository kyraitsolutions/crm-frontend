import { BROADCAST_PATHS } from "@/constants/routes/broadcast.path";
import { WhatsappMarketingLayout } from "@/layouts/whatsappMarketing.layout";
import { TemplateLayout } from "@/layouts/templates.layout";
import WhatsappMarketing from "@/pages/WhatsappMarketing";
import WhatsAppCampaignsPage from "@/pages/WhatsappMarketing/campaigns.page";
import CreateWhatsAppCampaignPage from "@/pages/WhatsappMarketing/CreateCampaign.page";
import WhatsAppCampaignDetailPage from "@/pages/WhatsappMarketing/CampaignDetail.page";
import Templates from "@/pages/MessageTemplates";
import { type RouteObject } from "react-router-dom";

export const broadcastRoutes: RouteObject[] = [
  {
    path: BROADCAST_PATHS.ROOT,
    children: [
      {
        path: "whatsapp",
        element: <WhatsappMarketingLayout />,
        children: [
          { index: true, element: <WhatsappMarketing /> },
          { path: "campaigns", element: <WhatsAppCampaignsPage /> },
          { path: "campaigns/create", element: <CreateWhatsAppCampaignPage /> },
          { path: "campaigns/:campaignId", element: <WhatsAppCampaignDetailPage /> },
        ],
      },
      {
        path: "templates",
        element: <TemplateLayout />,
        children: [
          { index: true, element: <Templates /> },
          { path: "mytemplates", element: <Templates /> },
        ],
      },
    ],
  },
];
