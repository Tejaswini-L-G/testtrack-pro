import { useEffect, useState } from "react";
import "./execution.css";
import { useNavigate } from "react-router-dom";

function TesterExecutions() {

    const navigate = useNavigate();
  const [executions, setExecutions] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {

    
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const testerId = payload.id;

    fetch(`http://localhost:5000/api/executions/my/${testerId}`)
      .then(r => r.json())
      .then(setExecutions);

  }, []);

  const getDuration = (start, end) => {

    if (!start) return "—";
    if (!end) return "In Progress";

    const diff = new Date(end) - new Date(start);
    const sec = Math.floor(diff / 1000);

    const m = Math.floor(sec / 60);
    const s = sec % 60;

    return `${m}m ${s}s`;
  };

  const filteredExecutions = executions.filter(exec => {

    if (filter === "ALL") return true;

    if (filter === "INPROGRESS")
      return exec.status === "InProgress";

    return exec.status === filter;
  });

  return (
    <div className="execution-history">

      <h2>My Executions</h2>

      {/* FILTER BUTTONS */}

      <div className="filter-bar">

        <button
          className={filter === "ALL" ? "active" : ""}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>

        <button
          className={filter === "Passed" ? "active" : ""}
          onClick={() => setFilter("Passed")}
        >
          Passed
        </button>

        <button
          className={filter === "Failed" ? "active" : ""}
          onClick={() => setFilter("Failed")}
        >
          Failed
        </button>

        <button
          className={filter === "INPROGRESS" ? "active" : ""}
          onClick={() => setFilter("INPROGRESS")}
        >
          In Progress
        </button>

        <button
          className={filter === "Blocked" ? "active" : ""}
          onClick={() => setFilter("Blocked")}
        >
          Blocked
        </button>

        <button
          className={filter === "Skipped" ? "active" : ""}
          onClick={() => setFilter("Skipped")}
        >
          Skipped
        </button>

      </div>

      {/* EXECUTION LIST */}

      {filteredExecutions.length === 0 && (
        <p className="empty-text">No executions found</p>
      )}

      {filteredExecutions.map(exec => (

        <div key={exec.id} className="exec-card">

  <div className="exec-header">

    <h3>Test Case: {exec.testCaseId}</h3>

    <span className={`status ${exec.status.toLowerCase()}`}>
      {exec.status}
    </span>

  </div>

  <p>
    <strong>Run ID:</strong>{" "}
    {exec.testRunId || "Standalone"}
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

  {/* ⭐ RE-EXECUTE BUTTON */}

  {exec.status === "Failed" && (

    <button
      className="reexecute-btn"
      onClick={() =>
        navigate(
          `/dashboard/execution/${exec.testCaseId}?runId=${exec.testRunId}`
        )
      }
    >
      🔁 Re-Execute
    </button>

  )}

  {/* ⭐ VIEW HISTORY BUTTON */}

  <button
    className="history-btn"
    onClick={() =>
      navigate(
        `/dashboard/execution-history/${exec.testCaseId}`
      )
    }
  >
    📜 View History
  </button>

</div>

      ))}

    </div>
  );
}

export default TesterExecutions;