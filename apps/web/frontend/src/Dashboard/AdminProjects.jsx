import { useState } from "react";

function AdminProjects() {

  const [name, setName] = useState("");

  const createProject = async () => {

    await fetch(
      "http://localhost:5000/api/admin/projects",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      }
    );

    alert("Project created");
    setName("");
  };

  return (
    <div>

      <h2>Manage Projects</h2>

      <input
        placeholder="Project Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button onClick={createProject}>
        Create Project
      </button>

    </div>
  );
}

export default AdminProjects;