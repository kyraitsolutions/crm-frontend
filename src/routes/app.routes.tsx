import { AppLayout, RootLayout } from "@/layouts";
import {
  AuthCallbackPage,
  HomePage,
  LoginPage,
  OnBoardingPage,
  RegisterPage,
} from "@/pages";
import { createBrowserRouter } from "react-router-dom";
import { builderRoutes } from "./builder.routes";
import { chatBotRoutes } from "./chat-bot.routes";
import { dashboardRoutes } from "./dashboard.routes";
import { formRoutes } from "./form.routes";
import { leadRoutes } from "./lead.route";
import TermsPage from "@/pages/terms.page";
import PrivacyPolicyPage from "@/pages/privacy.page";
import PricingPage from "@/pages/pricing.page";

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
        path: '/pricing',
      },
      {
        element: <TermsPage />,
        path: '/terms',
      },
      {
        element: <PrivacyPolicyPage />,
        path: '/privacy-policy',
      },
      {
        element: <AppLayout />,
        children: [
          ...dashboardRoutes,
          ...builderRoutes,
          ...chatBotRoutes,
          ...formRoutes,
          ...leadRoutes,
          {
            path: "/on-boarding",
            element: <OnBoardingPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallbackPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);
