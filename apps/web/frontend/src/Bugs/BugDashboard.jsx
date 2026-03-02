import { useEffect, useState } from "react";
import "./bug.css";
import BugComments from "./BugComments";

function BugsList() {

  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [developers, setDevelopers] = useState([]);
const [selectedDev, setSelectedDev] = useState({});
const [openDiscussion, setOpenDiscussion] = useState({});

  useEffect(() => {

    const loadBugs = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id;
        const role = payload.role;

        console.log("User:", userId, role);

        let url;

        // ⭐ Admin sees ALL bugs
        if (role === "admin") {
          url = "http://localhost:5000/api/bugs";
        }

        // ⭐ Tester sees ONLY own bugs
        else {
          url = `http://localhost:5000/api/bugs/my/${userId}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        // 🔹 Load developers
const devRes = await fetch(
  "http://localhost:5000/api/users/developers"
);

const devData = await devRes.json();

setDevelopers(devData);

        console.log("Bugs:", data);

        setBugs(data);

      } catch (err) {
        console.error(err);
      }

      setLoading(false);

    };

    loadBugs();

  }, []);


const assignBug = async (bugId) => {

  const developerId = selectedDev[bugId];

  if (!developerId) {
    alert("Select a developer first");
    return;
  }

  await fetch(
    `http://localhost:5000/api/bugs/${bugId}/assign`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ developerId })
    }
  );

  alert("Bug assigned successfully ✅");

};


const updateStatus = async (bugId, newStatus) => {

  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/api/bugs/${bugId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token   // ⭐ REQUIRED
      },
      body: JSON.stringify({ status: newStatus })
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Update failed");
    return;
  }

  alert(`Bug marked as ${newStatus}`);
  window.location.reload();
};



const token = localStorage.getItem("token");
const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
const role = payload?.role;

  if (loading) return <p>Loading bugs...</p>;

  return (
    <div className="bugs-container">

     <div className="bugs-header">
  <h2>Bug Reports</h2>

  <button
    className="export-btn"
    onClick={() =>
      window.open("http://localhost:5000/api/bugs/export")
    }
  >
    Export Bug Reports
  </button>
</div>

      {bugs.length === 0 ? (
        <p>No bugs found</p>
      ) : (

        bugs.map(bug => (

          <div key={bug.id} className="bug-card">

            <h3>{bug.title}</h3>

            <p>{bug.description}</p>

            <p><strong>Severity:</strong> {bug.severity}</p>

            <p><strong>Priority:</strong> {bug.priority}</p>

            <p><strong>Test Case:</strong> {bug.testCaseId}</p>

            <p><strong>Run:</strong> {bug.runId || "Standalone"}</p>

            {bug.assignedTo && (
  <p>
    <strong>Assigned To:</strong> {bug.assignedTo.name}
  </p>
)}

            <p>
  <strong>Status:</strong>
  <span className={`bug-status status-${bug.status?.toLowerCase().replace(" ", "-")}`}>
    {bug.status}
  </span>
</p>

           {role === "developer" && bug.status === "Open" && (
  <>
    <button onClick={() => updateStatus(bug.id, "In Progress")}>
      Start Work
    </button>

    <button onClick={() => updateStatus(bug.id, "Won't Fix")}>
      Won't Fix
    </button>

    <button onClick={() => updateStatus(bug.id, "Duplicate")}>
      Duplicate
    </button>
  </>
)}

{role === "developer" && bug.status === "In Progress" && (
  <button onClick={() => updateStatus(bug.id, "Fixed")}>
    Mark Fixed
  </button>
)}

{role === "developer" && bug.status === "Reopened" && (
  <button onClick={() => updateStatus(bug.id, "In Progress")}>
    Rework
  </button>
)}

{role === "tester" && bug.status === "Fixed" && (
  <>
    <button onClick={() => updateStatus(bug.id, "Verified")}>
      Verify Fix
    </button>

    <button onClick={() => updateStatus(bug.id, "Reopened")}>
      Reopen
    </button>
  </>
)}

{role === "tester" && bug.status === "Verified" && (
  <button onClick={() => updateStatus(bug.id, "Closed")}>
    Close Bug
  </button>
)}
{role === "admin" && (
  <button onClick={() => updateStatus(bug.id, "Closed")}>
    Close
  </button>
)}

{/* ⭐ Resolution Details */}

{/* ⭐ Resolution Details — Context Aware */}

{bug.status === "Fixed" && (
  <div className="resolution-box fixed">
    <p><strong>✔ Resolution: Fixed</strong></p>

    {bug.fixNotes && (
      <p><strong>Fix Notes:</strong> {bug.fixNotes}</p>
    )}

    {bug.commitLink && (
  <p>
    <strong>Commit / Fix Link:</strong>{" "}
    <a
      href={bug.commitLink}
      target="_blank"
      rel="noreferrer"
      className="commit-link"
    >
      Open Link 🔗
    </a>
    <br />
    <span className="commit-url">
      {bug.commitLink}
    </span>
  </p>
)}

    {bug.fixedAt && (
      <p>
        <strong>Fixed At:</strong>{" "}
        {new Date(bug.fixedAt).toLocaleString()}
      </p>
    )}
  </div>
)}

{bug.status === "Won't Fix" && (
  <div className="resolution-box wontfix">
    <p><strong>✖ Resolution: Won’t Fix</strong></p>

    {bug.resolutionNote && (
      <p><strong>Reason:</strong> {bug.resolutionNote}</p>
    )}
  </div>
)}

{bug.status === "Duplicate" && (
  <div className="resolution-box duplicate">
    <p><strong>⚠ Resolution: Duplicate</strong></p>
  </div>
)}
            {/* ASSIGN DEVELOPER */}

{!bug.assignedToId && (
  <div className="assign-dev">

  <label>Assign to Developer:</label>

  <select
    value={selectedDev[bug.id] || ""}
    onChange={(e) =>
      setSelectedDev({
        ...selectedDev,
        [bug.id]: e.target.value
      })
    }
  >
    <option value="">Select Developer</option>

    {developers.map(dev => (
      <option key={dev.id} value={dev.id}>
        {dev.name} ({dev.email})
      </option>
    ))}
  </select>

  <button
    className="assign-btn"
    onClick={() => assignBug(bug.id)}
  >
    Assign
  </button>
  


</div>
)}

            <p>
              <strong>Reported:</strong>{" "}
              {new Date(bug.createdAt).toLocaleString()}
            </p>

            {bug.evidence && (
              <p>
                <strong>Evidence:</strong>{" "}
                <a
                  href={`http://localhost:5000/uploads/${bug.evidence}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View File
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

        ))

      )}

    </div>
  );
}

export default BugsList;