import { LocalStorageUtils } from "@/utils";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const authCallbackHandler = async () => {
      const token = new URLSearchParams(location.search).get("token");
      if (!token) {
        return;
      }
      LocalStorageUtils.setItem("token", token);
      navigate("/dashboard");
    };
    authCallbackHandler();
  }, [location.pathname, location.search, navigate]);

  return <div>AuthCallbackPage</div>;
};
