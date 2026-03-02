import { useState } from "react";
import "./HomePage.css";

import Login from "../Login"; 
import Register from "../Register";
import ChangePassword from "../ChangePassword";
import ForgotPassword from "../ForgotPassword";

function HomePage() {

  const [activeModal, setActiveModal] = useState(null);
  
  // null | "login" | "register" | "changePassword"

  return (
    <div className="home-container">

      {/* Header */}
      <header className="home-header">
        <h1 className="home-logo">TestTrack Pro</h1>

        <div className="home-actions">
          <button onClick={() => setActiveModal("login")}>
            Login
          </button>

          <button onClick={() => setActiveModal("register")}>
            Register
          </button>

          <button onClick={() => setActiveModal("changePassword")}>
            Change Password
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="home-main">
        <h2>Test Case Management System</h2>

        <p>
          TestTrack Pro is a modern platform designed to manage software
          testing activities efficiently.
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

      {/* 🔥 Modal Popup */}
      {activeModal && (
  <div
    className="modal-overlay"
    onClick={() => setActiveModal(null)}   // 👈 close on outside click
  >
    <div
      className="modal-box"
      onClick={(e) => e.stopPropagation()} // 👈 prevent closing when clicking inside
    >

            <button
              className="modal-close"
              onClick={() => setActiveModal(null)}
            >
              ✕
            </button>

           {activeModal === "login" && (
  <Login switchModal={setActiveModal} />
)}

{activeModal === "register" && (
  <Register switchModal={setActiveModal} />
)}
            {activeModal === "changePassword" && <ChangePassword />}
            {activeModal === "forgot" && (
  <ForgotPassword switchModal={setActiveModal} />
)}

          </div>
        </div>
      )}

    </div>
  );
}

export default HomePage;