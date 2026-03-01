import { useEffect, useState } from "react";
import "./Projects.css";

function ProjectModules() {

  const projectId = localStorage.getItem("projectId");
  const token = localStorage.getItem("token");

  const [modules, setModules] = useState([]);
  const [name, setName] = useState("");

  const loadModules = async () => {
    const res = await fetch(
      `http://localhost:5000/api/projects/${projectId}/modules`,
      { headers: { Authorization: "Bearer " + token } }
    );
    const data = await res.json();
    setModules(data);
  };

  useEffect(() => {
    if (projectId) loadModules();
  }, [projectId]);

  const addModule = async () => {
    await fetch(
      `http://localhost:5000/api/projects/${projectId}/modules`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ name })
      }
    );

    setName("");
    loadModules();
  };

  const deleteModule = async (id) => {
    await fetch(`http://localhost:5000/api/modules/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });
    loadModules();
  };

  if (!projectId) return <h3>Select project first</h3>;

  return (
    <div className="module-page">
      <h2>Project Modules</h2>

      <input
        placeholder="Module Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={addModule}>Add Module</button>

      <div className="module-list">
        {modules.map(mod => (
          <div key={mod.id}>
            {mod.name}
            <button onClick={() => deleteModule(mod.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectModules;