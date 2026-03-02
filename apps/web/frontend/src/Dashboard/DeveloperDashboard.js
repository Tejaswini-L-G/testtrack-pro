import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./Dashboard.css";
import ProfileMenu from "../Dashboard/Profile";
import DashboardWidgets from "../Reports/DashboardWidgets";
import ProjectSelector from "../Projects/ProjectSelector";


function DeveloperDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    fixed: 0,
    retest: 0
  });

  const [projectName, setProjectName] = useState("");
const [projectId, setProjectId] = useState(
  localStorage.getItem("projectId")
);

useEffect(() => {

  const loadProjectName = async () => {

    if (!projectId) {
      setProjectName("");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      if (!res.ok) {
        setProjectName("");
        return;
      }

      const data = await res.json();
      setProjectName(data.name);

    } catch (err) {
      console.error("Failed to load project name");
      setProjectName("");
    }
  };

  loadProjectName();

}, [projectId]);
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


useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-layout">

      {/* 🔵 TOPBAR */}
<div className="topbar">
  <ProfileMenu />
</div>

      {/* 🔵 SIDEBAR */}
      <aside className="sidebar">

        <h2 className="logo">TestTrack Pro</h2>

        <div className="project-display">
    Project: <strong>{projectName || "Not Selected"}</strong>
  </div>

  <ProjectSelector />


        <nav className="sidebar-nav">

          <button
            className={isActive("/developer/home") ? "active" : ""}
            onClick={() => navigate("/dashboard/home")}
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

         <div className="reports-panel">

  <h4>Reports & Analytics</h4>

  <div className="reports-buttons">

    <button
      onClick={() => navigate("/developer/reports/execution")}
    >
      📊 Execution Report
    </button>

    <button
      onClick={() => navigate("/developer/reports/bugs")}
    >
      🐞 Bug Report
    </button>

    <button
      onClick={() => navigate("/dashboard/reports/developer-performance")}
    >
      👨‍💻 Developer Performance
    </button>

    <button
      onClick={() => navigate("/developer/reports/tester-performance")}
    >
      🧪 Tester Performance
    </button>

  </div>

</div>

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
<DashboardWidgets user={user} />
            
          </>
        )}

        {/* CHILD ROUTES */}
        <Outlet />

      </main>



    </div>
  );
}

export default DeveloperDashboard;