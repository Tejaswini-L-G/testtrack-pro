import { useEffect, useState } from "react";
import "./Templates.css";

function TemplatesList() {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState("");
const [category, setCategory] = useState("");



  

  useEffect(() => {
    fetch("http://localhost:5000/templates", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(() => console.error("Failed to fetch templates"));
         fetchCategories();
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

const fetchCategories = async () => {
  const res = await fetch("http://localhost:5000/templates/categories", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  const data = await res.json();
  setCategories(data);
};

const fetchTemplates = async (category = "") => {
  const url = category
    ? `http://localhost:5000/templates?category=${category}`
    : "http://localhost:5000/templates";

  const res = await fetch(url, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  const data = await res.json();
  setTemplates(data);
};
const handleCategoryChange = (e) => {
  const category = e.target.value;
  setSelectedCategory(category);

  if (category === "All") {
    fetchTemplates();
  } else {
    fetchTemplates(category);
  }
};

const handleCategoryUpdate = async (id, category) => {
  try {
    const res = await fetch(
      `http://localhost:5000/templates/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ category }),
      }
    );

    const data = await res.json();

    // Update UI with DB value
    setTemplates(prev =>
      prev.map(t =>
        t.id === id ? { ...t, category: data.category } : t
      )
    );

  } catch (err) {
    console.error("Category update failed");
  }
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
            <th>Category</th> 
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(t => (
            <tr key={t.id}>
              <td>{t.name}</td>

<td>
  <span className="category-badge">
    {t.category || "General"}
  </span>
</td>

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

  

<select
  value={t.category || "General"}
  onChange={(e) =>
    handleCategoryUpdate(t.id, e.target.value)
  }
>
  <option>Login Tests</option>
  <option>CRUD Operations</option>
  <option>API Tests</option>
  <option>UI Tests</option>
  <option>Regression</option>
  <option>General</option>
</select>


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
