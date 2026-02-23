import { useEffect, useState } from "react";

function DevTestCases() {

  const [cases, setCases] = useState([]);

  useEffect(() => {

    fetch("http://localhost:5000/testcases", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(r => r.json())
      .then(setCases)
      .catch(() => alert("Failed to load test cases"));

  }, []);

  return (
    <div>

      <h2>Test Case Repository</h2>

      {cases.length === 0 && <p>No test cases found</p>}

      {cases.map(tc => (
        <div key={tc.id} className="report-card">

          <h3>{tc.testCaseId} — {tc.title}</h3>

          <p><strong>Module:</strong> {tc.module}</p>

          <p>
            <strong>Priority:</strong>{" "}
            <span className={`badge ${tc.priority?.toLowerCase()}`}>
              {tc.priority}
            </span>
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span className={`badge ${tc.status?.toLowerCase()}`}>
              {tc.status}
            </span>
          </p>

          <p>{tc.description}</p>

        </div>
      ))}

    </div>
  );
}

export default DevTestCases;