import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Suites.css";

function SuiteExecute() {

  const { suiteId } = useParams();

const location = useLocation();
const params = new URLSearchParams(location.search);
const mode = params.get("mode") || "sequential";
const [currentIndex, setCurrentIndex] = useState(0);
const projectId = localStorage.getItem("projectId");

  const navigate = useNavigate();

  const [suite, setSuite] = useState(null);
  const [cases, setCases] = useState([]);

  useEffect(() => {

  const token = localStorage.getItem("token");

  const loadData = async () => {
    try {

      const suiteRes = await fetch(
        `http://localhost:5000/suites/${suiteId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!suiteRes.ok) {
        throw new Error("Failed to load suite");
      }

      const suiteData = await suiteRes.json();
      setSuite(suiteData);

    const tcRes = await fetch(
  `http://localhost:5000/testcases?projectId=${projectId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const tcData = await tcRes.json();

      setCases(tcData.filter(tc => tc.suiteId === suiteId));

    } catch (err) {
      console.error(err);
      alert("Failed to load suite");
    }
  };

  loadData();

}, [suiteId]);


// ===== REORDER FUNCTIONS =====

// Move case up
const moveUp = (index) => {

  if (index === 0) return;

  const updated = [...cases];

  [updated[index - 1], updated[index]] =
    [updated[index], updated[index - 1]];

  setCases(updated);
};

// Move case down
const moveDown = (index) => {

  if (index === cases.length - 1) return;

  const updated = [...cases];

  [updated[index + 1], updated[index]] =
    [updated[index], updated[index + 1]];

  setCases(updated);
};

// Save new order to backend
const saveOrder = async () => {

  try {

    await fetch(
      `http://localhost:5000/api/suites/${suiteId}/reorder`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderedIds: cases.map(c => c.id)
        })
      }
    );

    alert("Order saved successfully ✅");

  } catch (err) {
    console.error(err);
    alert("Failed to save order");
  }

};


const startSequentialExecution = () => {

  if (cases.length === 0) {
    alert("No test cases in suite");
    return;
  }

  const firstCase = cases[0];

  navigate(`/dashboard/execution/${firstCase.id}?suiteId=${suiteId}&index=0`);
};



  if (!suite) {
  return (
    <div className="suite-execute-page">
      <p>Loading suite...</p>
    </div>
  );
}

  return (
    <div className="suite-execute-page">

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h2>Execute Suite — {suite.name}</h2>

<p>
  Mode: <strong>{mode.toUpperCase()}</strong>
</p>

{mode === "sequential" && (

  <button
    className="execute-suite-btn"
    onClick={startSequentialExecution}
  >
    ▶ Start Sequential Execution
  </button>

  

)}

<button
  className="save-order-btn"
  onClick={saveOrder}
>
  💾 Save Order
</button>

      {cases.length === 0 && (
        <p>No test cases in this suite</p>
      )}

      {cases.map((tc, index) => (

        <div key={tc.id} className="execute-card">

          <div className="execute-info">

            <h3>{tc.testCaseId} — {tc.title}</h3>

            <p>{tc.module}</p>

            <span className={`badge ${tc.priority?.toLowerCase()}`}>
              {tc.priority}
            </span>

          </div>

          <div className="execute-actions">

            <button
              className="execute-btn"
              onClick={() =>
                 navigate(`/dashboard/execution/${tc.id}`)
              }
            >
              Execute
            </button>


  <button
    className="reorder-btn"
    onClick={() => moveUp(index)}
  >
    ↑
  </button>

  <button
    className="reorder-btn"
    onClick={() => moveDown(index)}
  >
    ↓
  </button>

          </div>

        </div>

      ))}

    </div>
  );
}

export default SuiteExecute;