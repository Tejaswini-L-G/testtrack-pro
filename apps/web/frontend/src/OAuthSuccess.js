import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OAuthSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/");
      return;
    }

    // Save token
    localStorage.setItem("token", token);

    // Decode role
    const payload = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem("role", payload.role);

    // Redirect based on role
    if (payload.role === "admin") {
      navigate("/admin/dashboard");
    } else if (payload.role === "developer") {
      navigate("/developer/dashboard");
    } else {
      navigate("/dashboard");
    }
  }, [location, navigate]);

  return <p>Logging you in...</p>;
}

export default OAuthSuccess;