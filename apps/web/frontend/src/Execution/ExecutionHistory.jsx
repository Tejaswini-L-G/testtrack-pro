import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./execution.css";

function ExecutionHistory() {

  const { testCaseId } = useParams();
  const navigate = useNavigate();

  const [executions, setExecutions] = useState([]);

  useEffect(() => {

    fetch(
      `http://localhost:5000/api/executions/history/${testCaseId}`
    )
      .then(r => r.json())
      .then(setExecutions);

  }, [testCaseId]);

  return (
    <div className="execution-history">

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h2>Execution History — {testCaseId}</h2>

      {executions.length === 0 && (
        <p>No executions yet</p>
      )}

      {executions.map((exec, index) => {

        // ⭐ Get previous execution (older one)
        const prevExec = executions[index + 1];

        return (
          <div key={exec.id} className="history-card">

            <div className="history-header">

              <span className={`status ${exec.status.toLowerCase()}`}>
                {exec.status}
              </span>

              <span>
                {new Date(exec.startedAt).toLocaleString()}
              </span>

            </div>

            <p>
              <strong>Completed:</strong>{" "}
              {exec.completedAt
                ? new Date(exec.completedAt).toLocaleString()
                : "In Progress"}
            </p>

            <div className="history-actions">

              {/* RE-EXECUTE */}
              <button
                onClick={() =>
                  navigate(
                    `/dashboard/execution/${testCaseId}?runId=${exec.testRunId}`
                  )
                }
              >
                Re-Execute
              </button>

              {/* ⭐ COMPARE WITH PREVIOUS */}
              {prevExec && (
                <button
                  className="compare-btn"
                  onClick={() =>
                    navigate(
                      `/dashboard/compare?prev=${prevExec.id}&current=${exec.id}`
                    )
                  }
                >
                  Compare with Previous
                </button>
              )}

            </div>

          </div>
        );
      })}

    </div>
  );
}

export default ExecutionHistory;