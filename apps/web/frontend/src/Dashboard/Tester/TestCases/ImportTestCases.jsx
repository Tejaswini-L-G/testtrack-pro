import { useState } from "react";
import "./Import.css";
import { useNavigate } from "react-router-dom";

function ImportTestCases() {
    const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);

  const handlePreview = async () => {
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
    setPreview(data.preview);
  };

  const handleConfirm = async () => {
    await fetch(
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

    alert("Import completed successfully.");
    
navigate("/testcases");

  };

  return (
    <div className="import-container">
      <h2>Import Test Cases</h2>

      <input
  type="file"
  accept=".csv, .xlsx"
  onChange={(e) => setFile(e.target.files[0])}
/>


      <button className="btn-primary" onClick={handlePreview}>
        Preview
      </button>

      {preview.length > 0 && (
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
