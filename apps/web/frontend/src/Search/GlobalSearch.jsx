import { useState } from "react";
import { useNavigate } from "react-router-dom";

function GlobalSearch() {

  const navigate = useNavigate();
  const projectId = localStorage.getItem("projectId");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    testCases: [],
    bugs: [],
    comments: []
  });

  const handleSearch = async (value) => {

    setQuery(value);

    if (!value.trim()) {
      setResults({
        testCases: [],
        bugs: [],
        comments: []
      });
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/search?q=${value}&projectId=${projectId}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    );

    const data = await res.json();
    setResults(data);
  };

  return (
    <div style={{ padding: "30px" }}>

      <h2>Global Search</h2>

      <input
        type="text"
        placeholder="Search test cases, bugs, comments..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "20px"
        }}
      />

      {/* TEST CASES */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Test Cases ({results.testCases.length})</h3>

        {results.testCases.map(tc => (
          <div
            key={tc.id}
            onClick={() =>
             navigate(`/dashboard/testcases/view/${tc.id}`, {
  state: { fromSearch: true }
})
            }
            style={{
              padding: "10px",
              borderBottom: "1px solid #eee",
              cursor: "pointer"
            }}
          >
            🧪 {tc.title}
          </div>
        ))}
      </div>

      {/* BUGS */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Bugs ({results.bugs.length})</h3>

       {results.bugs.map(bug => (
  <div
    key={bug.id}
    onClick={() => {
  navigate("/dashboard/bugs", { replace: true });
}}
    style={{
      padding: "10px",
      borderBottom: "1px solid #eee",
      cursor: "pointer"
    }}
  >
    🐞 {bug.title}
  </div>
))}
      </div>

      {/* COMMENTS */}
      <div>
        <h3>Comments ({results.comments.length})</h3>

        {results.comments.map(comment => (
          <div
            key={comment.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #eee"
            }}
          >
            💬 {comment.content}
          </div>
        ))}
      </div>

    </div>
  );
}

export default GlobalSearch;