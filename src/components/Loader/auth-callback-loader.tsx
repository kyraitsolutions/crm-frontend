import Loader from "../Loader";

export const AuthCallbackLoader = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100/90">
      <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-4">
          <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">
            K
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Kyra AI CRM</h1>
        </div>

        {/* Animated Loader */}
        <div className="">
          <Loader size={40} color="#16A34A" className="border-4" />
        </div>

        {/* Text */}
        <p className="text-lg text-gray-600 font-medium">Signing you in...</p>

        <p className="text-md text-gray-400 mt-3">
          Securely connecting your account
        </p>
      </div>
    </div>
  );
};
