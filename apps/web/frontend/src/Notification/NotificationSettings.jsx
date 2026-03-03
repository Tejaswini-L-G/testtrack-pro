import { useEffect, useState } from "react";
import "./notification.css";

function NotificationSettings({ onClose }) {

  const token = localStorage.getItem("token");
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/notifications/preferences", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(setPreferences);
  }, []);

  const toggle = (field) => {
    setPreferences(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {

    const res = await fetch(
      "http://localhost:5000/api/notifications/preferences",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(preferences)
      }
    );

    if (res.ok) {
      onClose();   // ✅ FIXED
    } else {
      alert("Failed to update ❌");
    }
  };

  if (!preferences) return null;

  return (
    <>
  <div className="settings-overlay" onClick={onClose} />

  <div className="settings-modal">

    <div className="settings-header">
      <h2>Notification Preferences</h2>
    </div>

    {/* 🔥 THIS WRAPPER WAS MISSING */}
    <div className="settings-content">

      {/* ================= BUG ================= */}
      <div className="settings-group">
        <h4>Bug Notifications</h4>

        <Toggle
          label="Bug Assigned (Email)"
          checked={preferences.bugAssignedEmail}
          onChange={() => toggle("bugAssignedEmail")}
        />

        <Toggle
          label="Bug Assigned (In-App)"
          checked={preferences.bugAssignedInApp}
          onChange={() => toggle("bugAssignedInApp")}
        />

        <Toggle
          label="Status Changed (Email)"
          checked={preferences.statusChangedEmail}
          onChange={() => toggle("statusChangedEmail")}
        />

        <Toggle
          label="Status Changed (In-App)"
          checked={preferences.statusChangedInApp}
          onChange={() => toggle("statusChangedInApp")}
        />
      </div>

      {/* ================= COMMENTS ================= */}
      <div className="settings-group">
        <h4>Comment Notifications</h4>

        <Toggle
          label="Comments (Email)"
          checked={preferences.commentEmail}
          onChange={() => toggle("commentEmail")}
        />

        <Toggle
          label="Comments (In-App)"
          checked={preferences.commentInApp}
          onChange={() => toggle("commentInApp")}
        />
      </div>

      {/* ================= TEST RUN ================= */}
      <div className="settings-group">
        <h4>Test Run Notifications</h4>

        <Toggle
          label="Test Assigned (Email)"
          checked={preferences.testAssignedEmail}
          onChange={() => toggle("testAssignedEmail")}
        />

        <Toggle
          label="Test Assigned (In-App)"
          checked={preferences.testAssignedInApp}
          onChange={() => toggle("testAssignedInApp")}
        />
      </div>

      {/* ================= QUIET HOURS ================= */}
      <div className="settings-group">
        <h4>Quiet Hours</h4>

        <div className="quiet-row">
          <input
            type="time"
            value={preferences.quietHoursStart || ""}
            onChange={(e) =>
              setPreferences(prev => ({
                ...prev,
                quietHoursStart: e.target.value
              }))
            }
          />

          <span>to</span>

          <input
            type="time"
            value={preferences.quietHoursEnd || ""}
            onChange={(e) =>
              setPreferences(prev => ({
                ...prev,
                quietHoursEnd: e.target.value
              }))
            }
          />
        </div>
      </div>

    </div> {/* 🔥 END settings-content */}

    {/* FOOTER */}
    <div className="settings-actions">
      <button className="cancel-btn" onClick={onClose}>
        Cancel
      </button>

      <button className="save-btn" onClick={handleSave}>
        Save
      </button>
    </div>

  </div>
</>
  );
}

/* Toggle Component */
function Toggle({ label, checked, onChange }) {
  return (
    <div className="pref-row">
      <span>{label}</span>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider"></span>
      </label>
    </div>
  );
}

export default NotificationSettings;