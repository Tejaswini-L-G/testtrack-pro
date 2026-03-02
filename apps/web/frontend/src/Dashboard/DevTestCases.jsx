import { useEffect, useState } from "react";
import "./Developer.css";

function DevTestCases() {

  const [cases, setCases] = useState([]);
   const [searchResults, setSearchResults] = useState(null);
const [testCases, setTestCases] = useState([]);

useEffect(() => {
  if (searchResults?.testCases?.length > 0) {

    const searchedIds = searchResults.testCases.map(tc => tc.id);

    const prioritized = [
      ...testCases.filter(tc => searchedIds.includes(tc.id)),
      ...testCases.filter(tc => !searchedIds.includes(tc.id))
    ];

    setTestCases(prioritized);
  }
}, [searchResults]);


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
    <div className="dev-page">

      <h2 className="dev-title">Test Case Repository</h2>

      {cases.length === 0 && (
        <p className="empty-msg">No test cases found</p>
      )}

      {cases.map(tc => (

        <div key={tc.id} className="dev-card">

          {/* HEADER */}
          <div className="dev-card-header">

            <h3>
              {tc.testCaseId} — {tc.title}
            </h3>

            <span className={`badge ${tc.status?.toLowerCase()}`}>
              {tc.status}
            </span>

          </div>

          {/* DETAILS GRID */}
          <div className="dev-grid">

            <div>
              <label>Module</label>
              <p>{tc.module}</p>
            </div>

            <div>
              <label>Priority</label>
              <span className={`badge ${tc.priority?.toLowerCase()}`}>
                {tc.priority}
              </span>
            </div>

            <div>
              <label>Severity</label>
              <p>{tc.severity}</p>
            </div>

            <div>
              <label>Type</label>
              <p>{tc.type}</p>
            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="dev-section">
            <label>Description</label>
            <p>{tc.description}</p>
          </div>

          {/* ATTACHMENTS */}
          {tc.attachments?.length > 0 && (
            <div className="dev-section">
              <label>Attachments</label>

              <ul className="attachment-list">
                {tc.attachments.map(a => (
                  <li key={a.id}>
                    📎 {a.fileName}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      ))}

    </div>
  );
}

export default DevTestCases;