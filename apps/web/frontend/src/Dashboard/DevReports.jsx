import { useEffect, useState } from "react";

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
    <div>

      <h2>Test Execution Reports</h2>

      {reports.length === 0 && <p>No reports available</p>}

      {reports.map(r => (

        <div key={r.id} className="report-card">

          <h3>{r.name || "Test Run"}</h3>

          <p><strong>Status:</strong> {r.status}</p>

          <p>
            <strong>Duration:</strong>{" "}
            {new Date(r.startDate).toLocaleString()}
            {" — "}
            {new Date(r.endDate).toLocaleString()}
          </p>

        </div>

      ))}

    </div>
  );
}

export default DevReports;