import React, { useState } from "react";

function StepCard({ step, executionId, onSave }) {

  const [actual, setActual] = useState("");
  const [status, setStatus] = useState("");

  const autoSave = async () => {
    await onSave({
      executionId,
      stepNumber: step.stepNumber,
      action: step.action,
      expected: step.expected,
      actual,
      status
    });
  };

  return (
    <div className="step-card">

      <h4>Step {step.stepNumber}</h4>
      <p><b>Action:</b> {step.action}</p>
      <p><b>Expected:</b> {step.expected}</p>

      <textarea
        placeholder="Actual Result"
        value={actual}
        onChange={(e) => {
          setActual(e.target.value);
          autoSave();
        }}
      />

      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          autoSave();
        }}
      >
        <option value="">Status</option>
        <option value="Pass">Pass</option>
        <option value="Fail">Fail</option>
        <option value="Blocked">Blocked</option>
        <option value="Skipped">Skipped</option>
      </select>

    </div>
  );
}

export default StepCard;