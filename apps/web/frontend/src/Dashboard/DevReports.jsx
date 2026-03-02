import { useEffect, useState } from "react";
import "./Developer.css";

function DevReports() {

  const [reports, setReports] = useState([]);

  useEffect(() => {

    fetch("http://localhost:5000/api/reports", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(r => r.json())
      .then(setReports)
      .catch(() => alert("Failed to load reports"));

  }, []);

  return (
    <div className="dev-page">

      <h2 className="dev-title">Test Execution Reports</h2>

      {reports.length === 0 && (
        <p className="empty-msg">No reports available</p>
      )}

      {reports.map(r => (

        <div key={r.id} className="dev-card">

          {/* HEADER */}
          <div className="dev-card-header">

            <h3>{r.name || "Test Run"}</h3>

            <span className={`badge ${r.status?.toLowerCase()}`}>
              {r.status}
            </span>

          </div>

          {/* DETAILS */}
          <div className="dev-grid">

            <div>
              <label>Start Date</label>
              <p>{new Date(r.startDate).toLocaleString()}</p>
            </div>

            <div>
              <label>End Date</label>
              <p>{new Date(r.endDate).toLocaleString()}</p>
            </div>

          </div>

          <div className="dev-section">
            <label>Description</label>
            <p>{r.description || "—"}</p>
          </div>

        </div>

      ))}

    </div>
  );
}

export default DevReports;