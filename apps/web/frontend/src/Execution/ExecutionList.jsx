import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./executionList.css";


function ExecutionList() {

  const [testCases, setTestCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/testcases", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(data => setTestCases(data))
      .catch(() => console.error("Failed to load test cases"));
  }, []);

function getUserIdFromToken(token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.id;
}

const startExecution = async (testCaseId) => {

  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://localhost:5000/api/executions/start",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ testCaseId }),
    }
  );

  const data = await res.json();

  console.log("Start API response:", data);

  if (!data?.id) {
    alert("Failed to start execution");
    return;
  }

  navigate(`/dashboard/execution/${testCaseId}`, {
    state: { executionId: data.id },
  });
};


  return (
    <div className="execution-list-container">

      <h2 className="page-title">Approved Test Cases</h2>

      <div className="table-wrapper">

        <table className="execution-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Module</th>
              <th>Priority</th>
              <th>Severity</th>
              <th>Type</th>
              <th>Steps</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {testCases.length === 0 && (
              <tr>
                <td colSpan="9" className="no-data">
                  No approved test cases available
                </td>
              </tr>
            )}

            {testCases.map(tc => (

              <tr key={tc.id}>

                <td>{tc.id}</td>
                <td className="title-cell">{tc.title}</td>
                <td>{tc.module}</td>
                <td>{tc.priority}</td>
                <td>{tc.severity}</td>
                <td>{tc.type}</td>
                <td>{tc.steps.length}</td>

                <td>
                  <span className="status-approved">
                    {tc.status}
                  </span>
                </td>

                <td>
                  <button
  className="execute-btn"
  onClick={() =>
    navigate(`/dashboard/execution/${tc.id}`)
  }
>
  Execute
</button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ExecutionList;