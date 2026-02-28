import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Suites.css";

function SuitesList() {
  const navigate = useNavigate();
  const [suites, setSuites] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [selectedSuite, setSelectedSuite] = useState(null);
  const [selectedCases, setSelectedCases] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editSuiteId, setEditSuiteId] = useState(null);
  const [editName, setEditName] = useState("");

  const [module, setModule] = useState("");
const [parentSuite, setParentSuite] = useState("");

const [editModule, setEditModule] = useState("");
const [editParentSuite, setEditParentSuite] = useState("");

const [executeSuiteId, setExecuteSuiteId] = useState(null);
const [mode, setMode] = useState("SEQUENTIAL");

const [showExecuteModal, setShowExecuteModal] = useState(false);
// ===== ORDERED CASES FOR SELECTED SUITE =====
const [suiteCases, setSuiteCases] = useState([]);
const [showArchived, setShowArchived] = useState(false);
const projectId = localStorage.getItem("projectId");

const toggleArchived = () => {
  setShowArchived(prev => !prev);

  // ⭐ IMPORTANT — reset selection
  setSelectedSuite(null);
  setSuiteCases([]);
};

 const fetchSuites = async () => {

  if (!projectId) return;

  const res = await fetch(
    `http://localhost:5000/suites?projectId=${projectId}&archived=${showArchived}`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      cache: "no-store"
    }
  );

  setSuites(await res.json());
};

  const fetchTestCases = async () => {

  if (!projectId) return;

  const res = await fetch(
    `http://localhost:5000/testcases?projectId=${projectId}`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );

  setTestCases(await res.json());
};

 useEffect(() => {
  fetchSuites();
  fetchTestCases();
}, [showArchived]);


  // ===== REORDER FUNCTIONS (VIEW PAGE) =====


  useEffect(() => {

  if (!selectedSuite) return;

  fetch(`http://localhost:5000/api/suites/${selectedSuite}/testcases`)
    .then(r => r.json())
    .then(setSuiteCases)
    .catch(() => alert("Failed to load suite cases"));

}, [selectedSuite]);

// ===== REORDER FUNCTIONS (VIEW PAGE) =====

const moveUp = (index) => {

  if (index === 0) return;

  const updated = [...suiteCases];

  [updated[index - 1], updated[index]] =
    [updated[index], updated[index - 1]];

  setSuiteCases(updated);
};

const moveDown = (index) => {

  if (index === suiteCases.length - 1) return;

  const updated = [...suiteCases];

  [updated[index + 1], updated[index]] =
    [updated[index], updated[index + 1]];

  setSuiteCases(updated);
};

const saveOrder = async () => {

  try {

    await fetch(
      `http://localhost:5000/api/suites/${selectedSuite}/reorder`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderedIds: suiteCases.map(c => c.id)
        })
      }
    );

    alert("Order saved successfully ✅");

  } catch (err) {
    console.error(err);
    alert("Failed to save order");
  }

};

  const handleCreate = async () => {
    if (!name.trim()) return alert("Suite name required");

    await fetch("http://localhost:5000/suites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ name, description,module,
  parentId: parentSuite || null ,
projectId}),
    });

    setName("");
    setDescription("");
    setModule("");
    setParentSuite("");
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
      body: JSON.stringify({
        name: editName,
        description,
        module: editModule,
        parentSuiteId: editParentSuite || null
      }),
    }
  );

  setEditSuiteId(null);
  setEditName("");
  setEditModule("");
  setEditParentSuite("");

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

const executeSuite = async (suiteId, suiteName) => {

  const mode = window.prompt(
    "Execution mode?\nType SEQ for Sequential or PAR for Parallel",
    "SEQ"
  );

  if (!mode) return;

  const res = await fetch(
    `http://localhost:5000/suites/${suiteId}/execute`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        mode: mode === "PAR" ? "PARALLEL" : "SEQUENTIAL"
      }),
    }
  );

  const data = await res.json();

  alert("Suite Execution Started 🚀");

  // Redirect to Test Run Details
  window.location.href = `/dashboard/testruns/${data.runId}`;
};

const confirmExecute = async () => {

  const res = await fetch(
    `http://localhost:5000/suites/${executeSuiteId}/execute`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ mode })
    }
  );

  const data = await res.json();

  setExecuteSuiteId(null);

  if (!data.runId) {
    alert("Failed to start execution");
    return;
  }

  // 🔥 Correct redirect
  window.location.href =
    `/dashboard/testruns/${data.runId}`;
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
if (!projectId) {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Please select a project first.</h2>
    </div>
  );
}

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

<input
  placeholder="Module (e.g., Authentication)"
  value={module}
  onChange={(e) => setModule(e.target.value)}
/>

<select
  value={parentSuite}
  onChange={(e) => setParentSuite(e.target.value)}
>
  <option value="">Parent Suite (optional)</option>

  {suites.map((s) => (
    <option key={s.id} value={s.id}>
      {s.name}
    </option>
  ))}
</select>

        <button className="btn-primary" onClick={handleCreate}>
          Create Suite
        </button>
      </div>

<button
  className="btn-secondary"
  onClick={toggleArchived}
>
  {showArchived
    ? "Show Active Suites"
    : "Show Archived Suites"}
</button>

<p style={{ margin: "10px 0", fontWeight: "600" }}>
  Showing: {showArchived ? "Archived Suites" : "Active Suites"}
