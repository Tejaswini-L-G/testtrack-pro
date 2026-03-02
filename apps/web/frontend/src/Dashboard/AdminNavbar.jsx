import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function AdminNavbar({ onSearchResults }) {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);

  const navigate = useNavigate();
  const projectId = localStorage.getItem("projectId");
  const token = localStorage.getItem("token");

  const handleSearch = async (value) => {
    setQuery(value);
if (!value || !projectId) {
  setResults(null);

  if (onSearchResults) {
    onSearchResults(null);
  }

  return;
}

    const res = await fetch(
      `http://localhost:5000/api/search?q=${value}&projectId=${projectId}`,
      {
        headers: { Authorization: "Bearer " + token }
      }
    );

    const data = await res.json();
    setResults(data);

if (onSearchResults) {
  onSearchResults(data);
}
  };

  return (
    <div className="navbar-wrapper">

      <div className="navbar-search">

        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search..."
        />

        {results && (
          <div className="search-dropdown">

            {/* Test Cases */}
            {results.testCases?.map(tc => (
              <div
                key={tc.id}
                className="search-item"
                onClick={() => {
                  navigate(`/admin/dashboard/testcases`);
                  setResults(null);
                }}
              >
                {tc.title}
              </div>
            ))}

            {/* Bugs */}
            {results.bugs?.map(bug => (
              <div
                key={bug.id}
                className="search-item"
                onClick={() => {
                  navigate(`/admin/dashboard/bugs`);
                  setResults(null);
                }}
              >
                {bug.title}
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminNavbar;