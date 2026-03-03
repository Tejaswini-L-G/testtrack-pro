import { useEffect, useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import "./testrun.css";

function RunDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [run, setRun] = useState(null);
  const [caseDetails, setCaseDetails] = useState({});
  const [executions, setExecutions] = useState([]);
  

  /* =========================
     LOAD RUN
  ========================= */


useEffect(() => {

  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));
  const testerId = payload.id;

  fetch(
    `http://localhost:5000/api/executions/run/${id}/${testerId}`
  )
    .then(r => r.json())
    .then(setExecutions);

}, [id]);


  useEffect(() => {

    fetch(`http://localhost:5000/api/testruns/${id}`)
      .then(r => r.json())
      .then(setRun);

  }, [id]);

  /* =========================
     LOAD EXECUTIONS (NEW)
  ========================= */

  useEffect(() => {

    fetch(`http://localhost:5000/api/executions/by-run/${id}`)
      .then(r => r.json())
      .then(setExecutions);

  }, [id]);

  /* =========================
     LOAD TEST CASE DETAILS
  ========================= */

  useEffect(() => {

    if (!run?.testCases) return;

    run.testCases.forEach(tc => {

      fetch(`http://localhost:5000/api/testcases/${tc.testCaseId}`)
        .then(r => r.json())
        .then(data => {

          setCaseDetails(prev => ({
            ...prev,
            [tc.testCaseId]: data
          }));

        });

    });

  }, [run]);

  if (!run) return <p>Loading...</p>;

  /* ⭐ Find execution for each test case */

  const getExecution = (testCaseId) =>
    executions.find(e => e.testCaseId === testCaseId);

  return (
    <div className="page-container">

      <button
        className="back-btn"
        onClick={() => navigate("/dashboard/my-runs")}
      >
        ← Back
      </button>

      <h2>{run.name}</h2>
      <h3>Test Cases</h3>

      {run.testCases?.length === 0 && (
        <p>No test cases in this run</p>
      )}

      {run.testCases?.map(tc => {

        
        const exec = executions.find(
  e => e.testCaseId === tc.testCaseId
);

        let status = "Not Started";

        if (exec) {
          status = exec.completedAt
            ? "Completed"
            : "In Progress";
        }

        return (

          <div key={tc.id} className="run-card">

            <div className="tc-info">

              <h4>
                {caseDetails[tc.testCaseId]?.title || "Loading..."}
              </h4>

              <p>
                <strong>ID:</strong> {tc.testCaseId}
              </p>

              <p>
                <strong>Status:</strong> {status}
              </p>

            </div>

            <button
  className="create-run-btn"
  onClick={() =>
    navigate(
      `/dashboard/execution/${tc.testCaseId}?runId=${run.id}`
    )
  }
>
  {status === "Completed"
    ? "Re-Execute"
    : status === "In Progress"
    ? "Continue"
    : "Execute"}
</button>


          </div>

        );

      })}

    </div>
  );
}

export default RunDetails;