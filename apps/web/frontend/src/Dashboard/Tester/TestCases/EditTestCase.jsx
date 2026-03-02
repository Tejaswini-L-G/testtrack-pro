import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TestCaseForm from "./TestCaseForm";
import "./EditTestCase.css";

function EditTestCase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testCase, setTestCase] = useState(null);
   
  const [changeLog, setChangeLog] = useState("");

 useEffect(() => {
  const fetchTestCase = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/testcases/${id}`,
        {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();
      setTestCase(data);
    } catch (err) {
      console.error("Failed to fetch test case");
    }
  };

  fetchTestCase();
}, [id]);


  const handleUpdate = async (data) => {

    // ⭐ Require change summary
    if (!changeLog.trim()) {
      alert("Change summary is required");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/testcases/${id}`,
        {
          ...data,
          changeLog, // ⭐ send summary
        },
        {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      alert("Test case updated successfully.");
      navigate("/testcases");

    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  if (!testCase) return <div>Loading...</div>;


  return (
  <div className="edit-page">

    <div className="edit-card">

      <h1 className="edit-title">Edit Test Case</h1>

      {/* Change Summary */}
      <div className="summary-section">

        <label>Change Summary *</label>

        <textarea
          value={changeLog}
          onChange={(e) => setChangeLog(e.target.value)}
          placeholder="Describe what changed in this version"
          required
        />

        <div className="summary-help">
          Briefly describe what was modified in this update.
        </div>

      </div>

      {/* Your existing reusable form */}
      <TestCaseForm
        initialData={testCase}
        onSubmit={handleUpdate}
        isEdit
      />

    </div>
  </div>
);

}

export default EditTestCase;
