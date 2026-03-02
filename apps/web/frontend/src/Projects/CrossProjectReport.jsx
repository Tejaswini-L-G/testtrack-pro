import { useEffect, useState } from "react";
import "./Projects.css";

function CrossProjectReport() {

  const [data, setData] = useState(null);

  useEffect(() => {

    fetch("http://localhost:5000/api/admin/reports/cross-project", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(setData)
      .catch(() => alert("Failed to load report"));

  }, []);

  if (!data) return <h2>Loading Cross Project Report...</h2>;

  return (
    <div className="cross-project-page">

      <h2>Cross Project Overview</h2>

      {/* GLOBAL STATS */}
      <div className="stats-grid">

        <div className="stat-card">
          <span>Total Projects</span>
          <strong>{data.totalProjects}</strong>
        </div>

        <div className="stat-card">
          <span>Total Test Cases</span>
          <strong>{data.totalTestCases}</strong>
        </div>

        <div className="stat-card">
          <span>Total Test Runs</span>
          <strong>{data.totalRuns}</strong>
        </div>

        <div className="stat-card">
          <span>Total Bugs</span>
          <strong>{data.totalBugs}</strong>
        </div>

      </div>

      {/* PER PROJECT COMPARISON */}
      <h3>Project Comparison</h3>

      <div className="project-comparison">

        {data.projectSummary.map(p => (

          <div key={p.id} className="project-summary-card">

            <h4>{p.name}</h4>

            <p>Test Cases: {p._count.testCases}</p>
            <p>Test Runs: {p._count.testRuns}</p>
            <p>Bugs: {p._count.bugs}</p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default CrossProjectReport;