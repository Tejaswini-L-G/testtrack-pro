import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./testrun.css";

function EditTestRun() {

  const { id } = useParams();
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

    fetch(`http://localhost:5000/api/testruns/${id}`)
      .then(r => r.json())
      .then(data => {

        setTestCases(Array.isArray(data.testCases) ? data.testCases : []);

        setName(data.name || "");
        setDescription(data.description || "");

        setStartDate(data.startDate?.slice(0, 10));
        setEndDate(data.endDate?.slice(0, 10));

        

        setSelectedCases(
          data.testCases?.map(tc => tc.testCaseId) || []
        );

        setSelectedTesters(
          data.assignments?.map(a => a.testerId) || []
        );

      });

    fetch(`http://localhost:5000/testcases?projectId=${projectId}`)
      .then(r => r.json())
      .then(setTestCases);

    fetch("http://localhost:5000/api/users?role=tester")
      .then(r => r.json())
      .then(setTesters);

  }, [id]);

  if (!projectId) {
  return <h2>Please select a project first.</h2>;
}

  /* SAVE */

  const updateRun = async () => {

    const res = await fetch(
      `http://localhost:5000/api/testruns/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          startDate,
          endDate,
          testCaseIds: selectedCases,
          testerIds: selectedTesters
        })
      }
    );

    if (res.ok) {

      alert("Updated Successfully ✅");

      navigate("/admin/dashboard/testruns");

    } else {

      alert("Update failed ❌");

    }
  };

  return (
    <div className="fullscreen-page">

      {/* BACK BUTTON */}

      <button
        className="back-btn"
        onClick={() =>
          navigate("/admin/dashboard/testruns")
        }
      >
        ← Back to Test Runs
      </button>

      <h2>Edit Test Run</h2>

      {/* NAME */}

      <div className="form-group">
        <label>Run Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      {/* DESCRIPTION */}

      <div className="form-group">
        <label>Description</label>
        <textarea
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

       {Array.isArray(testCases) &&
  testCases.map(tc => (

          <label key={tc.id} className="checkbox-item">

            <input
              type="checkbox"
              checked={selectedCases.includes(tc.id)}
              onChange={(e) => {

                if (e.target.checked)
                  setSelectedCases([
                    ...selectedCases,
                    tc.id
                  ]);
                else
                  setSelectedCases(
                    selectedCases.filter(
                      id => id !== tc.id
                    )
                  );

              }}
            />

            {tc.title || tc.id}

          </label>

        ))}

      </div>

      {/* TESTER DROPDOWN */}

      <h3>Assign Testers</h3>

      <div className="dropdown">

        <div
          className="dropdown-selected"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedTesters.length > 0
            ? testers
                .filter(t =>
                  selectedTesters.includes(t.id)
                )
                .map(t => t.name || t.email)
                .join(", ")
            : "Select testers"}
        </div>

        {showDropdown && (

          <div className="dropdown-menu">

            {testers.map(user => (

              <label
                key={user.id}
                className="dropdown-item"
              >

                <input
                  type="checkbox"
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
        onClick={updateRun}
      >
        Save Changes
      </button>



    </div>
  );
}

export default EditTestRun;