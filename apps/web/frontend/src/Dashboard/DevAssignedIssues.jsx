import { useEffect, useState } from "react";
import "./Developer.css";
import BugComments from "../Bugs/BugComments";
import { useLocation } from "react-router-dom";

function DevAssignedIssues() {
  const location = useLocation();

  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [priorityFilter, setPriorityFilter] = useState("All");
const [severityFilter, setSeverityFilter] = useState("All");
const [statusFilter, setStatusFilter] = useState("All");
const [sortBy, setSortBy] = useState("Newest");

const [selectedBug, setSelectedBug] = useState(null);
const [fixNotes, setFixNotes] = useState("");
const [commitLink, setCommitLink] = useState("");
const [resolutionNote, setResolutionNote] = useState("");
const [resolutionMode, setResolutionMode] = useState("");
const [openDiscussion, setOpenDiscussion] = useState({});
 const [searchResults, setSearchResults] = useState(null);
 const [issues, setIssues] = useState([]);
 const [branchName, setBranchName] = useState("");


useEffect(() => {
  if (searchResults?.bugs?.length > 0) {

    const searchedIds = searchResults.bugs.map(b => b.id);

    const prioritized = [
      ...issues.filter(b => searchedIds.includes(b.id)),
      ...issues.filter(b => !searchedIds.includes(b.id))
    ];

    setIssues(prioritized);
  }
}, [searchResults]);

  useEffect(() => {

    const loadAssigned = async () => {

      try {

        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const developerId = payload.id;

        const res = await fetch(
          `http://localhost:5000/api/bugs/assigned/${developerId}`,
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        );

        const data = await res.json();

        setBugs(data);

      } catch (err) {
        console.error(err);
        alert("Failed to load assigned issues");
      }

      setLoading(false);

    };

    loadAssigned();

  }, []);


 useEffect(() => {

  const params = new URLSearchParams(location.search);
  const highlightId = params.get("highlight");
  const shouldOpen = params.get("openDiscussion");

  if (highlightId && bugs.length > 0) {

    const element = document.getElementById(highlightId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("highlight-bug");

      setTimeout(() => {
        element.classList.remove("highlight-bug");
      }, 3000);
    }

    // 🔥 AUTO OPEN DISCUSSION
    if (shouldOpen === "true") {
      setOpenDiscussion(prev => ({
        ...prev,
        [highlightId]: true
      }));
    }

  }

}, [bugs, location.search]);
  const updateStatus = async (bugId, status, extra = {}) => {

  const token = localStorage.getItem("token");

  try {

    const res = await fetch(
      `http://localhost:5000/api/bugs/${bugId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ status, ...extra })
      }
    );

    if (!res.ok) {
  const text = await res.text();
  alert(text || "Update failed");
  return;
}

    setBugs(prev =>
      prev.map(b =>
        b.id === bugId ? { ...b, status } : b
      )
    );

   alert("Bug updated successfully ✅");

setSelectedBug(null);
setFixNotes("");
setCommitLink("");
setResolutionNote("");
setResolutionMode("");
setBranchName("");

// 🔥 Refresh list
window.location.reload();

  } catch (err) {
    console.error(err);
    alert("Failed to update bug");
  }
};
  if (loading) return <p>Loading issues...</p>;

  let filteredBugs = bugs
  .filter(b =>
    (priorityFilter === "All" || b.priority === priorityFilter) &&
    (severityFilter === "All" || b.severity === severityFilter) &&
    (statusFilter === "All" || b.status === statusFilter)
  );

if (sortBy === "Newest") {
  filteredBugs.sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
}

if (sortBy === "Oldest") {
  filteredBugs.sort((a, b) =>
    new Date(a.createdAt) - new Date(b.createdAt)
  );
}

if (sortBy === "Priority") {
  const order = { High: 1, Medium: 2, Low: 3 };
  filteredBugs.sort((a, b) =>
    (order[a.priority] || 9) - (order[b.priority] || 9)
  );
}

  return (
    <div className="dev-issues-container">

      

        <div className="dev-header">

  <h2>Assigned Issues</h2>

  <div className="export-group">

    <button
      className="export-btn"
      onClick={() => {

        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));

        window.open(
          `http://localhost:5000/api/bugs/export/excel/${payload.id}`
        );
      }}
    >
      Export Excel
    </button>

    <button
      className="export-btn pdf"
      onClick={() => {

        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));

        window.open(
          `http://localhost:5000/api/bugs/export/pdf/${payload.id}`
        );
      }}
    >
      Export PDF
    </button>






  <button
    className="export-btn"
    onClick={() => {

      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const developerId = payload.id;

      window.open(
        `http://localhost:5000/api/bugs/export/assigned/${developerId}`
      );

    }}
  >
    Export My Issues
  </button>

