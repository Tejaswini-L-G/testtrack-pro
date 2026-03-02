import { useEffect, useState } from "react";
import "./Projects.css";

function ProjectEnvironments() {

  const projectId = localStorage.getItem("projectId");
  const token = localStorage.getItem("token");

  const [environments, setEnvironments] = useState([]);
  const [name, setName] = useState("");

  const loadEnvironments = async () => {
    const res = await fetch(
      `http://localhost:5000/api/projects/${projectId}/environments`,
      { headers: { Authorization: "Bearer " + token } }
    );
    const data = await res.json();
    setEnvironments(data);
  };

  useEffect(() => {
    if (projectId) loadEnvironments();
  }, [projectId]);

  const addEnvironment = async () => {
    await fetch(
      `http://localhost:5000/api/projects/${projectId}/environments`,
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
    loadEnvironments();
  };

  const deleteEnvironment = async (id) => {
    await fetch(`http://localhost:5000/api/environments/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });

    loadEnvironments();
  };

  if (!projectId) return <h3>Select project first</h3>;

  return (
    <div className="module-page">
      <h2>Project Environments</h2>

      <div className="env-form">
  <input
    placeholder="Environment Name"
    value={name}
    onChange={e => setName(e.target.value)}
  />
  <button onClick={addEnvironment}>
    Add Environment
  </button>
</div>

      <div className="module-list">
        {environments.map(env => (
          <div key={env.id}>
            {env.name}
            <button onClick={() => deleteEnvironment(env.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectEnvironments;