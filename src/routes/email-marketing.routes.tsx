import { EmailMarketingLayout } from "@/layouts/emailMarketing.layout";
import EmailMarketing from "@/pages/EmailMarketing";
import Automations from "@/pages/EmailMarketing/automations.page";
import Campaign from "@/pages/EmailMarketing/campaign.page";
import CreateCampaignPage from "@/pages/EmailMarketing/CreateCampaign.page";
import CampaignDetailPage from "@/pages/EmailMarketing/CampaignDetail.page";
import TemplatesPage from "@/pages/EmailMarketing/templates.page";
import AudiencesPage from "@/pages/EmailMarketing/audiences.page";
import SuppressionPage from "@/pages/EmailMarketing/suppression.page";
import { EMAIL_MARKETING_PATHS } from "@/constants/routes/email-marketing.path";
import { type RouteObject } from "react-router-dom";

export const emailMarketingRoutes: RouteObject[] = [
  {
    path: EMAIL_MARKETING_PATHS.ROOT,
    element: <EmailMarketingLayout />,
    children: [
      { index: true, element: <EmailMarketing /> },
      { path: "campaigns", element: <Campaign /> },
      { path: "campaigns/create", element: <CreateCampaignPage /> },
      { path: "campaigns/:campaignId", element: <CampaignDetailPage /> },
      { path: "templates", element: <TemplatesPage /> },
      { path: "audiences", element: <AudiencesPage /> },
      { path: "suppression", element: <SuppressionPage /> },
      { path: "automations", element: <Automations /> },
    ],
  },
];
