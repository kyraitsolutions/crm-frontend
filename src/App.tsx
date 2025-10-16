import { SidebarProvider } from "@/components/ui/sidebar";
import { RouterProvider } from "react-router-dom";
import { appRoutes } from "@/routes";

export default function App() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <RouterProvider router={appRoutes} />
    </SidebarProvider>
  );
}
