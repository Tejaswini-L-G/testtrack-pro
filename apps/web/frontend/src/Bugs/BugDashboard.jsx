import { useEffect, useState } from "react";
import "./bug.css";

function BugsList() {

  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

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

        console.log("Bugs:", data);

        setBugs(data);

      } catch (err) {
        console.error(err);
      }

      setLoading(false);

    };

    loadBugs();

  }, []);

  if (loading) return <p>Loading bugs...</p>;

  return (
    <div className="bugs-container">

      <h2>Bug Reports</h2>

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

            <p><strong>Status:</strong> {bug.status || "Open"}</p>

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

          </div>

        ))

      )}

    </div>
  );
}

export default BugsList;