import { AppLayout, RootLayout } from "@/layouts";
import {
  Accounts,
  AuthCallbackPage,
  HomePage,
  LoginPage,
  OnBoardingPage,
  RegisterPage,
} from "@/pages";
import { createBrowserRouter } from "react-router-dom";
import { dashboardRoutes } from "./dashboard.routes";
import { builderRoutes } from "./builder.routes";
import { chatBotRoutes } from "./chat-bot.routes";
import { formRoutes } from "./form.routes";

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
        element: <AppLayout />,
        children: [
          ...dashboardRoutes,
          ...builderRoutes,
          ...chatBotRoutes,
          ...formRoutes,
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
