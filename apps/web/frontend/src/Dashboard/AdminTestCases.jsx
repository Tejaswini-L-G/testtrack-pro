import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminTestCases() {
  const [testCases, setTestCases] = useState([]);
  const [view, setView] = useState("active");
  const [selected, setSelected] = useState([]);
  const [searchResults, setSearchResults] = useState(null);


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
    fetchTestCases();
    setSelected([]);
  }, [view]);

  const fetchTestCases = async () => {
    const url =
      view === "deleted"
        ? "http://localhost:5000/admin/testcases/deleted"
        : "http://localhost:5000/admin/testcases";

    const res = await fetch(url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    setTestCases(Array.isArray(data) ? data : data.testCases || []);
  };

  // ===== Selection =====

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => setSelected(testCases.map((tc) => tc.id));
  const clearSelection = () => setSelected([]);

  // ===== SINGLE DELETE =====

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this test case?")) return;

    await fetch(
      `http://localhost:5000/admin/testcases/${id}/permanent`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    fetchTestCases();
  };

  // ===== SINGLE RESTORE =====

  const handleRestore = async (id) => {
    await fetch(
      `http://localhost:5000/admin/testcases/${id}/restore`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    fetchTestCases();
  };

  // ===== BULK DELETE =====

  const handleBulkDelete = async () => {
    if (!window.confirm("Delete selected test cases?")) return;

    await fetch("http://localhost:5000/admin/testcases/bulk-permanent", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ ids: selected }),
    });

    fetchTestCases();
    clearSelection();
  };

  // ===== BULK RESTORE =====

  const handleBulkRestore = async () => {
    await fetch("http://localhost:5000/admin/testcases/bulk-restore", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ ids: selected }),
    });

    fetchTestCases();
    clearSelection();
  };

  return (
    <div className="admin-tc-page">

      <h2 className="admin-title">Admin — Test Case Management</h2>

      {/* VIEW SWITCH */}
      <div className="admin-view-switch">
        <button
          className={view === "active" ? "active" : ""}
          onClick={() => setView("active")}
        >
          Active Test Cases
        </button>

        <button
          className={view === "deleted" ? "active" : ""}
          onClick={() => setView("deleted")}
        >
          Deleted Test Cases
        </button>
      </div>

      {/* BULK BAR */}
      {testCases.length > 0 && (
        <div className="bulk-bar">

          <div className="bulk-left">
            <button onClick={selectAll}>Select All</button>
            <button onClick={clearSelection}>Clear</button>

            {selected.length > 0 && (
              <span>{selected.length} selected</span>
            )}
          </div>

          {selected.length > 0 && (
            <div className="bulk-actions">
              {view === "deleted" ? (
                <button
                  className="btn-secondary"
                  onClick={handleBulkRestore}
                >
                  Restore Selected
                </button>
              ) : (
                <button
                  className="btn-danger"
                  onClick={handleBulkDelete}
                >
                  Delete Selected
                </button>
              )}
            </div>
          )}

        </div>
      )}

      {/* TABLE */}
      <div className="admin-table-wrapper">
        <table className="tc-table">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {testCases.map((tc) => (
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
                <td>{tc.status}</td>

                <td>
                  {view === "deleted" ? (
                    <button
                      className="btn-secondary"
                      onClick={() => handleRestore(tc.id)}
                    >
                      Restore
                    </button>
                  ) : (
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(tc.id)}
                    >
                      Delete Permanently
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default AdminTestCases;