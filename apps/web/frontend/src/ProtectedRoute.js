import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;