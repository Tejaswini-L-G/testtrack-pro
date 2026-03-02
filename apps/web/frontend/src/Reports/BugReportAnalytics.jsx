import { useEffect, useState } from "react";
import "./Report.css";

export default function BugReportAnalytics() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/reports/bugs")
      .then(res => res.json())
      .then(setData)
      .catch(() => setData({}));
  }, []);

  if (!data)
    return <div className="report-container">Loading bug report...</div>;

  return (
    <div className="report-container">

      <h1>Bug Report</h1>

      <div className="export-buttons">

  <button
    onClick={() =>
      window.open(
        "http://localhost:5000/api/reports/bugs/export/pdf"
      )
    }
  >
    Export PDF
  </button>

  <button
    onClick={() =>
      window.open(
        "http://localhost:5000/api/reports/bugs/export/csv"
      )
    }
  >
    Export CSV
  </button>

  <button
    onClick={() =>
      window.open(
        "http://localhost:5000/api/reports/bugs/export/excel"
      )
    }
  >
    Export Excel
  </button>

</div>

      {/* TOTAL */}
      <div className="report-card">
        Total Bugs: {data.totalBugs}
      </div>

      {/* BY STATUS */}
      <div className="report-section">
        <h3>Bugs by Status</h3>
        <ul>
          {Object.entries(data.bugsByStatus || {}).map(([k, v]) => (
            <li key={k}>{k} — {v}</li>
          ))}
        </ul>
      </div>

      {/* BY SEVERITY */}
      <div className="report-section">
        <h3>Bugs by Severity</h3>
        <ul>
          {Object.entries(data.bugsBySeverity || {}).map(([k, v]) => (
            <li key={k}>{k} — {v}</li>
          ))}
        </ul>
      </div>

      {/* BY PRIORITY */}
      <div className="report-section">
        <h3>Bugs by Priority</h3>
        <ul>
          {Object.entries(data.bugsByPriority || {}).map(([k, v]) => (
            <li key={k}>{k} — {v}</li>
          ))}
        </ul>
      </div>

      {/* BY DEVELOPER */}
      <div className="report-section">
        <h3>Bugs by Developer</h3>
        <ul>
          {Object.entries(data.bugsByDeveloper || {}).map(([k, v]) => (
            <li key={k}>{k} — {v}</li>
          ))}
        </ul>
      </div>

      {/* TREND */}
      <div className="report-section">
        <h3>Bug Trend Over Time</h3>
        <ul>
          {Object.entries(data.bugTrend || {}).map(([k, v]) => (
            <li key={k}>{k} — {v}</li>
          ))}
        </ul>
      </div>

      {/* AGING */}
      <div className="report-section">
        <h3>Bug Aging (Days Open)</h3>
        <ul>
          {(data.bugAging || []).map(b => (
            <li key={b.bugId}>
              {b.title} — {b.daysOpen} days
            </li>
          ))}
        </ul>
      </div>

      {/* RESOLUTION */}
      <div className="report-section">
        <h3>Resolution Metrics</h3>
        <p>
          Avg Resolution Time:{" "}
          {data.resolutionMetrics?.averageResolutionDays} days
        </p>
        <p>
          Resolved Bugs: {data.resolutionMetrics?.resolvedCount}
        </p>
      </div>

    </div>
  );
}