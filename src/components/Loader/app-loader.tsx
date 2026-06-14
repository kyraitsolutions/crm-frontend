import Loader from "../Loader";

const AppLoader = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100/90">
      <div className="bg-white shadow-xs rounded-xl p-8 flex flex-col items-center">
        {/* Logo / Brand */}
        <div className="mb-6 flex items-center gap-2">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">
            K
          </div>
          <span className="text-lg font-semibold text-gray-700">
            Kyra AI CRM
          </span>
        </div>

        {/* Spinner */}
        <div className="">
          <Loader color="#1e2225" size={40} className="border-4 text-primary" />
        </div>

        {/* Text */}
        <p className="mt-4 text-sm text-gray-600 animate-pulse">
          Loading your workspace.....
        </p>
      </div>
    </div>
  );
};

export default AppLoader;
