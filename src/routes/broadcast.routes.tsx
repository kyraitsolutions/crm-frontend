import { BROADCAST_PATHS } from "@/constants/routes/broadcast.path";
import { WhatsappMarketingLayout } from "@/layouts/whatsappMarketing.layout";
import { TemplateLayout } from "@/layouts/templates.layout";
import WhatsappMarketing from "@/pages/WhatsappMarketing";
import WhatsAppCampaignsPage from "@/pages/WhatsappMarketing/campaigns.page";
import CreateWhatsAppCampaignPage from "@/pages/WhatsappMarketing/CreateCampaign.page";
import WhatsAppCampaignDetailPage from "@/pages/WhatsappMarketing/CampaignDetail.page";
import Templates from "@/pages/MessageTemplates";
import { PERMISSIONS } from "@/rbac";
import { type RouteObject } from "react-router-dom";
import { RequirePermission } from "./route-access/RequirePermission";

export const broadcastRoutes: RouteObject[] = [
  {
    path: BROADCAST_PATHS.ROOT,
    children: [
      {
        path: "whatsapp",
        element: (
          <RequirePermission permission={PERMISSIONS.WHATSAPP_MARKETING.VIEW}>
            <WhatsappMarketingLayout />
          </RequirePermission>
        ),
        children: [
          { index: true, element: <WhatsappMarketing /> },
          { path: "campaigns", element: <WhatsAppCampaignsPage /> },
          {
            path: "campaigns/create",
            element: (
              <RequirePermission
                permission={PERMISSIONS.WHATSAPP_MARKETING.CREATE}
              >
                <CreateWhatsAppCampaignPage />
              </RequirePermission>
            ),
          },
          {
            path: "campaigns/:campaignId",
            element: <WhatsAppCampaignDetailPage />,
          },
        ],
      },
      {
        path: "templates",
        element: (
          <RequirePermission permission={PERMISSIONS.WHATSAPP.VIEW}>
            <TemplateLayout />
          </RequirePermission>
        ),
        children: [
          { index: true, element: <Templates /> },
          { path: "mytemplates", element: <Templates /> },
        ],
      },
    ],
  },
];
