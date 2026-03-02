import "./AdminDashboard.css";

function AdminControls() {

  return (
    <div className="admin-controls">

      <h2>Admin Control Panel</h2>

      <div className="controls-grid">

        <div className="control-card">
          <h3>Manage Users</h3>
          <p>Create, edit, deactivate accounts</p>
        </div>

        <div className="control-card">
          <h3>Manage Projects</h3>
          <p>Create and configure projects</p>
        </div>

        <div className="control-card">
          <h3>Manage Roles</h3>
          <p>Customize permissions</p>
        </div>

        <div className="control-card">
          <h3>Audit Logs</h3>
          <p>View system activity history</p>
        </div>

        <div className="control-card">
          <h3>System Settings</h3>
          <p>Configure global settings</p>
        </div>

        <div className="control-card">
          <h3>Backup Management</h3>
          <p>Trigger and manage backups</p>
        </div>

      </div>

    </div>
  );
}

export default AdminControls;