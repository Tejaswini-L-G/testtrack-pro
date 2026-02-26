import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./Dashboard.css";
import ProfileMenu from "../Dashboard/Profile";

function TesterDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    approved: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/dashboard/tester", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => console.error("Failed to load stats"));
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-layout">

    {/* 🔵 TOPBAR */}
<div className="topbar">
  <ProfileMenu />
</div>

      {/* SIDEBAR */}
      <aside className="sidebar">

        <h2 className="logo">TestTrack Pro</h2>

        <nav className="sidebar-nav">

          <button
            className={isActive("/dashboard/home") ? "active" : ""}
            onClick={() => navigate("/dashboard/home")}
          >
            Home
          </button>

          <button
            className={isActive("/dashboard") ? "active" : ""}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <hr />

          <p className="nav-section">Test Case Management</p>

          <button
            onClick={() => navigate("/dashboard/testcases")}
          >
            View Test Cases
          </button>

          <button
            onClick={() => navigate("/dashboard/testcases/create")}
          >
            Create Test Case
          </button>

          <button
            onClick={() => navigate("/dashboard/templates")}
          >
            Templates
          </button>

          <button
            onClick={() => navigate("/dashboard/import")}
          >
            Import Test Cases
          </button>

          <button
            onClick={() => navigate("/dashboard/suites")}
          >
            Test Suites
          </button>

          <button
  onClick={() => navigate("/dashboard/execution")}
>
  Execute Test Cases
</button>

<button
  onClick={() => navigate("/dashboard/my-runs")}
>
  My Test Runs
</button>

<button
  onClick={() => navigate("/dashboard/my-executions")}
>
  My Executions
</button>

<button onClick={() => navigate("/dashboard/bugs")}>
  My Bugs
</button>

          <hr />

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

      {/* RIGHT CONTENT */}
      <main className="dashboard-content">

        {/* Dashboard Home Content */}
        {location.pathname === "/dashboard" && (
          <>
            <h1>Tester Dashboard</h1>

            <div className="stats-grid">
              <div className="stat-card">
                <span>Total Test Cases</span>
                <strong>{stats.total}</strong>
              </div>

              <div className="stat-card">
                <span>Draft</span>
                <strong>{stats.draft}</strong>
              </div>

              <div className="stat-card">
                <span>Approved</span>
                <strong>{stats.approved}</strong>
              </div>
            </div>
          </>
        )}

        {/* CHILD PAGES RENDER HERE */}
        <Outlet />

      </main>
    </div>
  );
}

export default TesterDashboard;