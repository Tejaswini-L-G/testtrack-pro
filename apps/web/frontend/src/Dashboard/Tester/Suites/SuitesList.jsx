import { useEffect, useState } from "react";
import "./Suites.css";

function SuitesList() {
  const [suites, setSuites] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [selectedSuite, setSelectedSuite] = useState(null);
  const [selectedCases, setSelectedCases] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editSuiteId, setEditSuiteId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchSuites = async () => {
    const res = await fetch("http://localhost:5000/suites", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    setSuites(await res.json());
  };

  const fetchTestCases = async () => {
    const res = await fetch("http://localhost:5000/testcases", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    setTestCases(await res.json());
  };

  useEffect(() => {
    fetchSuites();
    fetchTestCases();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return alert("Suite name required");

    await fetch("http://localhost:5000/suites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ name, description }),
    });

    setName("");
    setDescription("");
    fetchSuites();
  };

  const toggleSelect = (id) => {
    if (selectedCases.includes(id)) {
      setSelectedCases(selectedCases.filter((i) => i !== id));
    } else {
      setSelectedCases([...selectedCases, id]);
    }
  };

  const selectAll = () => {
    if (selectedCases.length === testCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(testCases.map((tc) => tc.id));
    }
  };

  const assignToSuite = async () => {
    if (!selectedSuite) return alert("Select a suite");

    for (let id of selectedCases) {
      await fetch(
        `http://localhost:5000/testcases/${id}/assign-suite`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ suiteId: selectedSuite }),
        }
      );
    }

    alert("Assigned successfully");
    setSelectedCases([]);
    fetchSuites();
    fetchTestCases();
  };

  const handleDeleteSuite = async (id) => {
    if (!window.confirm("Delete this test suite?")) return;

    await fetch(`http://localhost:5000/suites/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    fetchSuites();
  };

  const handleUpdateSuite = async () => {
    await fetch(
      `http://localhost:5000/suites/${editSuiteId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ name: editName }),
      }
    );

    setEditSuiteId(null);
    setEditName("");
    fetchSuites();
  };

  const removeFromSuite = async (testCaseId) => {
    if (!window.confirm("Remove this test case from suite?")) return;

    await fetch(
      `http://localhost:5000/testcases/${testCaseId}/remove-suite`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    fetchTestCases();
    fetchSuites();
  };


  const deleteTestCaseInsideSuite = async (id) => {
  if (!window.confirm("Delete this test case permanently?")) return;

  await fetch(`http://localhost:5000/testcases/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  fetchTestCases();
  fetchSuites();
};


  return (
    <div className="suites-container">

      <div className="suites-header">
        <h2>Test Suites</h2>
      </div>

      {/* Create Suite */}
      <div className="suite-create">
        <input
          placeholder="Suite Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn-primary" onClick={handleCreate}>
          Create Suite
        </button>
      </div>

      {/* Suites Table */}
      <table className="suites-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Total Test Cases</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suites.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.description}</td>
              <td>
  {testCases.filter(tc => tc.suiteId === s.id).length}
</td>

              <td>
  <button
    onClick={() => setSelectedSuite(s.id)}
    className="btn-view"
  >
    View
  </button>

  <button
    onClick={() => {
      setEditSuiteId(s.id);
      setEditName(s.name);
      setDescription(s.description || "");
    }}
    className="btn-edit"
  >
    Edit
  </button>

  <button
    onClick={() => handleDeleteSuite(s.id)}
    className="btn-delete"
  >
    Delete
  </button>
</td>

            </tr>
          ))}
        </tbody>
      </table>

     {selectedSuite && (
  <div className="suite-view">
    <h3>
      Test Cases in Suite
    </h3>

    <div className="suite-scroll">
      {testCases
        .filter((tc) => tc.suiteId === selectedSuite)
        .map((tc) => (
          <div key={tc.id} className="suite-testcase">
            <div className="suite-testcase-info">
  <div className="suite-title">
    {tc.testCaseId} — {tc.title}
  </div>

  <div className="suite-meta">
    <span>{tc.module}</span>

    <span className={`badge ${tc.priority?.toLowerCase()}`}>
      {tc.priority}
    </span>

    <span className={`badge ${tc.status?.toLowerCase()}`}>
      {tc.status}
    </span>
  </div>
</div>

            <div className="suite-actions">
              

              <button
                className="btn-link delete"
                onClick={() =>
                  deleteTestCaseInsideSuite(tc.id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  </div>
)}



      {editSuiteId && (
  <div className="suite-edit-box">
    <input
      value={editName}
      onChange={(e) => setEditName(e.target.value)}
      placeholder="Suite Name"
    />

    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Suite Description"
    />

    <button onClick={handleUpdateSuite}>
      Update Suite
    </button>
  </div>
)}

      <hr className="divider" />

      {/* Assign Section */}
      <h3>Assign Test Cases to Suite</h3>

      <select
        className="suite-select"
        onChange={(e) => setSelectedSuite(e.target.value)}
      >
        <option value="">Select Suite</option>
        {suites.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <div className="assign-box">
        <button className="btn-secondary" onClick={selectAll}>
          {selectedCases.length === testCases.length
            ? "Unselect All"
            : "Select All"}
        </button>
       

        <button
  className="assign-btn"
  onClick={assignToSuite}
  disabled={!selectedSuite || selectedCases.length === 0}
>
  Assign Selected Test Cases
</button>

        {testCases.map((tc) => (
  <div key={tc.id} className="assign-row">
    <input
      type="checkbox"
      checked={selectedCases.includes(tc.id)}
      onChange={() => toggleSelect(tc.id)}
    />

    <div className="assign-details">
      <div className="assign-title">
        {tc.testCaseId} — {tc.title}
      </div>

      <div className="assign-meta">
        <span className="meta-module">{tc.module}</span>

        <span className={`badge ${tc.priority?.toLowerCase()}`}>
          {tc.priority}
        </span>

        <span className={`badge ${tc.status?.toLowerCase()}`}>
          {tc.status}
        </span>
      </div>
    </div>
  </div>
))}


      </div>

      

    </div>
  );
}

export default SuitesList;