</p>

      {/* Suites Table */}
      <table className="suites-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Module</th>
<th>Parent Suite</th>
            <th>Total Test Cases</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suites.map((s) => (
            <tr key={s.id}>

  {/* NAME */}
  <td>
    {s.name}

    {s.parentId && (
      <div className="child-label">
        Child Suite
      </div>
    )}
  </td>

  {/* DESCRIPTION */}
  <td>{s.description || "—"}</td>

  {/* MODULE */}
  <td>
    {s.module
      ? <span className="module-badge">{s.module}</span>
      : "—"}
  </td>

  {/* PARENT SUITE */}
  <td>
    {s.parent
      ? <span className="parent-badge">{s.parent.name}</span>
      : "Root"}
  </td>

  {/* TOTAL TEST CASES */}
  <td>
    {testCases.filter(tc => tc.suiteId === s.id).length}
  </td>

  {/* ACTIONS */}
  <td>
  <button
  onClick={() =>
    setSelectedSuite(
      selectedSuite === s.id ? null : s.id
    )
  }
  className="btn-view"
>
  {selectedSuite === s.id ? "Hide" : "View"}
</button>

  <button
  onClick={() => {
    setEditSuiteId(s.id);
    setEditName(s.name);
    setDescription(s.description || "");
    setEditModule(s.module || "");
    setEditParentSuite(s.parentSuiteId || "");
  }}
  className="btn-edit"
>
  Edit
</button>

<button
  className="btn-execute"
  onClick={() => {
    setExecuteSuiteId(s.id);
    setShowExecuteModal(true);
  }}
>
  Execute
</button>


<button
  className="btn-clone"
  onClick={async () => {

    if (!window.confirm("Clone this suite?")) return;

    const res = await fetch(
      `http://localhost:5000/api/suites/${s.id}/clone`,
      { method: "POST" }
    );

    const data = await res.json();

    alert("Suite cloned successfully ✅");

    fetchSuites(); // refresh list

  }}
>
  Clone
</button>

{s.isArchived ? (

  <button
    className="btn-restore"
    onClick={async () => {

      await fetch(
        `http://localhost:5000/api/suites/${s.id}/restore`,
        { method: "PUT" }
      );

      fetchSuites();

    }}
  >
    Restore
  </button>

) : (

  <button
    className="btn-archive"
    onClick={async () => {

      if (!window.confirm("Archive this suite?")) return;

      await fetch(
        `http://localhost:5000/api/suites/${s.id}/archive`,
        { method: "PUT" }
      );

      fetchSuites();

    }}
  >
    Archive
  </button>

)}

  <button
    onClick={() => handleDeleteSuite(s.id)}
    className="btn-delete"
  >
    Delete
  </button>

<button
  className="btn-report"
  onClick={() =>
    navigate(`/dashboard/suite-report/suite/${s.id}`)
  }
>
  Report
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

    

    <button
  className="save-order-btn"
  onClick={saveOrder}
>
  💾 Save Order
</button>



    <div className="suite-scroll">
     {suiteCases.map((tc, index) => (
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
              
              <div className="suite-actions">

  <button
    className="reorder-btn"
    onClick={() => moveUp(index)}
  >
    ↑
  </button>

  <button
    className="reorder-btn"
    onClick={() => moveDown(index)}
  >
    ↓
  </button>

  
</div>


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

    <h3>Edit Test Suite</h3>

    <div className="edit-grid">

      <input
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        placeholder="Suite Name"
      />

      <input
        value={editModule}
        onChange={(e) => setEditModule(e.target.value)}
        placeholder="Module (e.g., Authentication)"
      />

      <select
        value={editParentSuite}
        onChange={(e) =>
          setEditParentSuite(e.target.value)
        }
      >
        <option value="">
          Parent Suite (optional)
        </option>

        {suites
          .filter((s) => s.id !== editSuiteId)
          .map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
      </select>

    </div>

    <textarea
      value={description}
      onChange={(e) =>
        setDescription(e.target.value)
      }
      placeholder="Suite Description"
      className="edit-textarea"
    />

    <div className="edit-actions">

      <button
        className="btn-update"
        onClick={handleUpdateSuite}
      >
        Update Suite
      </button>

      <button
        className="btn-cancel"
        onClick={() => setEditSuiteId(null)}
      >
        Cancel
      </button>

    </div>

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

     {showExecuteModal && (

  <div className="modal-overlay">

    <div className="modal-box">

      <h3>Select Execution Mode</h3>

      <label className="radio-option">
        <input
          type="radio"
          checked={mode === "sequential"}
          onChange={() => setMode("sequential")}
        />
        Sequential (one by one)
      </label>

      <label className="radio-option">
        <input
          type="radio"
          checked={mode === "parallel"}
          onChange={() => setMode("parallel")}
        />
        Parallel (multiple testers)
      </label>

      <div className="modal-actions">

        <button
          className="start-btn"
          onClick={() => {
            setShowExecuteModal(false);

            navigate(
              `/dashboard/suites/${executeSuiteId}/execute?mode=${mode}`
            );
          }}
        >
          Start Execution
        </button>

        <button
          className="cancel-btn"
          onClick={() => setShowExecuteModal(false)}
        >
          Cancel
        </button>

      </div>

    </div>

  </div>

)}

      

    </div>
  );
}

export default SuitesList;
