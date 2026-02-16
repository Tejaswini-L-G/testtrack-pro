import "./TestCases.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function TestCases() {
  const navigate = useNavigate();
  
  const [testCases, setTestCases] = useState([]);
  const [selected, setSelected] = useState([]);

  // 🔹 Fetch Test Cases
  useEffect(() => {
    fetchTestCases();
  }, []);

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
const handleClone = async (id) => {
  if (!window.confirm("Are you sure you want to clone this test case?"))
    return;

  await fetch(`http://localhost:5000/testcases/${id}/clone`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  fetchTestCases(); // Refresh list
};


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

  await fetch("http://localhost:5000/testcases/bulk-status", {
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

  setSelected([]);
  fetchTestCases();
};

// 🔹 Bulk Priority Update
const handleBulkPriority = async (priority) => {
  if (!priority) return;

  await fetch("http://localhost:5000/testcases/bulk-priority", {
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

  setSelected([]);
  fetchTestCases();
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
    <button className="btn-danger" onClick={handleBulkDelete}>
      Delete Selected
    </button>
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
  onClick={() => handleClone(tc.id)}
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
  onClick={() => navigate(`/dashboard/testcases/${tc.id}`)}
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
      </div>
   
    
  );
}

export default TestCases;
