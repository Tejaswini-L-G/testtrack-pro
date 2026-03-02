import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./testrun.css";

function RunProgressDashboard() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [run, setRun] = useState(null);
  const [executions, setExecutions] = useState([]);
  

  useEffect(() => {

  fetch(`http://localhost:5000/api/testruns/${id}/executions`)
    .then(r => r.json())
    .then(setExecutions);

}, [id]);

  /* LOAD RUN */

  useEffect(() => {
    fetch(`http://localhost:5000/api/testruns/${id}`)
      .then(r => r.json())
      .then(setRun);
  }, [id]);

  /* LOAD EXECUTIONS */

  useEffect(() => {
    fetch(`http://localhost:5000/api/testruns/${id}/executions`)
      .then(r => r.json())
      .then(setExecutions);
  }, [id]);

  if (!run) return <p>Loading...</p>;

  const total = run.testCases?.length || 0;
  const completed = executions.filter(e => e.completedAt).length;

  const progress =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  /* Duration calculator */

  const getDuration = (start, end) => {

  if (!start) return "—";
  if (!end) return "In Progress";

  const diff = new Date(end) - new Date(start);

  const totalSeconds = Math.floor(diff / 1000);

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${hrs}h ${mins}m ${secs}s`;
};


  return (
    <div className="fullscreen-page">

      <div className="progress-container">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/admin/dashboard/testruns")
          }
        >
          ← Back
        </button>

        <div className="progress-header">
          <h2>{run.name}</h2>

          <p>
            {new Date(run.startDate).toLocaleDateString()}
            {" — "}
            {new Date(run.endDate).toLocaleDateString()}
          </p>
        </div>

        {/* PROGRESS BAR */}

        <div className="progress-section">

          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>

          <p>
            {completed} of {total} test cases completed
          </p>

        </div>


        <div className="progress-card">
  <h3>Execution Details</h3>

  {executions.length === 0 && (
    <p className="empty-text">No executions yet</p>
  )}

  {executions.map(exec => (

  <div className={`progress-item status-${exec.status}`}>
      <p>
        <strong>Test Case:</strong> {exec.testCaseId}
      </p>

      <p>
        <strong>Tester:</strong>{" "}
        <p><strong>Tester:</strong> {exec.testerName}</p>
      </p>

      <p>
        <strong>Status:</strong> {exec.status}
      </p>

      <p>
  <strong>Time Taken:</strong>{" "}
 {getDuration(exec.startedAt, exec.completedAt)}
</p>

      <p>
        <strong>Started:</strong>{" "}
        {new Date(exec.startedAt).toLocaleString()}
      </p>

      {exec.completedAt && (
        <p>
          <strong>Completed:</strong>{" "}
          {new Date(exec.completedAt).toLocaleString()}
        </p>
      )}

    </div>

  ))}

</div>


      </div>

    </div>
  );
}

export default RunProgressDashboard;