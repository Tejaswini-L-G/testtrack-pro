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
  background: "#ffffff",
  padding: "32px",
  borderRadius: "16px",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
  width: "100%",
  maxWidth: "420px",
  boxSizing: "border-box",
  textAlign: "center",
  border: "1px solid #e5e7eb",
}}
  >
    <h2 style={{ marginBottom: "20px",color:"black" }}>
      🔐 Change Password
    </h2>

    <form onSubmit={submit}>

      {/* Current Password */}
      <div style={{ position: "relative", marginBottom: "15px" }}>
        <input
          type={showCurrent ? "text" : "password"}
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
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
          onClick={() => setShowCurrent(!showCurrent)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          {showCurrent ? "🙈" : "👁️"}
        </span>
      </div>

      {/* New Password */}
      <div style={{ position: "relative", marginBottom: "15px" }}>
        <input
          type={showNew ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        Update Password
      </button>

    </form>

    {message && (
      <p
        style={{
          marginTop: "15px",
          fontSize: "14px",
          color: message.includes("success") ? "green" : "#d9534f",
        }}
      >
        {message}
      </p>
    )}
  </div>
);
}

export default ChangePassword;
