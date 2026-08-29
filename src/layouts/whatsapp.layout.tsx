import Sidebar from "@/pages/Channels/whatsapp/components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export const WhatsappLayout = () => {
  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
      <Sidebar />

      <main className="w-full h-[calc(100vh-64px)] hide-scrollbar overflow-y-scroll bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

// const WhatsappLayout = () => {
//   return (
//     <div className="flex">
//       <Sidebar />

//       <main className="w-full h-full overflow-hidden bg-gray-50">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export { WhatsappLayout };
