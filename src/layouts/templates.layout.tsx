import { Outlet } from "react-router-dom";

const TemplateLayout = () => {
  return (
    <div className="flex h-screen">
      <main className="w-full h-screen overflow-y-scroll">
        <Outlet />
      </main>
    </div>
  );
};

export { TemplateLayout };
