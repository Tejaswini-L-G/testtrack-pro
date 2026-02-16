import { useState } from "react";
import axios from "./axiosInstance";


function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // 👁️ visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      setMessage("Enter your current password.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/change-password",
        {
          currentPassword,
          newPassword: password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Password changed successfully!");
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "❌ Failed to change password"
      );
    }
  };

  const fieldStyle = {
    position: "relative",
    marginBottom: "12px",
    width: "100%",
    boxSizing: "border-box",
  };

  const eyeStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #141e30, #243b55)",
      }}
    >
      <div
        style={{
          width: "340px",
          padding: "25px",
          borderRadius: "15px",
          background: "white",
          boxSizing: "border-box",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <h2>🔐 Change Password</h2>

        <form onSubmit={submit}>
          <div style={fieldStyle}>
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                paddingRight: "34px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
            <span
              style={eyeStyle}
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? "🙈" : "👁️"}
            </span>
          </div>

          <div style={fieldStyle}>
            <input
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                paddingRight: "34px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
            <span style={eyeStyle} onClick={() => setShowNew(!showNew)}>
              {showNew ? "🙈" : "👁️"}
            </span>
          </div>

          <div style={fieldStyle}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                paddingRight: "34px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />
            <span
              style={eyeStyle}
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "25px",
              border: "none",
              background: "linear-gradient(135deg, #4facfe, #00f2fe)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Update Password
          </button>
        </form>

        <p style={{ marginTop: "15px", color: "#555" }}>{message}</p>
      </div>
    </div>
  );
}

export default ChangePassword;
