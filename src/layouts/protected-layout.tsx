import { COOKIES_STORAGE } from "@/constants";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = CookieUtils.getItem(COOKIES_STORAGE.auth_token);
    console.log(token);
    // if (!token) {
    //   navigate("/login");
    // }
  }, [navigate]);

  return <div className="w-full">{children}</div>;
};
