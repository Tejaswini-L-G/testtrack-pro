import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./execution.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


function ExecutionPage() {

    const navigate = useNavigate();
    const [executionId, setExecutionId] = useState(null);

const location = useLocation();
const params = new URLSearchParams(location.search);

const runId = params.get("runId");



  const { id } = useParams(); // testCaseId from URL

  const [testCase, setTestCase] = useState(null);
  const [stepsData, setStepsData] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const suiteId = params.get("suiteId");
const index = parseInt(params.get("index") || 0);

const [manualTime, setManualTime] = useState("");
const [running, setRunning] = useState(true); 
const formatTime = (totalSeconds) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${hrs.toString().padStart(2, "0")}:${
    mins.toString().padStart(2, "0")
  }:${secs.toString().padStart(2, "0")}`;
};
  

  /* ===============================
     LOAD TEST CASE
  =============================== */
useEffect(() => {

  let interval;

  if (running) {
    interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  }

  return () => clearInterval(interval);

}, [running]);



  useEffect(() => {

    fetch(`http://localhost:5000/api/testcases/${id}`)
      .then(res => res.json())
      .then(data => {

        setTestCase(data);

        const steps = data.steps.map(step => ({
          stepNumber: step.stepNumber,
          action: step.action,
          expected: step.expected,
          actual: "",
          status: ""
        }));

        setStepsData(steps);
      })
      .catch(() => alert("Failed to load test case"));

  }, [id]);


 useEffect(() => {

  const startExecution = async () => {

    if (!runId) return;

    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    const res = await fetch(
      "http://localhost:5000/api/executions/start",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testCaseId: id,
          userId: userId,
          testRunId: runId
        })
      }
    );

    const data = await res.json();

    if (!data?.id) {
      alert("Failed to start execution");
      return;
    }

    setExecutionId(data.id);
    console.log("Execution started:", data.id);

  };

  startExecution();

}, [id, runId]);
  /* ===============================
     UPDATE STEP DATA
  =============================== */

  const updateStep = (index, field, value) => {
    const updated = [...stepsData];
    updated[index][field] = value;
    setStepsData(updated);
  };

  /* ===============================
     SAVE PROGRESS
  =============================== */

  const saveProgress = async () => {

  await fetch("http://localhost:5000/api/executions/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      executionId,
      steps: stepsData,
    }),
  });

  alert("Progress Saved");
};




 const uploadEvidence = async (selectedFile, stepNumber) => {

  if (!selectedFile) return;

  if (selectedFile.size > 100 * 1024 * 1024) {
    alert("File too large (max 100MB)");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("testCaseId", id);
  formData.append("stepNumber", stepNumber);

  try {

    const res = await fetch(
      "http://localhost:5000/api/execution/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    console.log("Upload response status:", res.status);

    const data = await res.json();

    console.log("Upload response data:", data);

    if (res.ok) {
      alert("Evidence uploaded successfully ✅");
    } else {
      alert("Upload failed: " + (data.error || "Unknown error"));
    }

  } catch (err) {
    console.error("Upload error:", err);
    alert("Upload failed — server error");
  }
};
  /* ===============================
     COMPLETE EXECUTION
  =============================== */

const completeExecution = async () => {

  setRunning(false);

  // ⭐ Determine final status from steps
  const hasFail = stepsData.some(s => s.status === "Fail");
  const hasBlocked = stepsData.some(s => s.status === "Blocked");

  let finalStatus = "Passed";

  if (hasFail) finalStatus = "Failed";
  else if (hasBlocked) finalStatus = "Blocked";

  // Save progress
  await fetch("http://localhost:5000/api/execution/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      executionId,
      steps: stepsData
    }),
  });

  // ⭐ COMPLETE execution
  await fetch("http://localhost:5000/api/executions/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      executionId,
      finalStatus
    })
  });

  alert("Execution Completed Successfully ✅");
  navigate(-1);


// ⭐ Sequential suite flow
if (suiteId) {

 const res = await fetch(
  "http://localhost:5000/testcases",
  {
    headers: {
      Authorization:
        "Bearer " + localStorage.getItem("token"),
    },
  }
);

const data = await res.json();

// ⭐ Ensure array
const allCases = Array.isArray(data)
  ? data
  : data.testCases || data.data || [];

const suiteCases = allCases.filter(
  tc => tc.suiteId === suiteId
);

  const nextIndex = index + 1;

  if (nextIndex < suiteCases.length) {

    navigate(
      `/dashboard/execution/${suiteCases[nextIndex].id}` +
      `?suiteId=${suiteId}&index=${nextIndex}`
    );

    return;
  }

  alert("Suite execution completed 🎉");

 navigate(-1);

  return;
}
  

  navigate(-1);
};
  /* ===============================
     LOADING STATE
  =============================== */

