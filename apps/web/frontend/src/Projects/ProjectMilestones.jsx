import { useEffect, useState } from "react";
import "./Projects.css";

function ProjectMilestones() {

  const projectId = localStorage.getItem("projectId");
  const token = localStorage.getItem("token");

  const [milestones, setMilestones] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [targetPassRate, setTargetPassRate] = useState("");
  const [editingId, setEditingId] = useState(null);
const [editData, setEditData] = useState({});

  const loadMilestones = async () => {
    const res = await fetch(
      `http://localhost:5000/api/projects/${projectId}/milestones`,
      { headers: { Authorization: "Bearer " + token } }
    );

    const data = await res.json();
    setMilestones(data);
  };

  useEffect(() => {
    if (projectId) loadMilestones();
  }, [projectId]);

  const createMilestone = async () => {

    await fetch(
      `http://localhost:5000/api/projects/${projectId}/milestones`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          name,
          description,
          targetDate,
          targetPassRate
        })
      }
    );

    setName("");
    setDescription("");
    setTargetDate("");
    setTargetPassRate("");

    loadMilestones();
  };

  const deleteMilestone = async (id) => {
    await fetch(`http://localhost:5000/api/milestones/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });

    loadMilestones();
  };

  if (!projectId) return <h3>Select project first</h3>;

  return (
    <div className="milestone-page">

      <h2>Project Milestones</h2>

      <div className="milestone-form">

        <input
          placeholder="Milestone Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          type="date"
          value={targetDate}
          onChange={e => setTargetDate(e.target.value)}
        />

        <input
          type="number"
          placeholder="Target Pass %"
          value={targetPassRate}
          onChange={e => setTargetPassRate(e.target.value)}
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <button onClick={createMilestone}>
          Add Milestone
        </button>

      </div>

      <div className="milestone-list">

  {milestones.map((ms) => (

    <div key={ms.id} className="milestone-card">

      {editingId === ms.id ? (

        <>
          <input
            value={editData.name}
            onChange={e => setEditData({...editData, name: e.target.value})}
          />

          <input
            type="date"
            value={editData.targetDate}
            onChange={e => setEditData({...editData, targetDate: e.target.value})}
          />

          <input
            type="number"
            value={editData.targetPassRate}
            onChange={e => setEditData({...editData, targetPassRate: e.target.value})}
          />

          <textarea
            value={editData.description || ""}
            onChange={e => setEditData({...editData, description: e.target.value})}
          />

          <div className="milestone-actions">
            <button
              onClick={async () => {
                await fetch(
                  `http://localhost:5000/api/milestones/${ms.id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + token
                    },
                    body: JSON.stringify(editData)
                  }
                );

                setEditingId(null);
                loadMilestones();
              }}
            >
              Save
            </button>

            <button onClick={() => setEditingId(null)}>
              Cancel
            </button>
          </div>
        </>

      ) : (

        <>
          <h3>{ms.name}</h3>

          <p><strong>Target Date:</strong> {new Date(ms.targetDate).toLocaleDateString()}</p>

          <p><strong>Target Pass Rate:</strong> {ms.targetPassRate}%</p>

          {ms.description && <p>{ms.description}</p>}

          <div className="milestone-actions">
            <button
              onClick={() => {
                setEditingId(ms.id);
                setEditData({
                  name: ms.name,
                  description: ms.description,
                  targetDate: ms.targetDate.split("T")[0],
                  targetPassRate: ms.targetPassRate
                });
              }}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => deleteMilestone(ms.id)}
            >
              Delete
            </button>
          </div>
        </>

      )}

    </div>

  ))}

</div>

    </div>
  );
}

export default ProjectMilestones;