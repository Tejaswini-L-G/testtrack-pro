import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./VersionDetail.css";

function VersionDetail() {

  const { id } = useParams();
  const [version, setVersion] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/versions/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => setVersion(data));
  }, [id]);

  // ⭐ WAIT FOR DATA
  if (!version || !version.snapshot) {
    return <div>Loading version details...</div>;
  }

  // ⭐ DECLARE ONLY ONCE HERE
  const snapshot = version.snapshot;

  return (
    <div className="version-page">
      <div className="version-card">

        <h1>Version v{version.version}</h1>

        <p><b>Change Summary:</b> {version.changeLog}</p>
        <p><b>Date:</b> {new Date(version.createdAt).toLocaleString()}</p>

        <h2>Test Case Details</h2>

        <p><b>Title:</b> {snapshot.title || "N/A"}</p>
        <p><b>Module:</b> {snapshot.module || "N/A"}</p>
        <p><b>Status:</b> {snapshot.status || "N/A"}</p>

      </div>
    </div>
  );
}


export default VersionDetail;
