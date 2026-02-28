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
      background: "white",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      width: "100%",
      maxWidth: "400px",
      boxSizing: "border-box",
      textAlign: "center",
    }}
  >
    <h2 style={{ marginBottom: "20px",color:"black" }}>
      🔐 Reset Password
    </h2>

    <form onSubmit={reset}>
      {/* New Password */}
      <div style={{ position: "relative", marginBottom: "15px" }}>
        <input
          type={showNew ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            paddingRight: "35px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            outline: "none",
          }}
        />
        <span
          onClick={() => setShowNew(!showNew)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {showNew ? "🙈" : "👁️"}
        </span>
      </div>

      {/* Confirm Password */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            paddingRight: "35px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            outline: "none",
          }}
        />
        <span
          onClick={() => setShowConfirm(!showConfirm)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {showConfirm ? "🙈" : "👁️"}
        </span>
      </div>

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          background: "#4f46e5",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Reset Password
      </button>
    </form>

    {message && (
      <p
        style={{
          marginTop: "15px",
          fontSize: "14px",
          color: message.includes("successful")
            ? "green"
            : "#d9534f",
        }}
      >
        {message}
      </p>
    )}
  </div>
);
}

export default ResetPassword;
