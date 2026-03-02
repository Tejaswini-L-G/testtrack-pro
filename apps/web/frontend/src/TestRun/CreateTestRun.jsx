import { useState, useEffect } from "react";
import "./testrun.css";
import { useNavigate } from "react-router-dom";

function CreateTestRun() {
    const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [testCases, setTestCases] = useState([]);
  const [testers, setTesters] = useState([]);

  const [selectedCases, setSelectedCases] = useState([]);
  const [selectedTesters, setSelectedTesters] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const projectId = localStorage.getItem("projectId");

  /* LOAD DATA */

  useEffect(() => {

  if (!projectId) return;

  const token = localStorage.getItem("token");

  // LOAD TEST CASES
  fetch(`http://localhost:5000/testcases?projectId=${projectId}`, {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(r => r.json())
    .then(data => {
      if (Array.isArray(data)) {
        setTestCases(data);
      } else {
        console.error("Testcases API error:", data);
        setTestCases([]);
      }
    })
    .catch(() => setTestCases([]));

  // LOAD TESTERS
  fetch("http://localhost:5000/api/users?role=tester", {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(r => r.json())
    .then(data => {
      if (Array.isArray(data)) {
        setTesters(data);
      } else {
        console.error("Users API error:", data);
        setTesters([]);
      }
    })
    .catch(() => setTesters([]));

}, [projectId]);  // 🔥 ADD projectId dependency

  /* CREATE RUN */

 const createRun = async () => {

  if (!projectId) {
  alert("Please select a project first");
  return;
}

  const res = await fetch(
    "http://localhost:5000/api/testruns",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        startDate,
        endDate,
         projectId,
        testCaseIds: selectedCases,
        testerIds: selectedTesters
      })
    }
  );

  if (res.ok) {

    alert("Test Run Created Successfully ✅");

    // ⭐ REDIRECT TO LIST PAGE
    navigate("/admin/dashboard/testruns");

  } else {

    alert("Failed to create Test Run ❌");

  }
};
if (!projectId) {
  return <h2>Please select a project first.</h2>;
}

  return (
    <div className="testrun-page">

      <h2>Create Test Run</h2>

      {/* BASIC INFO */}

      <div className="form-group">

        <label>Run Name</label>
        <input
          placeholder="e.g. Sprint 5 Regression"
          value={name}
          onChange={e => setName(e.target.value)}
        />

      </div>

      <div className="form-group">

        <label>Description</label>
        <textarea
          placeholder="Optional details..."
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

      </div>

      {/* DATES */}

      <div className="date-row">

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

      </div>

      {/* TEST CASES */}

      <h3>Select Test Cases</h3>

      <div className="checkbox-list">

        {testCases.map(tc => (
          <label key={tc.id} className="checkbox-item">

            <input
              type="checkbox"
              value={tc.id}
              onChange={e => {

                if (e.target.checked)
                  setSelectedCases([...selectedCases, tc.id]);
                else
                  setSelectedCases(
                    selectedCases.filter(id => id !== tc.id)
                  );

              }}
            />

            {tc.title ? `${tc.title} (${tc.id})` : tc.id}

          </label>
        ))}

      </div>

      {/* TESTER DROPDOWN */}
<h3>Assign Testers</h3>

<div className="dropdown">

  <div
    className="dropdown-selected"
    onClick={() =>
      setShowDropdown(!showDropdown)
    }
  >
    {selectedTesters.length > 0
      ? testers
          .filter(t => selectedTesters.includes(t.id))
          .map(t => t.name || t.email)
          .join(", ")
      : "Select testers"}
  </div>

  {showDropdown && (

    <div className="dropdown-menu">

      {testers.map(user => (

        <label key={user.id} className="dropdown-item">

          <input
            type="checkbox"
            value={user.id}
            checked={selectedTesters.includes(user.id)}
            onChange={(e) => {

              if (e.target.checked)
                setSelectedTesters([
                  ...selectedTesters,
                  user.id
                ]);
              else
                setSelectedTesters(
                  selectedTesters.filter(
                    id => id !== user.id
                  )
                );

            }}
          />

          {user.name || user.email}

        </label>

      ))}

    </div>

  )}

</div>
      <button
        className="create-run-btn"
        onClick={createRun}
      >
        Create Test Run
      </button>

    </div>
  );
}

export default CreateTestRun;