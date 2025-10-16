import { BuilderHeader } from "@/components/builder-header";
import { Outlet } from "react-router-dom";

export const BuilderLayout = () => {
  return (
    <div className="flex flex-col h-screen min-h-screen">
      <BuilderHeader />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
