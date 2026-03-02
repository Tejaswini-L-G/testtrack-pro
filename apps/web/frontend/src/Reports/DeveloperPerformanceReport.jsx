import { useEffect, useState } from "react";
import "./Report.css";

export default function DeveloperPerformanceReport() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/reports/developer-performance")
      .then(res => res.json())
      .then(setData)
      .catch(() => setData([]));
  }, []);

  if (data === null)
    return <div className="report-container">Loading report...</div>;

  if (data.length === 0)
    return <div className="report-container">No data available</div>;

  return (
    <div className="report-container">

      <h1>Developer Performance Report</h1>

      {/* ================= EXPORT OPTIONS ================= */}

      <div className="export-buttons">

        <button
          onClick={() =>
            window.open(
              "http://localhost:5000/api/reports/developer-performance/export/pdf"
            )
          }
        >
          Export PDF
        </button>

        <button
          onClick={() =>
            window.open(
              "http://localhost:5000/api/reports/developer-performance/export/csv"
            )
          }
        >
          Export CSV
        </button>

        <button
          onClick={() =>
            window.open(
              "http://localhost:5000/api/reports/developer-performance/export/excel"
            )
          }
        >
          Export Excel
        </button>

      </div>

      {/* ================= DEVELOPER CARDS ================= */}

      {data.map((dev, i) => (

        <div key={i} className="dev-card">

          <h3>{dev.developer}</h3>

          <div className="dev-metrics">

            <div className="metric-box metric-assigned">
              Assigned
              <br />
              {dev.assigned}
            </div>

            <div className="metric-box metric-resolved">
              Resolved
              <br />
              {dev.resolved}
            </div>

            <div className="metric-box metric-avg">
              Avg Time
              <br />
              {dev.avgResolutionDays} d
            </div>

            <div className="metric-box metric-reopen">
              Reopen Rate
              <br />
              {dev.reopenRate}%
            </div>

            <div className="metric-box metric-quality">
              Fix Quality
              <br />
              {dev.fixQuality}%
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}