if (!testCase) {
  return <h2 style={{ padding: "20px" }}>Loading...</h2>;
}

if (!stepsData || stepsData.length === 0) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>No steps found for this test case</h2>
    </div>
  );
}

const step =
  stepsData.length > 0
    ? stepsData[currentStep]
    : null;
  /* ===============================
     UI
  =============================== */

  return (
    <div className="execution-container">

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1 className="execution-title">
        Execute Test Case — {testCase.title}
      </h1>


<div className="timer-box">

  <div className="timer-left">

    <h3>Execution Timer</h3>

    <div className="timer-display">
      {formatTime(seconds)}
    </div>

    <div className="timer-controls">

      <button onClick={() => setRunning(!running)}>
        {running ? "Pause" : "Resume"}
      </button>

      <button onClick={() => setSeconds(0)}>
        Reset
      </button>

    </div>

  </div>

  {/* RIGHT SIDE — MANUAL TIME */}

  <div className="timer-right">

    <label>Manual Time (seconds)</label>

    <div className="manual-input-group">

      <input
        type="number"
        placeholder="Enter seconds"
        value={manualTime}
        onChange={(e) => setManualTime(e.target.value)}
      />

      <button
        onClick={() => setSeconds(Number(manualTime))}
      >
        Apply
      </button>

    </div>

  </div>

</div>


      <div className="progress-bar">
        Step {currentStep + 1} of {stepsData.length}
      </div>

     {/* STEP CARD */}

<div className="step-card">

  {step ? (

    <>
      {/* HEADER */}
      <div className="step-header">
        Step {step.stepNumber}
      </div>

      {/* BODY */}
      <div className="step-body">

        <div className="step-block">
          <label>Action</label>
          <div className="step-box">
            {step.action}
          </div>
        </div>

        <div className="step-block">
          <label>Expected Result</label>
          <div className="step-box expected">
            {step.expected}
          </div>
        </div>

        <div className="step-block">
          <label>Actual Result</label>

          <textarea
            className="actual-input"
            placeholder="Enter what actually happened..."
            value={step.actual}
            onChange={(e) =>
              updateStep(currentStep, "actual", e.target.value)
            }
          />
        </div>

        {/* UPLOAD */}
        <label className="upload-btn">
          Upload Evidence
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.mp4,.txt,.log,.har"
            onChange={(e) => {
              const file = e.target.files[0];
              uploadEvidence(file, step?.stepNumber);
            }}
          />
        </label>

        {/* STATUS BUTTONS */}
        <div className="status-buttons">

          {["Pass", "Fail", "Blocked", "Skipped"].map(status => (

            <button
              key={status}
              className={`status-btn ${status.toLowerCase()} ${
                step.status === status ? "active" : ""
              }`}
              onClick={() =>
                updateStep(currentStep, "status", status)
              }
            >
              {status}
            </button>

          ))}

          {/* BUG REPORT */}
          <button
            className="bug-btn"
            onClick={() => {

              updateStep(currentStep, "status", "Fail");

              navigate(
                `/dashboard/bug-report?` +
                `testCaseId=${id}` +
                `&runId=${runId}` +
                `&step=${step?.stepNumber || 1}` +
                `&action=${encodeURIComponent(step?.action || "")}` +
                `&expected=${encodeURIComponent(step?.expected || "")}`
              );

            }}
          >
            🐞 Fail & Report Bug
          </button>

        </div>

      </div>
    </>

  ) : (

    <div className="no-steps">
      <h3>No steps available for this test case</h3>
      <p>This test case cannot be executed.</p>
    </div>

  )}

</div>
      {/* NAVIGATION */}

      <div className="step-navigation">

        <button
          disabled={currentStep === 0}
          onClick={() =>
            setCurrentStep(currentStep - 1)
          }
        >
          Previous
        </button>

        {currentStep < stepsData.length - 1 ? (

          <button
            onClick={() =>
              setCurrentStep(currentStep + 1)
            }
          >
            Next Step
          </button>

        ) : (

          <button
  className="complete-btn"
 
  onClick={completeExecution}
>
  Complete Execution
</button>
        )}

      </div>

      {/* SAVE BUTTON */}

      <div className="execution-footer">

        <button
          className="save-btn"
          onClick={saveProgress}
        >
          Save Progress
        </button>

      </div>

    </div>
  );
}

export default ExecutionPage;