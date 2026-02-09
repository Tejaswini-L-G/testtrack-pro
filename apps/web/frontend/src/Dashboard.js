import React from "react";

function Dashboard() {

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="auth-container">
      <h2>Dashboard</h2>
      <p>Welcome to TestTrack Pro Dashboard 🚀</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
