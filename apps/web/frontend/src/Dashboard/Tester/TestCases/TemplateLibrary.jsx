import { useEffect, useState } from "react";

function TemplateLibrary() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/templates/categories", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    setCategories(data);
  };

  const fetchTemplates = async (category) => {
    const res = await fetch(
      `http://localhost:5000/templates?category=${category}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const data = await res.json();
    setTemplates(data);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    fetchTemplates(category);
  };

  return (
    <div>
      <h2>Template Library</h2>

      {/* Category Dropdown */}
      <select onChange={handleCategoryChange} defaultValue="">
        <option value="" disabled>Select Category</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Templates List */}
      <div style={{ marginTop: "20px" }}>
        {templates.map((t) => (
          <div key={t.id} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 10 }}>
            <h4>{t.name}</h4>
            <p>{t.description}</p>
            <p><b>Module:</b> {t.module}</p>
            <p><b>Priority:</b> {t.priority}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplateLibrary;
