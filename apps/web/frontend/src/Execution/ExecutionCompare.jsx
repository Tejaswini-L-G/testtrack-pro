import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./execution.css";
import { useNavigate } from "react-router-dom";

function ExecutionCompare() {
   const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const prevId = params.get("prev");
  const currentId = params.get("current");

  const [prevExecution, setPrevExecution] = useState(null);
  const [currentExecution, setCurrentExecution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!prevId || !currentId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {

      try {

        const [prevRes, currRes] = await Promise.all([
          fetch(`http://localhost:5000/api/executions/${prevId}`),
          fetch(`http://localhost:5000/api/executions/${currentId}`)
        ]);

        const prevData = await prevRes.json();
        const currData = await currRes.json();

        setPrevExecution(prevData);
        setCurrentExecution(currData);

      } catch {
        alert("Failed to load comparison");
      }

      setLoading(false);
    };

    fetchData();

  }, [prevId, currentId]);

  /* ---------- LOADING STATES ---------- */

  if (loading) {
    return <div className="loading">Loading comparison...</div>;
  }

  if (!prevId || !currentId) {
    return (
      <div className="loading">
        Invalid comparison request
      </div>
    );
  }

  if (!prevExecution || !currentExecution) {
    return (
      <div className="loading">
        Execution data not found
      </div>
    );
  }

  /* ---------- UI ---------- */

  return (
    <div className="compare-page">

       <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h2 className="compare-title">
        Execution Comparison
      </h2>

      <div className="compare-grid">

        {/* PREVIOUS */}

        <div className="compare-card">

          <h3>Previous Execution</h3>

          <p><strong>Status:</strong> {prevExecution.status}</p>

          <p>
            <strong>Completed:</strong>{" "}
            {prevExecution.completedAt
              ? new Date(prevExecution.completedAt).toLocaleString()
              : "In Progress"}
          </p>

          {prevExecution.steps?.map(step => (
            <div key={step.id} className="step-block">
              <p><strong>Step {step.stepNumber}</strong></p>
              <p>Status: {step.status}</p>
              <p>Actual: {step.actual || "—"}</p>
            </div>
          ))}

        </div>

        {/* CURRENT */}

        <div className="compare-card">

          <h3>Current Execution</h3>

          <p><strong>Status:</strong> {currentExecution.status}</p>

          <p>
            <strong>Completed:</strong>{" "}
            {currentExecution.completedAt
              ? new Date(currentExecution.completedAt).toLocaleString()
              : "In Progress"}
          </p>

          {currentExecution.steps?.map(step => (
            <div key={step.id} className="step-block">
              <p><strong>Step {step.stepNumber}</strong></p>
              <p>Status: {step.status}</p>
              <p>Actual: {step.actual || "—"}</p>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default ExecutionCompare;