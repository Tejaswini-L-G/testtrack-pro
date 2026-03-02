import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminSettings() {

  const [systemStatus, setSystemStatus] = useState(null);
  const [config, setConfig] = useState({
    defaultSeverity: "",
    defaultPriority: "",
    emailEnabled: true,
    autoAssignBug: false,
    maxUploadSize: 10
  });

  const token = localStorage.getItem("token");

  /* ========= LOAD CONFIG ========= */

 useEffect(() => {

  if (!token) {
    alert("Session expired. Please login again.");
    return;
  }

  fetch("http://localhost:5000/api/admin/system-config", {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Unauthorized or failed request");
      }
      return res.json();
    })
    .then(data => {
      if (data && typeof data === "object") {
        setConfig(prev => ({
          ...prev,
          ...data
        }));
      }
    })
    .catch(() => alert("Failed to load system config"));

}, [token]);


useEffect(() => {
  fetch("http://localhost:5000/api/admin/system-status", {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(res => res.json())
    .then(setSystemStatus)
    .catch(() => console.log("Status unavailable"));
}, [token]);
  /* ========= HANDLE CHANGE ========= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setConfig(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  /* ========= SAVE CONFIG ========= */

 const saveConfig = async () => {

  if (!token) {
    alert("Session expired. Please login again.");
    return;
  }

  const res = await fetch("http://localhost:5000/api/admin/system-config", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(config)
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    alert(data.message || "Failed to update config");
    return;
  }

  alert("System configuration updated ✅");
};

  /* ========= UI ========= */

  return (




    
    <div className="admin-settings-page">

      <h2>System Configuration</h2>
      <p className="subtitle">Configure system-wide settings</p>


      {systemStatus && (
  <div className="system-status-card">

    <div className="status-row">
      <span>Server</span>
      <span className="status-badge green">
        {systemStatus.status}
      </span>
    </div>

    <div className="status-row">
      <span>Database</span>
      <span className="status-badge green">
        {systemStatus.database}
      </span>
    </div>

    <div className="status-row">
      <span>Uptime</span>
      <span>{systemStatus.uptime}</span>
    </div>

    <div className="status-row">
      <span>Total Users</span>
      <span>{systemStatus.users}</span>
    </div>

    <div className="status-row">
      <span>Total Bugs</span>
      <span>{systemStatus.bugs}</span>
    </div>

  </div>
)}

      <div className="settings-card">

        <label>
          Default Bug Severity
          <select
            name="defaultSeverity"
            value={config.defaultSeverity}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </label>

        <label>
          Default Test Priority
          <select
            name="defaultPriority"
            value={config.defaultPriority}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="P1">High</option>
            <option value="P2">Medium</option>
            <option value="P3">Low</option>
          </select>
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="emailEnabled"
            checked={config.emailEnabled}
            onChange={handleChange}
          />
          Enable Email Notifications
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="autoAssignBug"
            checked={config.autoAssignBug}
            onChange={handleChange}
          />
          Enable Auto Assign Bug
        </label>

        <label>
          Max Upload Size (MB)
          <input
            type="number"
            name="maxUploadSize"
            value={config.maxUploadSize}
            onChange={handleChange}
          />
        </label>

        <button className="save-settings-btn" onClick={saveConfig}>
          Save Settings
        </button>

      </div>

    </div>
  );
}

export default AdminSettings;