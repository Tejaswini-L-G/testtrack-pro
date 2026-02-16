import { useEffect, useState } from "react";
import "./Templates.css";

function TemplatesList() {
  const [templates, setTemplates] = useState([]);

  

  useEffect(() => {
    fetch("http://localhost:5000/templates", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(() => console.error("Failed to fetch templates"));
  }, []);

  const handleCreateFromTemplate = async (id) => {
    await fetch(`http://localhost:5000/templates/${id}/create-testcase`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    alert("Test case created from template.");
  };

  const handleDeleteTemplate = async (id) => {
  if (!window.confirm("Are you sure you want to delete this template?"))
    return;

  await fetch(`http://localhost:5000/templates/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  setTemplates(templates.filter((t) => t.id !== id));
};

  

  return (
    <div className="templates-container">
      <h2>Test Case Templates</h2>

      <div className="templates-table-wrapper">
  <table className="templates-table">

        <thead>
          <tr>
            <th>Name</th>
            <th>Module</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(t => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.module}</td>
              <td>{t.priority}</td>
              <td>
                <td className="template-actions">
  <button
    className="btn-primary"
    onClick={() => handleCreateFromTemplate(t.id)}
  >
    Use
  </button>

  <button
    className="btn-danger"
    onClick={() => handleDeleteTemplate(t.id)}
  >
    Delete
  </button>
</td>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
    </div>
  );
}

export default TemplatesList;
