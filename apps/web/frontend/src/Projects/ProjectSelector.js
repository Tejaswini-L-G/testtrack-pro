import { useEffect, useState } from "react";

function ProjectSelector() {

  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(
    localStorage.getItem("projectId") || ""
  );

  const token = localStorage.getItem("token");

  useEffect(() => {

    if (!token) return;

    fetch("http://localhost:5000/api/projects", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          console.error("API error:", text);
          return [];
        }
        return res.json();
      })
      .then(data => {
        setProjects(data);

        // Auto-select first project if none selected
        if (!selected && data.length > 0) {
          localStorage.setItem("projectId", data[0].id);
          setSelected(data[0].id);
          window.location.reload();
        }
      })
      .catch(err => console.error(err));

  }, []);

  const handleChange = (e) => {

    const projectId = e.target.value;

    localStorage.setItem("projectId", projectId);
    setSelected(projectId);

    window.location.reload();
  };

  return (
    <select value={selected} onChange={handleChange}>
      <option value="">Select Project</option>

      {projects.map(p => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}

    </select>
  );
}

export default ProjectSelector;