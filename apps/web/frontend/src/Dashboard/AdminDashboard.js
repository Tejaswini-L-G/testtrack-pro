import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">

      {/* ===== LEFT SIDEBAR ===== */}
      <aside className="admin-sidebar">

        <h2 className="admin-logo">TestTrack Pro</h2>

        <nav className="admin-nav">

          {/* HOME (your existing home/dashboard) */}
          <button
            className={isActive("/admin/dashboard") ? "active" : ""}
            onClick={() => navigate("/dashboard/home")}
          >
            Home
          </button>

          <button
            className={isActive("/admin/dashboard") ? "active" : ""}
            onClick={() => navigate("/admin/dashboard")}
          >
            Dashboard
          </button>


          {/* VIEW TEST CASES */}
          <button
            className={isActive("/admin/testcases") ? "active" : ""}
            onClick={() => navigate("/admin/dashboard/testcases")}
            
          >
            View Test Cases
          </button>

          <hr />

          {/* LOGOUT */}
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/dashboard/home");
            }}
          >
            Logout
          </button>

        </nav>
      </aside>

      {/* ===== RIGHT CONTENT ===== */}
      <main className="admin-content">

        {/* Show default content when on /admin/dashboard */}
        {location.pathname === "/admin/dashboard" && (
          <>
            <h2>Admin Dashboard</h2>
            <p>Manage users, roles and system settings.</p>
          </>
        )}

        {/* Render child pages like AdminTestCases */}
        <Outlet />

      </main>

    </div>
  );
}

export default AdminDashboard;