import { useEffect, useState } from "react";
import "./Projects.css";

function MilestoneDashboard() {

  const projectId = localStorage.getItem("projectId");
  const token = localStorage.getItem("token");
  const [runExecutions, setRunExecutions] = useState({});

  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
  if (!projectId) return;

  fetch(`http://localhost:5000/api/projects/${projectId}/milestones`, {
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => res.json())
    .then(async data => {

      const safeData = Array.isArray(data) ? data : data.milestones || [];
      setMilestones(safeData);

      // 🔥 Fetch executions for each test run
      const execMap = {};

      for (const ms of safeData) {
        for (const run of (ms.testRuns || [])) {

          const res = await fetch(
            `http://localhost:5000/api/testruns/${run.id}/executions`
          );

          const executions = await res.json();

          execMap[run.id] = executions;
        }
      }

      setRunExecutions(execMap);
    });

}, [projectId]);

 const calculateProgress = (milestone) => {

  let total = 0;
  let completed = 0;

  (milestone.testRuns || []).forEach(run => {

    const runExecs = runExecutions[run.id] || [];

    const runTotal = run.testCases?.length || 0;

    total += runTotal;

    completed += runExecs.filter(e => e.completedAt).length;

  });

  return total === 0 ? 0 : Math.round((completed / total) * 100);
};
  if (!projectId) return <h3>Select project first</h3>;

  return (
    <div className="milestone-view-page">

      <h2>Project Milestones</h2>

      {milestones.length === 0 && (
        <p>No milestones defined.</p>
      )}

      {milestones.map(ms => {

        const progress = calculateProgress(ms);

        return (
          <div key={ms.id} className="milestone-view-card">

           <h3>{ms.name}</h3>

<p>
  <strong>Target Date:</strong>{" "}
  {ms.targetDate
    ? new Date(ms.targetDate).toLocaleDateString()
    : "N/A"}
</p>

<p>
  <strong>Target Pass Rate:</strong> {ms.targetPassRate ?? 0}%
</p>



<p><strong>Current Pass Rate:</strong> {progress}%</p>

<div className="progress-bar">
  <div
    className="progress-fill"
    style={{ width: `${progress}%` }}
  />
</div>

<p>
  <strong>Status:</strong>
  <span
    className={`milestone-status ${
      (ms.health || "unknown")
        .toLowerCase()
        .replace(" ", "-")
    }`}
  >
    {ms.health || "Unknown"}
  </span>
</p>



            

          </div>
        );
      })}

    </div>
  );
}

export default MilestoneDashboard;