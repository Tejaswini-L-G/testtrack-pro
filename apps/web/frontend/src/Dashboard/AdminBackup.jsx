import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminBackup() {

  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");
const [lastBackupTime, setLastBackupTime] = useState(null);
const [archivedBackups, setArchivedBackups] = useState([]);

 const loadBackups = async () => {

  // Active backups
  const activeRes = await fetch("http://localhost:5000/api/admin/backups", {
    headers: { Authorization: "Bearer " + token }
  });

  const activeData = await activeRes.json();
  setBackups(activeData);

  if (activeData.length > 0) {
    const latest = activeData.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
    setLastBackupTime(latest.createdAt);
  }

  // Archived backups
  const archivedRes = await fetch("http://localhost:5000/api/admin/backups/archived", {
    headers: { Authorization: "Bearer " + token }
  });

  const archivedData = await archivedRes.json();
  setArchivedBackups(archivedData);
};
  useEffect(() => {
    loadBackups();
  }, []);

  const triggerBackup = async () => {

  if (loading) return; // prevent spam

  setLoading(true);
  setMessage("");

  const res = await fetch("http://localhost:5000/api/admin/backup", {
    method: "POST",
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();

  if (!res.ok) {
    setMessage(data.message || "Backup failed ❌");
  } else {
    setMessage("Backup completed successfully ✅");
  }

  await loadBackups();
  setLoading(false);
};


const downloadBackup = async (name) => {

  const res = await fetch(
    `http://localhost:5000/api/admin/backups/download/${name}`,
    {
      headers: {
        Authorization: "Bearer " + token
      }
    }
  );

  if (!res.ok) {
    setMessage("Download failed ❌");
    return;
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
};


  const deleteBackup = async (name) => {

  const confirmDelete = window.confirm("Delete this backup?");
  if (!confirmDelete) return;

  const res = await fetch(
    `http://localhost:5000/api/admin/backups/${name}`,
    {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    }
  );

  const data = await res.json();

  if (!res.ok) {
    setMessage(data.message || "Delete failed ❌");
  } else {
    setMessage("Backup deleted successfully 🗑️");
  }

  loadBackups();
};

const restoreBackup = async (name) => {

  const confirmRestore = window.confirm(
    "⚠ This will overwrite the current database.\n\nAre you sure?"
  );

  if (!confirmRestore) return;

  setMessage("Restoring database... ⏳");

  const res = await fetch(
    `http://localhost:5000/api/admin/backups/restore/${name}`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
      }
    }
  );

  const data = await res.json();

  if (!res.ok) {
    setMessage(data.message || "Restore failed ❌");
  } else {
    setMessage("Database restored successfully ✅");
  }
};

const restoreArchivedFile = async (name) => {

  const confirmRestore = window.confirm("Restore this archived backup?");
  if (!confirmRestore) return;

  const res = await fetch(
    `http://localhost:5000/api/admin/backups/restore-file/${name}`,
    {
      method: "POST",
      headers: { Authorization: "Bearer " + token }
    }
  );

  const data = await res.json();

  if (!res.ok) {
    setMessage(data.message || "Restore failed ❌");
  } else {
    setMessage("Backup restored to active list ✅");
  }

  loadBackups();
};

const permanentlyDelete = async (name) => {

  const confirmDelete = window.confirm(
    "⚠ This will permanently delete the backup.\n\nAre you sure?"
  );
  if (!confirmDelete) return;

  const res = await fetch(
    `http://localhost:5000/api/admin/backups/permanent/${name}`,
    {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    }
  );

  const data = await res.json();

  if (!res.ok) {
    setMessage(data.message || "Delete failed ❌");
  } else {
    setMessage("Backup permanently deleted 🗑️");
  }

  loadBackups();
};

  return (
  <div className="admin-backup-page">

    <h2>Backup Management</h2>

    {/* ===== ACTION BAR ===== */}
    <div className="backup-header">
      <button onClick={triggerBackup} className="run-backup-btn">
        {loading ? "Running..." : "Run Backup"}
      </button>

      <div className="backup-stats">
        <div>
          <strong>Total Active:</strong> {backups.length}
        </div>
        <div>
          <strong>Last Backup:</strong>{" "}
          {lastBackupTime
            ? new Date(lastBackupTime).toLocaleString()
            : "No backups yet"}
        </div>
      </div>
    </div>

    {message && (
      <div className="backup-status">
        {message}
      </div>
    )}

    {/* ================= ACTIVE BACKUPS ================= */}
    <div className="backup-section">

      <h3>Active Backups</h3>

      <table className="backup-table">
        <thead>
          <tr>
            <th>File</th>
            <th>Size</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {backups.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty-state">
                No active backups
              </td>
            </tr>
          ) : (
            backups.map(b => (
              <tr key={b.name}>
                <td>{b.name}</td>
                <td>{b.size}</td>
                <td>{new Date(b.createdAt).toLocaleString()}</td>
                <td className="action-buttons">

                  <button
                    className="download-btn"
                    onClick={() => downloadBackup(b.name)}
                  >
                    Download
                  </button>

                  <button
                    className="restore-btn"
                    onClick={() => restoreBackup(b.name)}
                  >
                    Restore DB
                  </button>

                  <button
                    className="archive-btn"
                    onClick={() => deleteBackup(b.name)}
                  >
                    Archive
                  </button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>

    {/* ================= ARCHIVED BACKUPS ================= */}
    <div className="backup-section archived-section">

      <h3>Archived Backups</h3>

      <table className="backup-table">
        <thead>
          <tr>
            <th>File</th>
            <th>Size</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {archivedBackups?.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty-state">
                No archived backups
              </td>
            </tr>
          ) : (
            archivedBackups?.map(b => (
              <tr key={b.name}>
                <td>{b.name}</td>
                <td>{b.size}</td>
                <td>{new Date(b.createdAt).toLocaleString()}</td>
                <td className="action-buttons">

                  <button
                    className="restore-file-btn"
                    onClick={() => restoreArchivedFile(b.name)}
                  >
                    Restore File
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => permanentlyDelete(b.name)}
                  >
                    Delete Permanently
                  </button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>

  </div>
);
}

export default AdminBackup;