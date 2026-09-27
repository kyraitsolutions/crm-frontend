import { CONTACT_PATHS } from "@/constants/routes/contact.path";
import Contacts from "@/pages/contacts.page";
import ImportHistoryPage from "@/pages/Contact/import/pages/ImportHistoryPage";
import ImportJobPage from "@/pages/Contact/import/pages/ImportJobPage";
import ImportNewPage from "@/pages/Contact/import/pages/ImportNewPage";
import { PERMISSIONS } from "@/rbac";
import { type ReactNode } from "react";
import { type RouteObject } from "react-router-dom";
import { RequirePermission } from "./route-access/RequirePermission";

function ImportRoute({ children }: { children: ReactNode }) {
  return (
    <RequirePermission permission={PERMISSIONS.CONTACTS.IMPORT}>
      <div data-testid="contact-import">{children}</div>
    </RequirePermission>
  );
}

export const contactRoutes: RouteObject[] = [
  {
    path: CONTACT_PATHS.ROOT,
    children: [
      {
        element: <Contacts />,
        index: true,
      },
      {
        path: "imports",
        element: (
          <ImportRoute>
            <ImportHistoryPage />
          </ImportRoute>
        ),
      },
      {
        path: "imports/new",
        element: (
          <ImportRoute>
            <ImportNewPage />
          </ImportRoute>
        ),
      },
      {
        path: "imports/:jobId",
        element: (
          <ImportRoute>
            <ImportJobPage />
          </ImportRoute>
        ),
      },
    ],
  },
];
