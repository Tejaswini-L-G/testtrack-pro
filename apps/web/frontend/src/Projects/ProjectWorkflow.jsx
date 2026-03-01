import { useState, useEffect } from "react";
import "./Projects.css";

function ProjectWorkflow() {

  const projectId = localStorage.getItem("projectId");
  const token = localStorage.getItem("token");

  const [type, setType] = useState("Bug");
  const [statuses, setStatuses] = useState("");
  const [savedWorkflow, setSavedWorkflow] = useState(null);
  const [editing, setEditing] = useState(false);

  const loadWorkflow = async () => {
    const res = await fetch(
      `http://localhost:5000/api/projects/${projectId}/workflows/${type}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();

    if (data?.statuses) {
      setSavedWorkflow(JSON.parse(data.statuses));
      setStatuses(JSON.parse(data.statuses).join(", "));
    } else {
      setSavedWorkflow(null);
      setStatuses("");
    }
  };

  useEffect(() => {
    if (projectId) loadWorkflow();
  }, [projectId, type]);

  const saveWorkflow = async () => {

    const statusArray = statuses.split(",").map(s => s.trim());

    await fetch(
      `http://localhost:5000/api/projects/${projectId}/workflows`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: type,
          statuses: statusArray
        })
      }
    );

    setEditing(false);
    loadWorkflow();
  };

  const deleteWorkflow = async () => {

    if (!window.confirm("Delete this workflow?")) return;

    await fetch(
      `http://localhost:5000/api/projects/${projectId}/workflows/${type}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setSavedWorkflow(null);
    setStatuses("");
  };

  if (!projectId) return <h3>Select project first</h3>;

  return (
    <div className="workflow-page">

      <h2>Project Workflow Configuration</h2>

      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="Bug">Bug Workflow</option>
        <option value="TestCase">Test Case Workflow</option>
      </select>

      {/* Display Existing */}
      {savedWorkflow && !editing && (
        <div className="workflow-display">

          <h4>Current Workflow</h4>

          <div className="status-badges">
            {savedWorkflow.map(status => (
              <span key={status} className="status-badge">
                {status}
              </span>
            ))}
          </div>

          <div className="workflow-actions">
            <button onClick={() => setEditing(true)}>Edit</button>
            <button className="delete-btn" onClick={deleteWorkflow}>
              Delete
            </button>
          </div>

        </div>
      )}

      {/* Edit Mode */}
      {(!savedWorkflow || editing) && (
        <>
          <textarea
            placeholder="Enter statuses separated by comma
Example:
Open, Assigned, In Progress, Fixed, Closed"
            value={statuses}
            onChange={e => setStatuses(e.target.value)}
          />

          <button onClick={saveWorkflow}>
            Save Workflow
          </button>
        </>
      )}

    </div>
  );
}

export default ProjectWorkflow;