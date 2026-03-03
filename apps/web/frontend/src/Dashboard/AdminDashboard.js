import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./AdminDashboard.css";
import { useState } from "react";
import { useEffect } from "react";
import DashboardWidgets from "../Reports/DashboardWidgets";
import ProjectSelector from "../Projects/ProjectSelector";
import AdminNavbar from "../Dashboard/AdminNavbar";
import ProfileMenu from "../Dashboard/Profile";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAdminControls, setShowAdminControls] = useState(false);
const [showProfile, setShowProfile] = useState(false);
const [userInfo, setUserInfo] = useState(null);
const [user, setUser] = useState(null);
const [searchResults, setSearchResults] = useState(null);
const [showReportsMenu, setShowReportsMenu] = useState(false);
const [showTestManagementMenu, setShowTestManagementMenu] = useState(false);



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
  <div className="topbar">
  <AdminNavbar onSearchResults={setSearchResults} />
  <ProfileMenu />
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

    <button onClick={() => navigate("/home")}>
      Home
    </button>

    <button onClick={() => navigate("/admin/dashboard")}>
      Dashboard
    </button>

    
   <hr />

    {/* ⭐ ONE ADMIN CONTROLS BUTTON */}
   <button
  className="nav-main-btn"
  onClick={() => setShowAdminControls(prev => !prev)}
>
  ⚙ Admin Controls
  <span>{showAdminControls ? "▲" : "▼"}</span>
</button>


{showAdminControls && (
  <div className="submenu-panel">

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

    <button
  onClick={() =>
    navigate("/admin/dashboard/reports/cross-project")
  }
>
  Cross Project Report
</button>

<button
  onClick={() => navigate("/admin/dashboard/custom-fields")}
>
  Project Custom Fields
</button>

<button onClick={() => navigate("/admin/dashboard/workflows")}>
   Project Workflow 
</button>

<button onClick={() => navigate("/admin/dashboard/modules")}>
  Project Modules
</button>

<button onClick={() => navigate("/admin/dashboard/environments")}>
  Project Environments
</button>

<button onClick={() => navigate("/admin/dashboard/milestones")}>
  Project Milestones
</button>

  </div>
)}
    
{/* ================= REPORTS ================= */}

   <hr />
<button
  className="nav-main-btn"
  onClick={() => setShowReportsMenu(!showReportsMenu)}
>
  📊 Reports & Analytics
  <span>{showReportsMenu ? "▲" : "▼"}</span>
</button>

{showReportsMenu && (
  <div className="submenu-panel">

    <button onClick={() => navigate("/admin/dashboard/reports/execution")}>
      Execution Report
    </button>

    <button onClick={() => navigate("/admin/dashboard/reports/bugs")}>
      Bug Report
    </button>

    <button onClick={() => navigate("/admin/dashboard/reports/developer-performance")}>
      Developer Performance
    </button>

    <button onClick={() => navigate("/admin/dashboard/reports/tester-performance")}>
      Tester Performance
    </button>

  </div>
)}

    {/* ⭐ PROFILE BUTTON */}
   

    

   <hr />

<button
  className="nav-main-btn"
  onClick={() => setShowTestManagementMenu(!showTestManagementMenu)}
>
  🗂 Test Management
  <span>{showTestManagementMenu ? "▲" : "▼"}</span>
</button>

{showTestManagementMenu && (
  <div className="submenu-panel">

    <button onClick={() => navigate("/admin/dashboard/testcases")}>
      View Test Cases
    </button>

    <button onClick={() => navigate("/admin/dashboard/testruns/create")}>
      Create Test Run
    </button>

    <button onClick={() => navigate("/admin/dashboard/testruns")}>
      View Test Runs
    </button>

    <button onClick={() => navigate("/admin/dashboard/bugs")}>
      View Bugs
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