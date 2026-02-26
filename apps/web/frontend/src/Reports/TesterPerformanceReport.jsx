import { useEffect, useState } from "react";
import "./Report.css";

export default function TesterPerformanceReport() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/reports/tester-performance")
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

      <h1>Tester Performance Report</h1>

      {/* EXPORT OPTIONS */}

      <div className="export-buttons">

        <button
          onClick={() =>
            window.open(
              "http://localhost:5000/api/reports/tester-performance/export/pdf"
            )
          }
        >
          Export PDF
        </button>

        <button
          onClick={() =>
            window.open(
              "http://localhost:5000/api/reports/tester-performance/export/csv"
            )
          }
        >
          Export CSV
        </button>

        <button
          onClick={() =>
            window.open(
              "http://localhost:5000/api/reports/tester-performance/export/excel"
            )
          }
        >
          Export Excel
        </button>

      </div>

      {/* TESTER CARDS */}

      {data.map((t, i) => (

        <div key={i} className="dev-card">

          <h3>{t.tester}</h3>

          <div className="dev-metrics">

            <div className="metric-box metric-assigned">
              Executed
              <br />
              {t.executed}
            </div>

            <div className="metric-box metric-resolved">
              Bugs Found
              <br />
              {t.bugsReported}
            </div>

            <div className="metric-box metric-avg">
              Bug Rate
              <br />
              {t.bugDetectionRate}%
            </div>

            <div className="metric-box metric-reopen">
              Efficiency
              <br />
              {t.efficiency}%
            </div>

            <div className="metric-box metric-quality">
              Coverage
              <br />
              {t.coverage}%
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}