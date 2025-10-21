import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div className=" w-screen h-screen">
      <Outlet />
    </div>
  );
};
