import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "./Dashboard.css";


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
      .then(data => {
        setStats(data);
      })
      .catch(() => {
        console.error("Failed to load dashboard stats");
      });
  }, []);

  const isActive = (path) => location.pathname === path;

 return (
  <div className="dashboard-layout">

    {/* Sidebar */}
    <aside className="sidebar">
      <h2 className="logo">TestTrack Pro</h2>

      <nav className="sidebar-nav">
        <button
          className={isActive("/dashboard") ? "active" : ""}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <hr />

        <p className="nav-section">Test Case Management</p>

        <button
          className={isActive("/testcases") ? "active" : ""}
          onClick={() => navigate("/testcases")}
        >
          View Test Cases
        </button>

        <button
          className={isActive("/testcases/create") ? "active" : ""}
          onClick={() => navigate("/testcases/create")}
        >
          Create Test Case
        </button>

        <button
          className={isActive("/templates") ? "active" : ""}
          onClick={() => navigate("/templates")}
        >
          Templates
        </button>

        <button
          className={isActive("/import") ? "active" : ""}
          onClick={() => navigate("/import")}
        >
          Import Test Cases
        </button>

        <button
  className={isActive("/suites") ? "active" : ""}
  onClick={() => navigate("/suites")}
>
  Test Suites
</button>


        <hr />

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </button>
      </nav>
    </aside>

    {/* Main Content */}
    <main className="dashboard-content">

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

      {/* This renders child pages like ViewTestCase */}
      <Outlet />

    </main>
  </div>
);

}

export default TesterDashboard;
