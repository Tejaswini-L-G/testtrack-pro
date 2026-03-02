import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./AdminDashboard.css";
import { useState } from "react";
import { useEffect } from "react";
import DashboardWidgets from "../Reports/DashboardWidgets";
import ProjectSelector from "../Projects/ProjectSelector";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAdminControls, setShowAdminControls] = useState(false);
const [showProfile, setShowProfile] = useState(false);
const [userInfo, setUserInfo] = useState(null);
const [user, setUser] = useState(null);



const token = localStorage.getItem("token");
const payload = token
  ? JSON.parse(atob(token.split(".")[1]))
  : null;



// ADD STATE
const [profileOpen, setProfileOpen] = useState(false);

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


// LOAD USER FROM API
useEffect(() => {
  const loadUser = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/users/me",
      {
        headers: { Authorization: "Bearer " + token }
      }
    );

    const data = await res.json();
    setUserInfo(data);
  };

  loadUser();
}, []);
  



useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">

     <div className="admin-topbar">

  {/* RIGHT SIDE CONTAINER */}
  <div className="topbar-right">

    {/* AVATAR */}
    <div
      className="profile-avatar"
      onClick={() => setProfileOpen(prev => !prev)}
    >
      {userInfo?.name?.charAt(0)?.toUpperCase() || "U"}
    </div>

    {/* DROPDOWN */}
    {profileOpen && (
      <div className="profile-menu">

        <div className="profile-header">
          <div className="avatar-large">
            {userInfo?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <h4>{userInfo?.name}</h4>
            <p>{userInfo?.email}</p>
          </div>
        </div>

        <div className="profile-role">
          {userInfo?.role}
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/dashboard/home");
          }}
        >
          Logout
        </button>

      </div>
    )}

  </div>

</div>



      {/* ===== LEFT SIDEBAR ===== */}
    <aside className="admin-sidebar">

  <h2 className="admin-logo">TestTrack Pro</h2>
  <div className="project-display">
    Project: <strong>{projectName || "Not Selected"}</strong>
  </div>

  <ProjectSelector />


  <nav className="admin-nav">

    <button onClick={() => navigate("/dashboard/home")}>
      Home
    </button>

    <button onClick={() => navigate("/admin/dashboard")}>
      Dashboard
    </button>

    {/* ⭐ ONE ADMIN CONTROLS BUTTON */}
   <button
  onClick={() =>
    setShowAdminControls(prev => !prev)
  }
>
  Admin Controls
</button>


{showAdminControls && (
  <div className="admin-controls-panel">

    <div className="admin-controls-title">
      Admin Management
    </div>

    <button onClick={() => navigate("/admin/dashboard/users")}>
      Manage Users
    </button>

    <button onClick={() => navigate("/admin/dashboard/projects")}>
      Manage Projects
    </button>

    <button onClick={() => navigate("/admin/dashboard/roles")}>
      Manage Roles
    </button>

    <button onClick={() => navigate("/admin/dashboard/audit")}>
      Audit Logs
    </button>

    <button onClick={() => navigate("/admin/dashboard/settings")}>
      System Settings
    </button>

    <button onClick={() => navigate("/admin/dashboard/backup")}>
      Backup Management
    </button>

  </div>
)}
    
<div className="reports-panel">

  <h4>Reports & Analytics</h4>

  <div className="reports-buttons">

    <button
      onClick={() =>navigate("/admin/dashboard/reports/execution")}
    >
      📊 Execution Report
    </button>

    <button
      onClick={() => navigate("/admin/dashboard/reports/bugs")}
    >
      🐞 Bug Report
    </button>

    <button
      onClick={() => navigate("/admin/dashboard/reports/developer-performance")}
    >
      👨‍💻 Developer Performance
    </button>

    <button
      onClick={() => navigate("/admin/dashboard/reports/tester-performance")}
    >
      🧪 Tester Performance
    </button>

  </div>

</div>
    {/* ⭐ PROFILE BUTTON */}
   

    <hr />

    <button className={isActive("/admin/testcases") ? "active" : ""} 
    onClick={() => navigate("/admin/dashboard/testcases")} > 
    View Test Cases </button>
     <button className={ isActive("/admin/dashboard/testruns/create") ? "active" : "" }
      onClick={() => navigate("/admin/dashboard/testruns/create") } > 
      Create Test Run </button> 
      <button className={ isActive("/admin/dashboard/testruns") ? "active" : "" }
       onClick={() => navigate("/admin/dashboard/testruns") } >
         View Test Runs </button> 
         <button onClick={() => navigate("/admin/dashboard/bugs")}>
      View Bugs
    </button>
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

             <DashboardWidgets user={user} />

          </>
        )}

        {/* Render child pages like AdminTestCases */}
        <Outlet />

      </main>

     
    </div>
     
  );
}

export default AdminDashboard;