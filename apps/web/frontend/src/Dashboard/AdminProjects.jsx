import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminProjects() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);

  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const token = localStorage.getItem("token");

  const loadProjects = async () => {
    const res = await fetch(
      "http://localhost:5000/api/admin/projects",
      {
        headers: { Authorization: "Bearer " + token }
      }
    );
    const data = await res.json();
    setProjects(data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ===== CREATE ===== */

  const createProject = async () => {

    await fetch(
      "http://localhost:5000/api/admin/projects",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ name, description })
      }
    );

    alert("Project created ✅");
    setName("");
    setDescription("");
    loadProjects();
  };

  /* ===== DELETE ===== */

  const deleteProject = async (id) => {

    if (!window.confirm("Delete this project?")) return;

    await fetch(
      `http://localhost:5000/api/admin/projects/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
      }
    );

    loadProjects();
  };

  /* ===== ARCHIVE ===== */

  const toggleArchive = async (id) => {

    await fetch(
      `http://localhost:5000/api/admin/projects/${id}/archive`,
      {
        method: "PUT",
        headers: { Authorization: "Bearer " + token }
      }
    );

    loadProjects();
  };

  /* ===== EDIT ===== */

  const openEdit = (p) => {
    setEditing(p.id);
    setEditName(p.name);
    setEditDesc(p.description || "");
  };

  const saveEdit = async (id) => {

    await fetch(
      `http://localhost:5000/api/admin/projects/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          name: editName,
          description: editDesc
        })
      }
    );

    setEditing(null);
    loadProjects();
  };

  return (
    <div className="admin-projects-page">

      <h2>Manage Projects</h2>

      {/* ===== CREATE FORM ===== */}

      <div className="project-form">

        <input
          placeholder="Project Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <textarea
          placeholder="Project Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <button onClick={createProject}>
          Create Project
        </button>

      </div>

      {/* ===== PROJECT CARDS ===== */}

      <div className="projects-grid">

        {projects.map(p => (

          <div
            key={p.id}
            className={`project-card ${!p.active ? "archived" : ""}`}
          >

            {editing === p.id ? (
              <>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />

                <textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                />

                <div className="card-actions">
                  <button
                    className="save-btn"
                    onClick={() => saveEdit(p.id)}
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>{p.name}</h3>

                <p className="desc">
                  {p.description || "No description"}
                </p>

                <div className="status">
                  {p.active ? "Active" : "Archived"}
                </div>

                <div className="card-actions">

                  <button
                    className="edit-btn"
                    onClick={() => openEdit(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="archive-btn"
                    onClick={() => toggleArchive(p.id)}
                  >
                    {p.active ? "Archive" : "Activate"}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteProject(p.id)}
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

export default AdminProjects;