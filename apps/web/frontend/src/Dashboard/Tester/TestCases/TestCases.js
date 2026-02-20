import "./TestCases.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function TestCases() {
  const navigate = useNavigate();
  
  const [testCases, setTestCases] = useState([]);
  const [selected, setSelected] = useState([]);
  const [users, setUsers] = useState([]);
  const [suites, setSuites] = useState([]);
  const [cloneId, setCloneId] = useState(null);
const [includeAttachments, setIncludeAttachments] = useState(false);
const [cloneSuccess, setCloneSuccess] = useState(false);


  

  

  // 🔹 Fetch data on load
useEffect(() => {
  fetchTestCases();
  fetchUsers();
  fetchSuites();
}, []);


const fetchUsers = async () => {
  try {
    const res = await fetch("http://localhost:5000/users", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    setUsers(data);

  } catch (err) {
    console.error("Failed to fetch users");
  }
};


  const fetchTestCases = async () => {
    try {
      const res = await fetch("http://localhost:5000/testcases", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await res.json();
      setTestCases(data);
    } catch (err) {
      console.error("Failed to fetch test cases");
    }
  };

  // 🔹 Edit Single
const handleEdit = (id) => {
  navigate(`/dashboard/testcases/edit/${id}`);
};


  // 🔹 Delete Single
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test case?"))
      return;

    await fetch(`http://localhost:5000/testcases/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    fetchTestCases();
  };

 // 🔹 Clone Single




  // 🔹 Bulk Delete
  const handleBulkDelete = async () => {
    if (!window.confirm("Delete selected test cases?")) return;

    await fetch("http://localhost:5000/testcases/bulk-delete", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        testCaseIds: selected,
      }),
    });

    setSelected([]);
    fetchTestCases();
  };

  // 🔹 Checkbox select
  const toggleSelect = (id) => {
  setSelected(prev =>
    prev.includes(id)
      ? prev.filter(i => i !== id)
      : [...prev, id]
  );
};

const handleCreateTemplate = async (id) => {
  await fetch(`http://localhost:5000/testcases/${id}/template`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  alert("Template created successfully");
};

// 🔹 Bulk Status Update
const handleBulkStatus = async (status) => {
  if (!status) return;

  try {
    const res = await fetch("http://localhost:5000/testcases/bulk-status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        testCaseIds: selected,
        status,
      }),
    });

    const data = await res.json();   // ⭐ IMPORTANT

    alert(data.message);

    setSelected([]);
    fetchTestCases();

  } catch (err) {
    console.error("Bulk status error:", err);
  }
};


// 🔹 Bulk Priority Update
const handleBulkPriority = async (priority) => {
  if (!priority) return;

  try {
    const res = await fetch("http://localhost:5000/testcases/bulk-priority", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        testCaseIds: selected,
        priority,
      }),
    });

    const data = await res.json();   // ⭐ IMPORTANT

    alert(data.message);

    setSelected([]);
    fetchTestCases();

  } catch (err) {
    console.error("Bulk priority error:", err);
  }
};

const handleBulkSeverity = async (severity) => {
  if (!severity) return;

  try {
    const res = await fetch("http://localhost:5000/testcases/bulk-severity", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        testCaseIds: selected,
        severity,
      }),
    });

    const data = await res.json();
    alert(data.message);

    setSelected([]);
    fetchTestCases();

  } catch (err) {
    console.error("Bulk severity error:", err);
  }
};

const handleBulkAssignee = async (assignedTesterId) => {
  if (!assignedTesterId) return;

  try {
    const res = await fetch("http://localhost:5000/testcases/bulk-assignee", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        testCaseIds: selected,
        assignedTesterId,
      }),
    });

    const data = await res.json();
    alert(data.message);

    setSelected([]);
    fetchTestCases();

  } catch (err) {
    console.error("Bulk assignee error:", err);
  }
};

const handleExportCSV = async () => {
  const res = await fetch(
    "http://localhost:5000/testcases/export/csv",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ testCaseIds: selected }),
    }
  );

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "testcases.csv";
  a.click();
};

const handleExportExcel = async () => {
  const res = await fetch(
    "http://localhost:5000/testcases/export/excel",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ testCaseIds: selected }),
    }
  );

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "testcases.xlsx";
  a.click();
};




const handleSeverityChange = (e) => {
  const severity = e.target.value;
  if (severity !== "Severity") handleBulkSeverity(severity);
};

const handleAssigneeChange = (e) => {
  const assignee = e.target.value;
  if (assignee !== "Assign To") handleBulkAssignee(assignee);
};


// 🔹 Dropdown handlers
const handleStatusChange = (e) => {
  const status = e.target.value;
  if (status !== "Status") handleBulkStatus(status);
};

const handlePriorityChange = (e) => {
  const priority = e.target.value;
  if (priority !== "Priority") handleBulkPriority(priority);
};

const handleBulkModule = async (module) => {
  const res = await fetch(
    "http://localhost:5000/testcases/bulk-module",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        testCaseIds: selected,
        module,
      }),
    }
  );

  const data = await res.json();
  alert(data.message);

  setSelected([]);
  fetchTestCases();
};

const handleBulkSuite = async (suiteId) => {
  if (!suiteId) return;

  const res = await fetch(
    "http://localhost:5000/testcases/bulk-suite",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        testCaseIds: selected,
        suiteId,
      }),
    }
  );

  const data = await res.json();
  alert(data.message);

  setSelected([]);
  fetchTestCases();
};


