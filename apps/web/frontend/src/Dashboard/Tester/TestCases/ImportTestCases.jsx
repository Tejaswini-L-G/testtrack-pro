import { useState } from "react";
import "./Import.css";
import { useNavigate } from "react-router-dom";

function ImportTestCases() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);

  // 🔹 Preview for CSV / Excel
  const handlePreview = async () => {
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      "http://localhost:5000/testcases/import/preview",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Preview failed");
      return;
    }

    setPreview(Array.isArray(data.preview) ? data.preview : []);
  };

  // 🔹 Confirm import
 const handleConfirm = async () => {
  const res = await fetch(
    "http://localhost:5000/testcases/import/confirm",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ testCases: preview }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Import failed");
    return;
  }

  alert(data.message || "Import successful");

  // ⭐ Redirect to Test Cases page
  navigate("/testcases");
};

  // 🔹 File selection handler
  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // 🧾 JSON → preview immediately
    if (selectedFile.name.endsWith(".json")) {
      try {
        const text = await selectedFile.text();
        const jsonData = JSON.parse(text);

        setPreview(Array.isArray(jsonData) ? jsonData : [jsonData]);
        setFile(null);

      } catch {
        alert("Invalid JSON file format");
      }

      return;
    }

    // 📄 CSV / Excel → use preview API
    setFile(selectedFile);
    setPreview([]);
  };

  return (
    <div className="import-container">
      <h2>Import Test Cases</h2>

      <input
        type="file"
        accept=".csv, .xlsx, .json"
        onChange={handleFileSelect}
      />

      {/* Preview button only needed for CSV/Excel */}
      <button
        className="btn-primary"
        onClick={handlePreview}
        disabled={!file}
      >
        Preview
      </button>

      {/* Preview display */}
      {Array.isArray(preview) && preview.length > 0 && (
        <>
          <h3>Preview</h3>
          <pre>{JSON.stringify(preview, null, 2)}</pre>

          <button className="btn-primary" onClick={handleConfirm}>
            Confirm Import
          </button>
        </>
      )}
    </div>
  );
}

export default ImportTestCases;
