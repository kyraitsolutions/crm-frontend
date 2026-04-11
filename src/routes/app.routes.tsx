import { AppLayout, RootLayout } from "@/layouts";
import {
  AuthCallbackPage,
  HomePage,
  LoginPage,
  OnBoardingPage,
  RegisterPage,
} from "@/pages";
import PricingPage from "@/pages/pricing.page";
import PrivacyPolicyPage from "@/pages/privacy.page";
import TermsPage from "@/pages/terms.page";
import { createBrowserRouter } from "react-router-dom";
import { builderRoutes } from "./builder.routes";
import { chatBotRoutes } from "./chat-bot.routes";
import { dashboardRoutes } from "./dashboard.routes";
import { formRoutes } from "./form.routes";
import { leadRoutes } from "./lead.route";
// import ProductPage from "@/pages/product.page";
// import About from "@/pages/about.page";
import { Teams } from "@/pages/UsersAndControl/teams.page";
import { broadcastRoutes } from "./broadcast.routes";
import { contactRoutes } from "./contact.routes";
import { settingRoutes } from "./setting.routes";
import { PublicOnly } from "./route-access/PublicOnly";
import { ProtectedOnly } from "./route-access/ProtectedOnly";

export const appRoutes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        element: <PricingPage />,
        path: "/pricing",
      },
      {
        element: <TermsPage />,
        path: "/terms",
      },
      {
        element: <PrivacyPolicyPage />,
        path: "/privacy-policy",
      },

      // Auth PUBLIC ONLY (not logged in)
      {
        element: <PublicOnly />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
        ],
      },

      //PROTECTED (logged in)
      {
        element: <ProtectedOnly />,
        children: [
          {
            element: <AppLayout />,
            children: [
              ...dashboardRoutes,
              ...builderRoutes,
              ...chatBotRoutes,
              ...formRoutes,
              ...leadRoutes,
              ...broadcastRoutes,
              ...contactRoutes,
              ...settingRoutes,

              {
                path: "/teams",
                element: <Teams />,
              },
            ],
          },
          {
            path: "/on-boarding",
            element: <OnBoardingPage />,
          },
        ],
      },
      {
        path: "/auth/callback",
        element: <AuthCallbackPage />,
      },
    ],
  },
]);
