import { useEffect } from "react";
import { LocalStorageUtils } from "../utils";
import { useNavigate } from "react-router-dom";

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = LocalStorageUtils.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return <div className="w-full">{children}</div>;
};
