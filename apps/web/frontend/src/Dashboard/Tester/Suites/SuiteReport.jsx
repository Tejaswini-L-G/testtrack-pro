import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Suites.css";
import { useNavigate } from "react-router-dom";

function SuiteReport() {
    const navigate = useNavigate();

  const { suiteId } = useParams();

  const [report, setReport] = useState({
    executions: [],
    total: 0,
    passed: 0,
    failed: 0,
    blocked: 0,
    skipped: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch(`http://localhost:5000/api/suites/${suiteId}/report`)
      .then(r => r.json())
      .then(data => {
        setReport({
          executions: data.executions || [],
          total: data.total || 0,
          passed: data.passed || 0,
          failed: data.failed || 0,
          blocked: data.blocked || 0,
          skipped: data.skipped || 0
        });
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to get report");
        setLoading(false);
      });

  }, [suiteId]);

  const executions = report.executions || [];

  const getDuration = (start, end) => {
    if (!start || !end) return "—";

    const diff = new Date(end) - new Date(start);
    const sec = Math.floor(diff / 1000);

    const m = Math.floor(sec / 60);
    const s = sec % 60;

    return `${m}m ${s}s`;
  };

  // ================= EXPORT CSV =================

  const exportCSV = () => {

    if (executions.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "TestCaseId",
      "Status",
      "Tester",
      "Started",
      "Completed",
      "Duration"
    ];

    const rows = executions.map(e => [
      e.testCaseId,
      e.status,
      e.executedBy?.name || "Unknown",
      new Date(e.startedAt).toLocaleString(),
      e.completedAt
        ? new Date(e.completedAt).toLocaleString()
        : "In Progress",
      getDuration(e.startedAt, e.completedAt)
    ]);

    const csv =
      [headers, ...rows]
        .map(r => r.join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "suite-report.csv";
    link.click();
  };

  // ================= EXPORT JSON =================

  const exportJSON = () => {

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      { type: "application/json" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "suite-report.json";
    link.click();
  };

  // ================= PRINT / PDF =================

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading report...</h2>;
  }

  return (
    <div className="suite-report-page">

        <button
  className="back-btn"
  onClick={() => navigate(-1)}
>
  ← Back
</button>

      <h2>Suite Execution Report</h2>

      {/* EXPORT BUTTONS */}

      <div className="report-actions">

        <button onClick={exportCSV} className="export-btn">
          Export CSV
        </button>

        <button onClick={exportJSON} className="export-btn">
          Export JSON
        </button>

        <button onClick={printReport} className="export-btn">
          Print / PDF
        </button>

      </div>

      {/* SUMMARY */}

      <div className="report-summary">

        <div className="summary-card total">
          Total: {report.total}
        </div>

        <div className="summary-card passed">
          Passed: {report.passed}
        </div>

        <div className="summary-card failed">
          Failed: {report.failed}
        </div>

        <div className="summary-card blocked">
          Blocked: {report.blocked}
        </div>

        <div className="summary-card skipped">
          Skipped: {report.skipped}
        </div>

      </div>

      {/* EXECUTION LIST */}

      {executions.length === 0 && (
        <p>No executions found</p>
      )}

      {executions.map(exec => (

        <div key={exec.id} className="report-card">

          <div className="report-header">

            <h3>{exec.testCaseId}</h3>

            <span className={`status ${exec.status?.toLowerCase()}`}>
              {exec.status}
            </span>

          </div>

          <p>
            <strong>Tester:</strong>{" "}
            {exec.executedBy?.name || "Unknown"}
          </p>

          <p>
            <strong>Started:</strong>{" "}
            {new Date(exec.startedAt).toLocaleString()}
          </p>

          <p>
            <strong>Completed:</strong>{" "}
            {exec.completedAt
              ? new Date(exec.completedAt).toLocaleString()
              : "In Progress"}
          </p>

          <p>
            <strong>Time Taken:</strong>{" "}
            {getDuration(exec.startedAt, exec.completedAt)}
          </p>

        </div>

      ))}

    </div>
  );
}

export default SuiteReport;