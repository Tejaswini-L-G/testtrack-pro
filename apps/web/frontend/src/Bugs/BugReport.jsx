import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./bug.css";

function BugReport() {

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const testCaseId = params.get("testCaseId");
  const runId = params.get("runId");
  const step = params.get("step");
  const action = params.get("action");
  const expected = params.get("expected");

  const [title, setTitle] = useState(
    `Failure in ${testCaseId} — Step ${step}`
  );

  const [description, setDescription] = useState(
`Step ${step} failed.

Action:
${action}

Expected:
${expected}

Actual:
`
  );

  const [severity, setSeverity] = useState("High");
  const [priority, setPriority] = useState("Medium");
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(false);

 const submitBug = async () => {

  setLoading(true);

  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = payload.id;

  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("severity", severity);
  formData.append("priority", priority);
  formData.append("testCaseId", testCaseId);
  formData.append("runId", runId);
  formData.append("stepNumber", step);
  formData.append("reportedById", userId); // ⭐ CRITICAL

  if (evidence) {
    formData.append("evidence", evidence);
  }

  try {

    const res = await fetch(
      "http://localhost:5000/api/bugs",
      {
        method: "POST",
        body: formData
      }
    );

    if (!res.ok) throw new Error("Submit failed");

    alert("Bug Report Created ✅");

    navigate("/dashboard/execution");

  } catch (err) {
    alert("Failed to submit bug");
  }

  setLoading(false);
};
  return (
    <div className="bug-fullscreen">

      <div className="bug-container">

        <h2>Create Bug Report</h2>

        <div className="bug-form">

          <label>Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <label>Description</label>
          <textarea
            rows="10"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <div className="bug-row">

            <div>
              <label>Severity</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value)}
              >
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div>
              <label>Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

          </div>

          {/* Evidence Upload */}

          <label>Attach Evidence (optional)</label>

          <input
            type="file"
            accept=".png,.jpg,.jpeg,.mp4,.log,.txt,.har"
            onChange={e =>
              setEvidence(e.target.files[0])
            }
          />

          <button
            className="submit-bug-btn"
            onClick={submitBug}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Bug"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default BugReport;