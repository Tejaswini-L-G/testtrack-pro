import { useEffect, useState } from "react";

function AdminAudit() {

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/audit")
      .then(r => r.json())
      .then(setLogs);
  }, []);

  return (
    <div>

      <h2>Audit Logs</h2>

      {logs.map(l => (
        <div key={l.id} className="admin-card">

          <p>{l.action}</p>
          <p>{new Date(l.createdAt).toLocaleString()}</p>

        </div>
      ))}

    </div>
  );
}

export default AdminAudit;