</div>

  </div>

      <div className="dev-filter-bar">

  <select onChange={e => setPriorityFilter(e.target.value)}>
    <option value="All">Priority: All</option>
    <option>High</option>
    <option>Medium</option>
    <option>Low</option>
  </select>

  <select onChange={e => setSeverityFilter(e.target.value)}>
    <option value="All">Severity: All</option>
    <option>Critical</option>
    <option>High</option>
    <option>Medium</option>
    <option>Low</option>
  </select>

  <select onChange={e => setStatusFilter(e.target.value)}>
    <option value="All">Status: All</option>
    <option>Open</option>
    <option>In Progress</option>
    <option>Fixed</option>
    <option>Reopened</option>
    <option>Closed</option>
  </select>

  <select onChange={e => setSortBy(e.target.value)}>
    <option value="Newest">Sort: Newest</option>
    <option value="Oldest">Oldest</option>
    <option value="Priority">Priority</option>
  </select>

</div>

      {bugs.length === 0 ? (
        <p>No issues assigned to you</p>
      ) : (

       filteredBugs.map(bug => (

         <div key={bug.id} id={bug.id} className="issue-card">

            {/* HEADER */}
            <div className="bug-header">

              <h3>{bug.title}</h3>

              <span className={`status-badge ${bug.status?.toLowerCase()}`}>
                {bug.status}
              </span>

            </div>

            {/* BODY */}
            <div className="bug-body">

              <p><strong>Description:</strong> {bug.description}</p>

              <p><strong>Severity:</strong> {bug.severity}</p>

              <p><strong>Priority:</strong> {bug.priority}</p>

              <p><strong>Test Case:</strong> {bug.testCaseId || "—"}</p>

              <p><strong>Run:</strong> {bug.runId || "Standalone"}</p>

              <p>
                <strong>Reported By:</strong>{" "}
                {bug.reportedBy?.name || "Unknown"}
              </p>

              <p>
                <strong>Reported At:</strong>{" "}
                {new Date(bug.createdAt).toLocaleString()}
              </p>

              {bug.evidencePath && (
                <p>
                  <strong>Evidence:</strong>{" "}
                  <a
                    href={`http://localhost:5000/${bug.evidencePath}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Attachment
                  </a>
                </p>
              )}


<button
  className="discussion-btn"
  onClick={() =>
    setOpenDiscussion(prev => ({
      ...prev,
      [bug.id]: !prev[bug.id]
    }))
  }
>
  {openDiscussion[bug.id]
    ? "Hide Discussion"
    : "View Discussion"}
</button>

{openDiscussion[bug.id] && (
  <div className="discussion-panel">
    <BugComments bugId={bug.id} />
  </div>
)}
            </div>

            {/* ACTION BUTTONS */}
           <div className="bug-actions">

  {(bug.status === "Open" || bug.status === "Reopened") && (
  <button
    className="btn-progress"
    onClick={() => updateStatus(bug.id, "In Progress")}
  >
    Start Work
  </button>
)}

  {bug.status === "In Progress" && (
    <button
      className="btn-fixed"
    onClick={() => {
  setSelectedBug(bug.id);
  setResolutionMode("Fixed");
}}
    >
      Mark Fixed
    </button>
  )}

  {(bug.status === "Open" || bug.status === "Reopened") && (
    <button
      className="btn-reject"
     onClick={() => {
  setSelectedBug(bug.id);
  setResolutionMode("Won't Fix");
}}
    >
      Won't Fix
    </button>
  )}

</div>
          </div>

        ))

      )}


      {selectedBug && (

  <div className="resolution-overlay">
    <div className="resolution-modal">

      <h3>
        {resolutionMode === "Fixed"
          ? "Submit Fix Details"
          : "Provide Rejection Reason"}
      </h3>

      <label>Fix Notes</label>
      <textarea
        rows="4"
        value={fixNotes}
        onChange={e => setFixNotes(e.target.value)}
      />

      <label>Commit Link / ID</label>
      <input
        value={commitLink}
        onChange={e => setCommitLink(e.target.value)}
        placeholder="abc123def or Git URL"
      />

      <label>Branch Name</label>
<input
  value={branchName}
  onChange={e => setBranchName(e.target.value)}
  placeholder="fix/login-validation"
/>

      <label>Resolution Reason (if Won't Fix)</label>
      <textarea
        rows="3"
        value={resolutionNote}
        onChange={e => setResolutionNote(e.target.value)}
      />

      <div className="resolution-actions">
        <button
          className="btn-save"
          onClick={() =>
            updateStatus(selectedBug, resolutionMode, {
              fixNotes,
              commitLink,
              branchName,
              resolutionNote
            })
          }
        >
          Submit
        </button>

        <button
          className="btn-cancel"
          onClick={() => {
            setSelectedBug(null);
            setFixNotes("");
            setCommitLink("");
            setResolutionNote("");
            setBranchName("");
          }}
        >
          Cancel
        </button>
      </div>

    </div>
  </div>

)}

    </div>
  );
}

export default DevAssignedIssues;