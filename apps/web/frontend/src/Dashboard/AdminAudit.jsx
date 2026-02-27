import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminAudit() {

  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const token = localStorage.getItem("token");

  const loadLogs = async () => {

    const res = await fetch(
      "http://localhost:5000/api/admin/audit",
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    const data = await res.json();
    setLogs(data);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  /* ===== FILTERED DATA ===== */

  const filteredLogs = logs.filter(log => {

    const matchesSearch =
      log.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      log.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase());

    const matchesAction =
      actionFilter === "All" || log.action === actionFilter;

    const matchesDate =
      !dateFilter ||
      new Date(log.createdAt).toDateString() ===
      new Date(dateFilter).toDateString();

    return matchesSearch && matchesAction && matchesDate;
  });

  /* ===== EXPORT CSV ===== */

  const exportCSV = () => {

    const rows = filteredLogs.map(l => ({
      User: l.user?.name,
      Email: l.user?.email,
      Action: l.action,
      Details: l.details,
      Date: new Date(l.createdAt).toLocaleString()
    }));

    const csv =
      "User,Email,Action,Details,Date\n" +
      rows.map(r =>
        `${r.User},${r.Email},${r.Action},${r.Details},${r.Date}`
      ).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "audit_logs.csv";
    link.click();
  };

  return (
    <div className="admin-audit-page">

      <h2>Audit Logs</h2>

      {/* ===== FILTER BAR ===== */}

      <div className="audit-filters">

        <input
          placeholder="Search user, email, action..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
        >
          <option value="All">All Actions</option>
          <option>Create Project</option>
          <option>Delete Project</option>
          <option>Deactivate User</option>
          <option>Activate User</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
        />

        <button
          className="export-btn"
          onClick={exportCSV}
        >
          Export CSV
        </button>

      </div>

      {/* ===== TABLE ===== */}

      <div className="audit-table-wrapper">

        <table className="audit-table">

          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Action</th>
              <th>Details</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id}>
                  <td>{log.user?.name}</td>
                  <td>{log.user?.email}</td>
                  <td className="action-cell">
                    {log.action}
                  </td>
                  <td>{log.details}</td>
                  <td>
                    {new Date(log.createdAt)
                      .toLocaleString()}
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

export default AdminAudit;