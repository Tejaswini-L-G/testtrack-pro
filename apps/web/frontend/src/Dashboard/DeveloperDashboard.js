import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./Dashboard.css";

function DeveloperDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    fixed: 0,
    retest: 0
  });

  useEffect(() => {
    fetch("http://localhost:5000/dashboard/developer", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => console.error("Failed to load developer stats"));
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-layout">

      {/* 🔵 SIDEBAR */}
      <aside className="sidebar">

        <h2 className="logo">TestTrack Pro</h2>

        <nav className="sidebar-nav">

          <button
            className={isActive("/developer/home") ? "active" : ""}
            onClick={() => navigate("/developer/home")}
          >
            Home
          </button>

          <button
            className={isActive("/developer/dashboard") ? "active" : ""}
            onClick={() => navigate("/developer/dashboard")}
          >
            Dashboard
          </button>

          <hr />

          <p className="nav-section">Developer Workspace</p>

          <button
            onClick={() => navigate("/developer/issues")}
          >
            Assigned Issues
          </button>

          <button
            onClick={() => navigate("/developer/reports")}
          >
            View Test Reports
          </button>

          <button
            onClick={() => navigate("/developer/testcases")}
          >
            View Test Case Details
          </button>

          <button
            onClick={() => navigate("/developer/commits")}
          >
            Link Code Commits
          </button>

          <button
            onClick={() => navigate("/developer/export")}
          >
            Export Reports
          </button>

          <hr />

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>

        </nav>
      </aside>

      {/* 🔵 RIGHT CONTENT */}
      <main className="dashboard-content">

        {/* DASHBOARD HOME */}
        {location.pathname === "/developer/dashboard" && (
          <>
            <h1>Developer Dashboard</h1>

            <div className="stats-grid">

              <div className="stat-card">
                <span>Assigned Issues</span>
                <strong>{stats.assigned}</strong>
              </div>

              <div className="stat-card">
                <span>In Progress</span>
                <strong>{stats.inProgress}</strong>
              </div>

              <div className="stat-card">
                <span>Fixed</span>
                <strong>{stats.fixed}</strong>
              </div>

              <div className="stat-card">
                <span>Pending Retest</span>
                <strong>{stats.retest}</strong>
              </div>

            </div>

            <div className="dashboard-section">
              <h2>Assigned Issues</h2>
              <p>Select "Assigned Issues" from sidebar to manage bugs.</p>
            </div>
          </>
        )}

        {/* CHILD ROUTES */}
        <Outlet />

      </main>
    </div>
  );
}

export default DeveloperDashboard;