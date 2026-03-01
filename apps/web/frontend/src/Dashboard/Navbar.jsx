import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const projectId = localStorage.getItem("projectId");
  const token = localStorage.getItem("token");
 
const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
const role = payload?.role;


const getBasePath = () => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "developer") return "/developer";
  return "/dashboard"; // tester default
};
  /* ==============================
     SEARCH FUNCTION
  ============================== */

  const handleSearch = async (value) => {

    setQuery(value);

    if (!value || !projectId) {
      setResults(null);
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(
        `http://localhost:5000/api/search?q=${value}&projectId=${projectId}`,
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      const data = await res.json();
      setResults(data);

    } catch (err) {
      console.error("Search failed");
    }

    setLoading(false);
  };

  /* ==============================
     CLOSE DROPDOWN ON OUTSIDE CLICK
  ============================== */

  useEffect(() => {

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setResults(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  /* ==============================
     RENDER
  ============================== */

  return (
    <div className="navbar-wrapper">

      <div className="navbar-center">

        <div className="navbar-search" ref={dropdownRef}>

          <span className="search-icon">🔍</span>

          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search test cases, bugs..."
          />

          {loading && (
            <div className="search-dropdown">
              <p className="search-category">Searching...</p>
            </div>
          )}

          {results && (
            <div className="search-dropdown">

              {/* TEST CASES */}
              {results.testCases?.length > 0 && (
                <>
                  <p className="search-category">
                    Test Cases
                  </p>

                  {results.testCases.map(tc => (
                    <div
                      key={tc.id}
                      className="search-item"
                      onClick={() => {
                        navigate(`/dashboard/testcases/${tc.id}`);
                        setResults(null);
                        setQuery("");
                      }}
                    >
                      {tc.title}
                    </div>
                  ))}
                </>
              )}

              {/* BUGS */}
              {results.bugs?.length > 0 && (
                <>
                  <p className="search-category">
                    Bugs
                  </p>

                  {results.bugs.map(bug => (
                    <div
                      key={bug.id}
                      className="search-item"
                      onClick={() => {
                       navigate(`/dashboard/bugs`);
                        setResults(null);
                        setQuery("");
                      }}
                    >
                      {bug.title}
                    </div>
                  ))}
                </>
              )}

              {/* COMMENTS */}
              {results.comments?.length > 0 && (
                <>
                  <p className="search-category">
                    Comments
                  </p>

                  {results.comments.map(c => (
                    <div
                      key={c.id}
                      className="search-item"
                    >
                      {c.content.slice(0, 40)}...
                    </div>
                  ))}
                </>
              )}

              {/* NO RESULTS */}
              {!results.testCases?.length &&
               !results.bugs?.length &&
               !results.comments?.length && (
                <p className="search-category">
                  No results found
                </p>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Navbar;