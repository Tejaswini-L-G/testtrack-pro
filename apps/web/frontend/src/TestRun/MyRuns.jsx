import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./testrun.css";

function MyRuns() {

  const [runs, setRuns] = useState([]);
  const navigate = useNavigate();

  /* Get tester ID from token */

  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));
  const testerId = payload.id;

  useEffect(() => {

    fetch(
      `http://localhost:5000/api/my-runs/${testerId}`
    )
      .then(r => r.json())
      .then(setRuns);

  }, [testerId]);

  return (
    <div className="page-container">

      <h2>My Test Runs</h2>

      {runs.length === 0 && (
        <p>No runs assigned</p>
      )}

      {runs.map(run => (

        <div
          key={run.id}
          className="run-card"
        >

          <h3>{run.name}</h3>

          <p>
            {new Date(run.startDate).toDateString()}
            {" — "}
            {new Date(run.endDate).toDateString()}
          </p>

          <p>
            {run.testCases.length} test cases
          </p>

          <button
            className="create-run-btn"
            onClick={() =>
              navigate(
                `/dashboard/my-runs/${run.id}`
              )
            }
          >
            Open Run
          </button>

        </div>

      ))}

    </div>
  );
}

export default MyRuns;