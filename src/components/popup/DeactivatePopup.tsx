import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { AuthStoreManager } from "@/stores";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { FaSignOutAlt } from "react-icons/fa";

const DeactivatePopup = () => {
  const navigate = useNavigate();
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5"
      >
        <h2 className="text-lg font-semibold text-slate-900">
          Your account is deactivated
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          You can sign in, but this workspace is paused. Please contact your
          administrator to reactivate your account.
        </p>
        <Button
          type="button"
          className="bg-slate-700 text-white px-4 py-2 rounded-xl mt-3 hover:bg-slate-800"
          onClick={() => {
            new AuthStoreManager().setUser(null);
            CookieUtils.clear();
            navigate("/login");
          }}
        >
          Sign out <FaSignOutAlt />
        </Button>
      </div>
    </div>
  );
};

export default DeactivatePopup;
