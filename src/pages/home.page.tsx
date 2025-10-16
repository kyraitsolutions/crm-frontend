import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      Home Page
      <button
        onClick={() => {
          window.location.href = "http://localhost:3000/api/auth/google";
        }}
      >
        Login with Google
      </button>
      <Button onClick={() => navigate("/dashboard")}>GO TO DASHBOARD</Button>
    </div>
  );
};

export { HomePage };
