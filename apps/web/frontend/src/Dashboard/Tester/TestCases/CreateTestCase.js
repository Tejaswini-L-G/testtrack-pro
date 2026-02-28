import { useState, useEffect } from "react";
import axios from "axios";
import "./CreateTestCase.css";


function CreateTestCase() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [module, setModule] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [severity, setSeverity] = useState("Major");
  const [type, setType] = useState("Functional");
 

  const projectId = localStorage.getItem("projectId");

useEffect(() => {
    if (!projectId) {
      setError("Please select a project first.");
    }
  }, [projectId]);

  // 🔹 Context section toggle





  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [changeLog, setChangeLog] = useState("");
  

const [showContext, setShowContext] = useState(false);

const [preconditions, setPreconditions] = useState("");
const [postconditions, setPostconditions] = useState("");
const [impactIfFails, setImpactIfFails] = useState("");
const [testDataRequirements, setTestDataRequirements] = useState("");
const [environment, setEnvironment] = useState("");
const [cleanupSteps, setCleanupSteps] = useState("");



  const [steps, setSteps] = useState([
    { action: "", testData: "", expected: "" },
  ]);

  const addStep = () => {
    setSteps([...steps, { action: "", testData: "", expected: "" }]);
  };


  const deleteStep = (indexToDelete) => {
  const updatedSteps = steps.filter((_, index) => index !== indexToDelete);
  setSteps(updatedSteps);
};

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    try {
      await axios.post(
        "http://localhost:5000/testcases",
        {
          title,
          description,
          module,
          priority,
          severity,
          type,
          status: "Draft",
          steps,
           preconditions,
  postconditions,
  impactIfFails,
  testDataRequirements,
  environment,
  cleanupSteps,
  projectId,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      setMessage("Test case created successfully.");
      setTimeout(() => setMessage(""), 3000);


      // Optional reset
      setTitle("");
      setDescription("");
      setModule("");
      setPriority("Medium");
      setSeverity("Major");
      setType("Functional");
      setSteps([{ action: "", testData: "", expected: "" }]);

    } catch (err) {
      setError("Failed to create test case. Please try again.");
    }
  };

  return (
    <div className="tc-container">
      <h2>Create Test Case</h2>

      {/* Basic Details */}
      <div className="tc-section">
        <div className="tc-field">
          <label>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        <div className="tc-field">
          <label>Description</label>
          <textarea
            rows="4"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="tc-grid">
          <div className="tc-field">
            <label>Module / Feature</label>
            <input value={module} onChange={e => setModule(e.target.value)} />
          </div>

          <div className="tc-field">
            <label>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="tc-field">
            <label>Severity</label>
            <select value={severity} onChange={e => setSeverity(e.target.value)}>
              <option>Blocker</option>
              <option>Critical</option>
              <option>Major</option>
              <option>Minor</option>
            </select>
          </div>

          <div className="tc-field">
            <label>Type</label>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option>Functional</option>
              <option>Regression</option>
              <option>Smoke</option>
              <option>Integration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Test Steps */}
      <div className="tc-section">
        <h3>Test Steps</h3>

        {steps.map((step, index) => (
          <div className="tc-step" key={index}>
            <div className="step-number">Step {index + 1}</div>

            <input
              placeholder="Action"
              value={step.action}
              onChange={e => {
                const updated = [...steps];
                updated[index].action = e.target.value;
                setSteps(updated);
              }}
            />

            <input
              placeholder="Test Data"
              value={step.testData}
              onChange={e => {
                const updated = [...steps];
                updated[index].testData = e.target.value;
                setSteps(updated);
              }}
            />

            <input
              placeholder="Expected Result"
              value={step.expected}
              onChange={e => {
                const updated = [...steps];
                updated[index].expected = e.target.value;
                setSteps(updated);
              }}
            />

{/* DELETE BUTTON */}
    {steps.length > 1 && (
      <button
        className="btn-delete"
        onClick={() => deleteStep(index)}
      >
        Delete
      </button>
    )}

          </div>
        ))}

        <button className="btn-secondary" onClick={addStep}>
          Add Step
        </button>
      </div>

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
        <textarea
  value={impactIfFails}
  onChange={(e) => setImpactIfFails(e.target.value)}
  rows={3}
/>
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
       <textarea
  value={testDataRequirements}
  onChange={(e) => setTestDataRequirements(e.target.value)}
  rows={3}
/>
      </div>

      <div className="tc-field">
        <label>Environment Requirements</label>
        <textarea
  value={environment}
  onChange={(e) => setEnvironment(e.target.value)}
  rows={3}
/>
      </div>

      <div className="tc-field">
        <label>Cleanup Steps</label>
        <textarea
  value={cleanupSteps}
  onChange={(e) => setCleanupSteps(e.target.value)}
  rows={3}
/>
      </div>

    </div>
  </div>
)}


      {/* Submit */}
      <div className="tc-actions">
        <button className="btn-primary" onClick={handleSubmit}>
          Create Test Case
        </button>
      </div>

      {/* Messages */}
      {message && <div className="tc-success">{message}</div>}
      {error && <div className="tc-error">{error}</div>}
    </div>
  );
}

export default CreateTestCase;
