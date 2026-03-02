import { useState } from "react";
import "./TestCaseForm.css";

function TestCaseForm({ initialData = {}, onSubmit, isEdit = false }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [module, setModule] = useState(initialData.module || "");
  const [priority, setPriority] = useState(initialData.priority || "Medium");
  const [severity, setSeverity] = useState(initialData.severity || "Major");
  const [type, setType] = useState(initialData.type || "Functional");
  const [status, setStatus] = useState(initialData.status || "Draft");
  const [showContext, setShowContext] = useState(false);
  const [changeLog, setChangeLog] = useState("");
  const [impact, setImpact] = useState(initialData.impactIfFails || "");
 

  const [preconditions, setPreconditions] = useState(
  initialData.preconditions || ""
);

const [postconditions, setPostconditions] = useState(
  initialData.postconditions || ""
);

const [impactIfFails, setImpactIfFails] = useState(
  initialData.impactIfFails || ""
);

const [testDataRequirements, setTestDataRequirements] = useState(
  initialData.testDataRequirements || ""
);

const [environment, setEnvironment] = useState(
  initialData.environment || ""
);

const [cleanupSteps, setCleanupSteps] = useState(
  initialData.cleanupSteps || ""
);



  const [steps, setSteps] = useState(
    initialData.steps && initialData.steps.length > 0
      ? initialData.steps
      : [{ action: "", testData: "", expected: "" }]
  );

  // 🔹 Add Step
  const addStep = () => {
    setSteps([...steps, { action: "", testData: "", expected: "" }]);
  };

  // 🔹 Remove Step
  const removeStep = (index) => {
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated);
  };

  // 🔹 Update Step Field
  const updateStep = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  // 🔹 Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      module,
      priority,
      severity,
      type,
      status,
      steps,
      preconditions,
  postconditions,
  impactIfFails,
  testDataRequirements,
  environment,
  cleanupSteps,
    };

    onSubmit(payload);
  };

  return (
    <div className="tc-form-container">
      <h2>{isEdit ? "Edit Test Case" : "Create Test Case"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Basic Details */}
        <div className="tc-form-section">
          <div className="tc-field">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="tc-field">
            <label>Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="tc-grid">
            <div className="tc-field">
              <label>Module</label>
              <input
                value={module}
                onChange={(e) => setModule(e.target.value)}
                required
              />
            </div>

            
            <div className="tc-field">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="tc-field">
              <label>Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option>Blocker</option>
                <option>Critical</option>
                <option>Major</option>
                <option>Minor</option>
                <option>Trivial</option>
              </select>
            </div>

            <div className="tc-field">
              <label>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>Functional</option>
                <option>Regression</option>
                <option>Smoke</option>
                <option>Integration</option>
                <option>UAT</option>
                <option>Performance</option>
                <option>Security</option>
                <option>Usability</option>
              </select>
            </div>

            <div className="tc-field">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Draft</option>
                <option>Ready</option>
                <option>Approved</option>
                <option>Deprecated</option>
                <option>Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="tc-form-section">
          <h3>Test Steps</h3>

          {steps.map((step, index) => (
            <div className="tc-step-card" key={index}>
              <div className="step-header">
                <strong>Step {index + 1}</strong>
                {steps.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeStep(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                placeholder="Action"
                value={step.action}
                onChange={(e) =>
                  updateStep(index, "action", e.target.value)
                }
                required
              />

              <input
                placeholder="Test Data"
                value={step.testData || ""}
                onChange={(e) =>
                  updateStep(index, "testData", e.target.value)
                }
              />

              <input
                placeholder="Expected Result"
                value={step.expected}
                onChange={(e) =>
                  updateStep(index, "expected", e.target.value)
                }
                required
              />
            </div>
          ))}

          <button
            type="button"
            className="btn-secondary"
            onClick={addStep}
          >
            Add Step
          </button>
        </div>
{/* ===============================
   Execution / Test Context (BOTTOM)
================================ */}

<button
  type="button"
  className="context-toggle-btn"
  onClick={() => setShowContext(!showContext)}
>
  {showContext ? "Hide Test Context ▲" : "Show Test Context ▼"}
</button>

{showContext && (
  <div className="context-section">

    <h3>Execution & Test Context</h3>

    <div className="context-grid">

      <div className="tc-field">
        <label>Preconditions</label>
        <textarea
          value={preconditions}
          onChange={(e) => setPreconditions(e.target.value)}
          rows={3}
        />
      </div>

      <div className="tc-field">
        <label>Impact if Test Fails</label>
        <textarea rows={3} />
      </div>

      <div className="tc-field">
        <label>Postconditions</label>
        <textarea
          value={postconditions}
          onChange={(e) => setPostconditions(e.target.value)}
          rows={3}
        />
      </div>

      <div className="tc-field">
        <label>Test Data Requirements</label>
        <textarea rows={3} />
      </div>

      <div className="tc-field">
        <label>Environment Requirements</label>
        <textarea rows={3} />
      </div>

      <div className="tc-field">
        <label>Cleanup Steps</label>
        <textarea rows={3} />
      </div>

    </div>
  </div>
)}

       

        {/* Submit */}
        <div className="tc-actions">
          <button type="submit" className="btn-primary">
            {isEdit ? "Update Test Case" : "Create Test Case"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TestCaseForm;
