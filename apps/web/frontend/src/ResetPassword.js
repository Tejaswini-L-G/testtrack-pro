import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // 👁️ Visibility states
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const reset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/reset-password/${token}`, {
        newPassword: password,   // ✅ Only send new password
      });

      setMessage("✅ Password reset successful! You can now login.");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setMessage("❌ Reset failed. Link may be expired.");
    }
  };

  // Styles
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
    userSelect: "none",
    fontSize: "16px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1d2671, #c33764)",
      }}
    >
      <div
        style={{
          width: "320px",
          padding: "25px",
          borderRadius: "15px",
          background: "white",
          boxSizing: "border-box",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>🔐 Reset Password</h2>

        <form onSubmit={reset}>
          {/* New Password */}
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
              required
            />
            <span style={eyeStyle} onClick={() => setShowNew(!showNew)}>
              {showNew ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Confirm Password */}
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
              required
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
              marginTop: "10px",
              width: "100%",
              padding: "12px",
              borderRadius: "25px",
              border: "none",
              background: "linear-gradient(135deg, #4facfe, #00f2fe)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            Reset Password
          </button>
        </form>

        <p style={{ marginTop: "15px", color: "#555", fontSize: "14px" }}>
          {message}
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
