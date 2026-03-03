import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./Dashboard.css";
import ProfileMenu from "../Dashboard/Profile";
import DashboardWidgets from "../Reports/DashboardWidgets";
import ProjectSelector from "../Projects/ProjectSelector";
import Navbar from "../Dashboard/Navbar";


function TesterDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showTestCaseMenu, setShowTestCaseMenu] = useState(false);
const [showReportsMenu, setShowReportsMenu] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    approved: 0,
  });

  const [projectName, setProjectName] = useState("");
const [projectId, setProjectId] = useState(
  localStorage.getItem("projectId")
);

useEffect(() => {

  const handleStorageChange = () => {
    setProjectId(localStorage.getItem("projectId"));
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };

}, []);

useEffect(() => {

  if (!projectId) {
    setProjectName("");
    return;
  }

  fetch(`http://localhost:5000/api/projects/${projectId}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed");
      return res.json();
    })
    .then(data => setProjectName(data.name))
    .catch(() => setProjectName(""));

}, [projectId]);

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

  // ===== LOAD USER =====
// ===== LOAD USER FROM LOCAL STORAGE =====
useEffect(() => {

  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  } else {
    console.error("User not found in localStorage");
  }

}, []);
// ===== INIT DEFAULT WIDGETS =====


  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-layout">
        

    {/* 🔵 TOPBAR */}
<div className="topbar">
  <Navbar />
  <ProfileMenu />
</div>

      {/* SIDEBAR */}
      <aside className="sidebar">

        <h2 className="logo">TestTrack Pro</h2>

       <div className="project-display">
    Project: <strong>{projectName || "Not Selected"}</strong>
  </div>

  <ProjectSelector />


        <nav className="sidebar-nav">

          <button
            className={isActive("/dashboard/home") ? "active" : ""}
            onClick={() => navigate("/home")}
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

{/* ================= TEST CASE MANAGEMENT ================= */}

<button
  className="nav-main-btn"
  onClick={() => setShowTestCaseMenu(!showTestCaseMenu)}
>
  📁 Test Case Management
  <span>{showTestCaseMenu ? "▲" : "▼"}</span>
</button>

{showTestCaseMenu && (
  <div className="submenu-panel">
    <button onClick={() => navigate("/dashboard/testcases")}>
      View Test Cases
    </button>

    <button onClick={() => navigate("/dashboard/testcases/create")}>
      Create Test Case
    </button>

    <button onClick={() => navigate("/dashboard/templates")}>
      Templates
    </button>

    <button onClick={() => navigate("/dashboard/import")}>
      Import Test Cases
    </button>

    <button onClick={() => navigate("/dashboard/suites")}>
      Test Suites
    </button>

    <button onClick={() => navigate("/dashboard/execution")}>
      Execute Test Cases
    </button>

    <button onClick={() => navigate("/dashboard/my-runs")}>
      My Test Runs
    </button>

    <button onClick={() => navigate("/dashboard/my-executions")}>
      My Executions
    </button>

    <button onClick={() => navigate("/dashboard/bugs")}>
      My Bugs
    </button>

    <button onClick={() => navigate("/dashboard/milestones")}>
      Milestones
    </button>
  </div>
)}

<hr />

{/* ================= REPORTS ================= */}

<button
  className="nav-main-btn"
  onClick={() => setShowReportsMenu(!showReportsMenu)}
>
  📊 Reports & Analytics
  <span>{showReportsMenu ? "▲" : "▼"}</span>
</button>

{showReportsMenu && (
  <div className="submenu-panel">
    <button onClick={() => navigate("/dashboard/reports/execution")}>
      Execution Report
    </button>

    <button onClick={() => navigate("/dashboard/reports/bugs")}>
      Bug Report
    </button>

    <button onClick={() => navigate("/dashboard/reports/developer-performance")}>
      Developer Performance
    </button>

    <button onClick={() => navigate("/dashboard/reports/tester-performance")}>
      Tester Performance
    </button>
  </div>
)}

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

    {/* ⭐ DASHBOARD WIDGETS */}
    <DashboardWidgets user={user} />

  </>
)}

        {/* CHILD PAGES RENDER HERE */}
        <Outlet />

      </main>
    </div>
  );
}

export default TesterDashboard;