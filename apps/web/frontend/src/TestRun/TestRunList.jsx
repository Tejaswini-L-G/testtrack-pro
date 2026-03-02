import { useEffect, useState } from "react";
import "./testrun.css";
import { useNavigate } from "react-router-dom";

function TestRunList() {
    const navigate = useNavigate();

  const [runs, setRuns] = useState([]);
  const projectId = localStorage.getItem("projectId");

 useEffect(() => {

  if (!projectId) return;

  fetch(`http://localhost:5000/api/testruns?projectId=${projectId}`)
    .then(r => r.json())
    .then(setRuns);

}, [projectId]);

if (!projectId) {
  return <h2>Please select a project first.</h2>;
}

  const deleteRun = async (id) => {

  if (!window.confirm("Delete this test run?")) return;

  await fetch(`http://localhost:5000/api/testruns/${id}`, {
    method: "DELETE"
  });

  setRuns(runs.filter(r => r.id !== id));
};

  return (
    <div className="run-list-page">

      <h2>Test Runs</h2>

      <div className="run-table">

        <div className="run-table-header">
          <span>Name</span>
          <span>Dates</span>
          <span>Test Cases</span>
          <span>Assigned Testers</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {runs.map(run => (

          <div key={run.id} className="run-row">

            {/* NAME */}
            <span className="run-name">
              {run.name}
            </span>

            {/* DATES */}
            <span>
              {new Date(run.startDate).toLocaleDateString()} —
              {new Date(run.endDate).toLocaleDateString()}
            </span>

            {/* TEST CASE COUNT */}
            <span>
              {run.testCases?.length || 0}
            </span>

            {/* TESTERS */}
            <span>
              {run.assignments?.length || 0} testers
            </span>

            {/* STATUS */}
            <span>
              <span
                className={`status-badge status-${run.status.toLowerCase()}`}
              >
                {run.status}
              </span>
            </span>

            {/* ACTIONS */}
            <span className="run-actions">

  {/* VIEW */}
  <button
    className="view-btn"
    onClick={() =>
      navigate(`/admin/dashboard/testruns/${run.id}`)
    }
  >
    View
  </button>

  {/* EDIT */}
  <button
    className="edit-btn"
    onClick={() =>
      navigate(`/admin/dashboard/testruns/edit/${run.id}`)
    }
  >
    Edit
  </button>

  {/* DELETE */}
  <button
    className="delete-btn"
    onClick={() => deleteRun(run.id)}
  >
    Delete
  </button>

</span>

          </div>

        ))}

      </div>

    </div>
  );
}

export default TestRunList;