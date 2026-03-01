import { useEffect, useState } from "react";
import "./Projects.css";

function ProjectCustomFields() {

  const projectId = localStorage.getItem("projectId");
  const token = localStorage.getItem("token");

  const [fields, setFields] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("text");
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
const [editName, setEditName] = useState("");



  const loadFields = async () => {
    if (!projectId) return;

    const res = await fetch(
      `http://localhost:5000/api/projects/${projectId}/custom-fields`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    setFields(data);
  };

  useEffect(() => {
    loadFields();
  }, [projectId]);

  const createField = async () => {

    if (!name.trim()) {
      setMessage("Field name is required");
      return;
    }

    await fetch(
      `http://localhost:5000/api/projects/${projectId}/custom-fields`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          type,
          required,
          options: (type === "select" || type === "select_free")
  ? options.split(",").map(o => o.trim())
  : null
        })
      }
    );

    setName("");
    setOptions("");
    setRequired(false);
    setMessage("Field created successfully ✅");

    loadFields();
  };

const deleteField = async (id) => {

  if (!window.confirm("Delete this field?")) return;

  await fetch(`http://localhost:5000/api/custom-fields/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  loadFields();
};

const updateField = async (field) => {

  await fetch(`http://localhost:5000/api/custom-fields/${field.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name: field.name,
      type: field.type,
      required: field.required,
      options: field.options ? JSON.parse(field.options) : null
    })
  });

  setEditingId(null);
  loadFields();
};


  if (!projectId) {
    return <h3>Please select a project first.</h3>;
  }

  return (
    <div className="custom-fields-page">

      <h2>Project Custom Fields</h2>

      <div className="field-form">

        <input
          placeholder="Field Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <select
  value={type}
  onChange={e => setType(e.target.value)}
>
  <option value="text">Text Input</option>
  <option value="number">Number</option>
  <option value="date">Date</option>
  <option value="select">Dropdown (Fixed)</option>
  <option value="select_free">Dropdown + Manual Entry</option>
</select>

       {(type === "select" || type === "select_free") && (
  <textarea
    placeholder="Enter options separated by comma
Example:
Android,iOS,Tablet"
    value={options}
    onChange={e => setOptions(e.target.value)}
  />
)}

        <label className="required-check">
          <input
            type="checkbox"
            checked={required}
            onChange={e => setRequired(e.target.checked)}
          />
          Required
        </label>

        <button onClick={createField}>
          Add Field
        </button>

      </div>

      {message && <div className="success-msg">{message}</div>}

      <div className="fields-list">

        <h3>Existing Fields</h3>

        {fields.length === 0 && (
  <p>No custom fields created yet.</p>
)}

        {fields.map(field => (

  <div key={field.id} className="field-card">

    {editingId === field.id ? (
      <>
        <input
          value={editName}
          onChange={e => setEditName(e.target.value)}
        />

        <button onClick={() => updateField(field.id)}>
          Save
        </button>

        <button onClick={() => setEditingId(null)}>
          Cancel
        </button>
      </>
    ) : (
      <>
        <strong>{field.name}</strong>
<span>({field.type})</span>

{field.options && (
  <div className="field-options">
    Options: {JSON.parse(field.options).join(", ")}
  </div>
)}
        <div className="field-actions">

          <button
            className="edit-btn"
            onClick={() => {
              setEditingId(field.id);
              setEditName(field.name);
            }}
          >
            Edit
          </button>

          <button
            className="delete-btn"
            onClick={() => deleteField(field.id)}
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

export default ProjectCustomFields;