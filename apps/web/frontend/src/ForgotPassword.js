import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/forgot-password", {
        email,
      });

      setMessage(res.data.message);
      setResetLink(res.data.resetLink);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
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
      🔑 Forgot Password
    </h2>

    <form onSubmit={submit}>
      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          marginBottom: "15px",
          outline: "none",
        }}
      />

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
        Generate Reset Link
      </button>
    </form>

    {message && (
      <p
        style={{
          marginTop: "15px",
          fontSize: "14px",
          color: resetLink ? "green" : "#d9534f",
        }}
      >
        {message}
      </p>
    )}

    {resetLink && (
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => (window.location.href = resetLink)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            background: "#10b981",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Go to Reset Password Page 🔐
        </button>
      </div>
    )}
  </div>
);
}

export default ForgotPassword;
