import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* Header */}
      <header className="home-header">
        <h1 className="home-logo">TestTrack Pro</h1>

        <div className="home-actions">
          <button onClick={() => navigate("/")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
          <button onClick={() => navigate("/change-password")}>
            Change Password
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="home-main">

        <h2>Test Case Management System</h2>

        <p>
          TestTrack Pro is a modern platform designed to manage software
          testing activities efficiently. Create, organize, track, and
          maintain test cases and suites in one centralized system.
        </p>

        <p>
          Built for testers, developers, and administrators to improve
          collaboration and ensure software quality.
        </p>

      </main>

      {/* Footer */}
      <footer className="home-footer">
        © {new Date().getFullYear()} TestTrack Pro
      </footer>

    </div>
  );
}

export default HomePage;