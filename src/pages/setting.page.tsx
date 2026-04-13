import { ROUTES } from "@/constants/routes";
import { settingSections } from "@/constants/setting.constant";
import { Link } from "react-router-dom";

const SettingPage = () => {
  // const { accountName } = useAuthStore((state) => state);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      {/* <h1 className="text-xl font-medium mb-2">Settings</h1>
            <div className="h-px w-full border-b" /> */}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {settingSections.map((section, idx) => (
          <div key={idx} className=" p-5 transition">
            {/* Section Title */}
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              {section.title}
            </h2>

            {/* Items */}
            <div className="flex flex-col gap-4">
              {section.items.map((item, i) => (
                <Link
                  to={`${ROUTES.DASHBOARD}/settings${item.link}`}
                  key={i}
                  className="text-left cursor-pointer text-sm text-primary hover:text-primary  transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingPage;
