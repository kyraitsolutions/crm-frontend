import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
};