const fetchSuites = async () => {
  try {
    const res = await fetch("http://localhost:5000/testsuites", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    setSuites(data);

  } catch (err) {
    console.error("Failed to fetch suites");
  }
};


 return (
    <div className="testcases-container">
    
      {/* Header */}
      <div className="page-header">
        <h1>Test Cases</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/testcases/create")}
        >
          Create Test Case
        </button>
      </div>

      


{/* Bulk Bar */}
<div className="bulk-bar">

  <div className="bulk-left">
    <button
      className="btn-secondary"
      onClick={() => setSelected(testCases.map(tc => tc.id))}
    >
      Select All
    </button>

    <button
      className="btn-secondary"
      onClick={() => setSelected([])}
    >
      Clear
    </button>

    {selected.length > 0 && (
      <span>{selected.length} selected</span>
    )}
  </div>

  {selected.length > 0 && (
    <div className="bulk-actions">

      {/* 🔹 Bulk Status */}
      <select
        className="bulk-select"
        onChange={handleStatusChange}
        defaultValue="Status"
      >
        <option disabled>Status</option>
        <option>Draft</option>
        <option>Ready for Review</option>
        <option>Approved</option>
        <option>Deprecated</option>
        <option>Archived</option>
      </select>

      {/* 🔹 Bulk Priority */}
      <select
        className="bulk-select"
        onChange={handlePriorityChange}
        defaultValue="Priority"
      >
        <option disabled>Priority</option>
        <option>Critical</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>


      <select
  className="bulk-select"
  onChange={handleSeverityChange}
  defaultValue="Severity"
>
  <option disabled>Severity</option>
  <option>Blocker</option>
  <option>Critical</option>
  <option>Major</option>
  <option>Minor</option>
  <option>Trivial</option>
</select>


<select
  className="bulk-select"
  onChange={handleAssigneeChange}
  defaultValue="Assign To"
>
  <option disabled>Assign To</option>

  {users.map(u => (
    <option key={u.id} value={u.id}>
      {u.name}
    </option>
  ))}

</select>

<select onChange={(e) => handleBulkModule(e.target.value)}>
  <option>Move to Module</option>
  <option>Authentication</option>
  <option>Payments</option>
  <option>Dashboard</option>
</select>

<select
  className="bulk-select"
  onChange={(e) => handleBulkSuite(e.target.value)}
  defaultValue=""
>
  <option value="" disabled>
    Move to Suite
  </option>

  {suites.map((suite) => (
    <option key={suite.id} value={suite.id}>
      {suite.name}
    </option>
  ))}
</select>


<button className="btn-secondary" onClick={handleExportCSV}>
  Export CSV
</button>

<button className="btn-secondary" onClick={handleExportExcel}>
  Export Excel
</button>





      {/* 🔹 Bulk Delete */}
      <button
        className="btn-danger"
        onClick={handleBulkDelete}
      >
        Delete Selected
      </button>

    </div>
  )}

</div>





      

      {/* Filters */}
      <div className="filter-bar">
        <input placeholder="Search test cases..." />
        <select>
          <option>Status</option>
          <option>Draft</option>
          <option>Approved</option>
        </select>
        <select>
          <option>Priority</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
        </select>
      </div>

{cloneSuccess && (
  <div className="success-banner">
    Test case cloned successfully
  </div>
)}





      {/* Table */}
      <div className="tc-table-wrapper">
  <table className="tc-table">

        <thead>
          <tr>
            <th></th>
            <th>Test Case ID</th>
            <th>Title</th>
            <th>Module</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {testCases.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
                No test cases found
              </td>
            </tr>
          ) : (
            testCases.map((tc) => (
              <tr key={tc.id}>
                <td>
                  <input
  type="checkbox"
  checked={selected.includes(tc.id)}
  onChange={() => toggleSelect(tc.id)}
/>
                  
                </td>
                <td>{tc.testCaseId}</td>
                <td>{tc.title}</td>
                <td>{tc.module}</td>
                <td>
                  <span className={`badge ${tc.priority.toLowerCase()}`}>
                    {tc.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge ${tc.status.toLowerCase()}`}>
                    {tc.status}
                  </span>
                </td>
                <td className="actions">
                 <button
  className="btn-link"
  onClick={() => handleEdit(tc.id)}
>
  Edit
</button>


                  <button
  className="btn-link"
  onClick={() => setCloneId(tc.id)}
>
  Clone
</button>



                  <button
                    className="btn-link delete"
                    onClick={() => handleDelete(tc.id)}
                  >
                    Delete
                  </button>

                  <button
  className="btn-link"
  onClick={() => handleCreateTemplate(tc.id)}
>
  Template
</button>


<button
  className="btn-link"
  onClick={() =>
    navigate(`/dashboard/testcases/${tc.id}/versions`)
  }
>
  History
</button>

<button
  className="btn-link"
  onClick={() => navigate(`/dashboard/testcases/view/${tc.id}`)}
>
  View
</button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>


{cloneId && (
  <div className="modal-overlay">
    <div className="clone-modal">

      <h3>Clone Test Case</h3>

      <label className="clone-option">
    <input
      type="radio"
      name="attachments"
      checked={includeAttachments === true}
      onChange={() => setIncludeAttachments(true)}
    />
    Clone WITH attachments
  </label>

  <label className="clone-option">
    <input
      type="radio"
      name="attachments"
      checked={includeAttachments === false}
      onChange={() => setIncludeAttachments(false)}
    />
    Clone WITHOUT attachments
  </label>
      <div className="modal-actions">
        <button
          className="btn-primary"
          onClick={async () => {

            await fetch(
              `http://localhost:5000/testcases/${cloneId}/clone`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization:
                    "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({ includeAttachments }),
              }
            );

            setCloneId(null);
            setIncludeAttachments(false);
            setCloneSuccess(true);

            fetchTestCases();

            setTimeout(() => setCloneSuccess(false), 3000);
          }}
        >
          Clone
        </button>

        <button
          className="btn-secondary"
          onClick={() => setCloneId(null)}
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

export default TestCases;
