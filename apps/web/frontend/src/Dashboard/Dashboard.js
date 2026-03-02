import TesterDashboard from "./TesterDashboard";
import DeveloperDashboard from "./DeveloperDashboard";
import AdminDashboard from "./AdminDashboard";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  if (!token) return <div>Unauthorized</div>;

  switch (role) {
    case "tester":
      return <TesterDashboard />;
    case "developer":
      return <DeveloperDashboard />;
    case "admin":
      navigate("/admin/dashboard");
    default:
      return <div>Invalid role</div>;
  }
}

export default Dashboard;