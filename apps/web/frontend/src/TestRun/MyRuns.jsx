import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./testrun.css";
import { useLocation } from "react-router-dom";

function MyRuns() {
  const location = useLocation();

  const [runs, setRuns] = useState([]);
  const navigate = useNavigate();
const projectId = localStorage.getItem("projectId");
  /* Get tester ID from token */

  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));
  const testerId = payload.id;


  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const highlightId = params.get("highlight");

  if (highlightId && runs.length > 0) {
    const element = document.getElementById(highlightId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("highlight-run");

      setTimeout(() => {
        element.classList.remove("highlight-run");
      }, 3000);
    }
  }
}, [runs, location.search]);

 useEffect(() => {

  if (!projectId) {
  return <h2>Please select a project first.</h2>;
}

  fetch(
    `http://localhost:5000/api/testruns/my/${testerId}?projectId=${projectId}`
  )
    .then(r => r.json())
    .then(setRuns);

}, [testerId, projectId]);



  return (
    <div className="page-container">

      <h2>My Test Runs</h2>

      {runs.length === 0 && (
        <p>No runs assigned</p>
      )}

      {runs.map(run => (

        <div
  key={run.id}
  id={run.id}   // ⭐ ADD THIS
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