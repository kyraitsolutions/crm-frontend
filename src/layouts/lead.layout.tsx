import { Outlet } from "react-router-dom";

const LeadLayout = () => {
  return (
    <div className="flex min-w-0 w-full max-w-full">
      <main className="min-w-0 w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export { LeadLayout };
