import { useEffect, useState } from "react";
import "./Report.css";

export default function ExecutionReport() {

  const [reports, setReports] = useState(null);
  const projectId = localStorage.getItem("projectId");

  

  useEffect(() => {
    fetch(`http://localhost:5000/api/reports/execution-by-run?projectId=${projectId}`)
      .then(res => res.json())
  .then(data => {
    if (Array.isArray(data)) {
      setReports(data);
    } else {
      setReports([]);
    }
  })
  .catch(() => setReports([]));
  }, []);

  if (reports === null)
    return <div className="report-container">Loading reports...</div>;

  if (reports.length === 0)
    return <div className="report-container">No reports available</div>;

  return (
    <div className="report-container">

      <h1>Execution Reports</h1>

      {reports.map(run => (

        <div key={run.testRunId} className="run-report">

          <h2>{run.testRunName}</h2>

          <p>
            Period:{" "}
            {new Date(run.period.start).toLocaleDateString()}
            {" — "}
            {new Date(run.period.end).toLocaleDateString()}
          </p>

          {/* ===== EXPORT ===== */}

          <div className="export-buttons">

            <button onClick={() =>
              window.open(`http://localhost:5000/api/reports/execution/${run.testRunId}/export/pdf`)
            }>
              Export PDF
            </button>

            <button onClick={() =>
              window.open(`http://localhost:5000/api/reports/execution/${run.testRunId}/export/csv`)
            }>
              Export CSV
            </button>

            <button onClick={() =>
              window.open(`http://localhost:5000/api/reports/execution/${run.testRunId}/export/excel`)
            }>
              Export Excel
            </button>

          </div>

          {/* ===== SUMMARY ===== */}

          <div className="report-summary">

            <div className="report-card">Total: {run.totalExecuted}</div>
            <div className="report-card pass">Passed: {run.statusBreakdown?.passed}</div>
            <div className="report-card fail">Failed: {run.statusBreakdown?.failed}</div>
            <div className="report-card blocked">Blocked: {run.statusBreakdown?.blocked}</div>
            <div className="report-card skipped">Skipped: {run.statusBreakdown?.skipped}</div>
            <div className="report-card rate">Pass Rate: {run.statusBreakdown?.passRate}%</div>

          </div>

          {/* ===== BY TESTER ===== */}

          <div className="report-section">
            <h3>Execution by Tester</h3>

            <ul>
              {Object.entries(run.executionByTester || {}).map(([t, v]) => (
                <li key={t}>{t} — {v}</li>
              ))}
            </ul>
          </div>

          {/* ===== BY MODULE ===== */}

          <div className="report-section">
            <h3>Execution by Module</h3>

            <ul>
              {Object.entries(run.executionByModule || {}).map(([m, v]) => (
                <li key={m}>{m} — {v}</li>
              ))}
            </ul>
          </div>

          {/* ===== TIMELINE ===== */}

          <div className="report-section">
            <h3>Execution Timeline</h3>

            <ul>
              {Object.entries(run.executionTimeline || {}).map(([d, v]) => (
                <li key={d}>{d} — {v}</li>
              ))}
            </ul>
          </div>

          {/* ===== TOP FAILED MODULES ===== */}

          {(run.topFailedModules || []).length > 0 && (
            <div className="report-section">
              <h3>Top Failed Modules</h3>

              <ol>
                {run.topFailedModules.map((m, i) => (
                  <li key={i}>{m.module} — {m.failures}</li>
                ))}
              </ol>
            </div>
          )}

          {/* ===== FAILED TEST CASES ===== */}

          {(run.failedTestCases || []).length > 0 && (
            <div className="report-section">
              <h3>Failed Test Cases</h3>

              <table className="report-table">
                <thead>
                  <tr>
                    <th>Test Case</th>
                    <th>Title</th>
                    <th>Module</th>
                    <th>Tester</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {run.failedTestCases.map((f, i) => (
                    <tr key={i}>
                      <td>{f.testCaseId}</td>
                      <td>{f.title}</td>
                      <td>{f.module}</td>
                      <td>{f.tester}</td>
                      <td>{new Date(f.executedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      ))}

    </div>
  );
}