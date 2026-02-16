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
    <div className="auth-container">
      <h2>Forgot Password</h2>

      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Generate Reset Link</button>
      </form>

      <p className="message">{message}</p>

      {resetLink && (
  <div style={{ marginTop: "20px", textAlign: "center" }}>
    <button
      onClick={() => (window.location.href = resetLink)}
      style={{
        padding: "12px 25px",
        borderRadius: "25px",
        border: "none",
        background: "linear-gradient(135deg, #4facfe, #00f2fe)",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
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
