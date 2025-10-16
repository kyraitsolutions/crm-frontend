import { BuilderLayout } from "@/layouts";
import { BuilderPage } from "@/pages";
import type { RouteObject } from "react-router-dom";

export const builderRoutes: RouteObject[] = [
  {
    path: "/builder",
    element: <BuilderLayout />,
    children: [
      {
        element: <BuilderPage />,
        index: true,
      },
    ],
  },
];
