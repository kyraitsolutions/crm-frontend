import { AppLayout, RootLayout } from "@/layouts";
import {
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
          {
            path: "/on-boarding",
            element: <OnBoardingPage />,
          },
          {
            path: "/projects",
            element: <h1>Projects</h1>,
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
