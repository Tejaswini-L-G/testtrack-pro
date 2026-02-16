import { jwtDecode } from "jwt-decode";
import TesterDashboard from "./TesterDashboard";
import DeveloperDashboard from "./DeveloperDashboard";
import AdminDashboard from "./AdminDashboard";

function Dashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <div>Unauthorized</div>;
  }

  const decoded = jwtDecode(token);
  const role = decoded.role;

  if (role === "tester") {
    return <TesterDashboard />;
  }

  if (role === "developer") {
    return <DeveloperDashboard />;
  }

  if (role === "admin") {
    return <AdminDashboard />;
  }

  return <div>Invalid role</div>;
}

export default Dashboard;
