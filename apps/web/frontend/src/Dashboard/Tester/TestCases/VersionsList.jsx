import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Versions.css";

function VersionsList() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/testcases/${id}/versions`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVersions(data || []);
        setLoading(false);
      })
      .catch(() => {
        setVersions([]);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="versions-page">
        <p>Loading version history...</p>
      </div>
    );
  }

  return (
    <div className="versions-page">

      <h1 className="versions-title">Version History</h1>

      <div className="versions-card">

        {versions.length === 0 ? (
          <div className="empty-msg">
            No version history available for this test case.
          </div>
        ) : (
          <table className="versions-table">

            <thead>
              <tr>
                <th>Version</th>
                <th>Change Summary</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {versions.map((v) => (
                <tr key={v.id}>

                  <td>
                    <span className="version-badge">
                      v{v.version}
                    </span>
                  </td>

                  <td className="change-log">
                    {v.changeLog}
                  </td>

                  <td>
                    {new Date(v.createdAt).toLocaleString()}
                  </td>

                  <td>
                    <button
                      className="btn-view"
                      onClick={() =>
                        navigate(`/dashboard/version/${v.id}`)
                      }
                    >
                      View
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
}

export default VersionsList;
