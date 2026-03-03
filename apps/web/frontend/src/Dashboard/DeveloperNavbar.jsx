import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import NotificationBell from "../Notification/NotificationBell";
import NotificationSettings from "../Notification/NotificationSettings";
import { Settings } from "lucide-react";

function DeveloperNavbar({ onSearchResults }) {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const dropdownRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);

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

  try {
    const res = await fetch(
      `http://localhost:5000/api/search?q=${value}&projectId=${projectId}`,
      {
        headers: { Authorization: "Bearer " + token }
      }
    );

    const data = await res.json();

    setResults(data); // 🔥 YOU MISSED THIS

    if (onSearchResults) {
      onSearchResults(data);
    }

  } catch (err) {
    console.error("Search failed");
  }
};
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setResults(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar-wrapper">

     <div className="nav-actions">
  <NotificationBell />

  <button
    className="nav-settings-btn"
    onClick={() => setShowSettings(true)}
  >
    <Settings size={20} />
  </button>
</div>
      <div className="navbar-search" ref={dropdownRef}>
        
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder=" 🔍 Search test cases, bugs..."
        />

        {results && (
          <div className="search-dropdown">

            {/* TEST CASES */}
            {results.testCases?.map(tc => (
              <div
                key={tc.id}
                className="search-item"
                onClick={() => {
                  navigate(`/developer/testcases`);
                  setResults(null);
                  setQuery("");
                }}
              >
                🧪 {tc.title}
              </div>
            ))}

            {/* BUGS (Issues) */}
            {results.bugs?.map(bug => (
              <div
                key={bug.id}
                className="search-item"
                onClick={() => {
                  navigate(`/developer/issues`);
                  setResults(null);
                  setQuery("");
                }}
              >
                🐞 {bug.title}
              </div>
            ))}

          </div>
        )}

      </div>
       {showSettings && (
  <NotificationSettings
    onClose={() => setShowSettings(false)}
  />
)}
    </div>
  );
}

export default DeveloperNavbar;