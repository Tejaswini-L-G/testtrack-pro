import { useState } from "react";
import axios from "axios";

function ForgotPassword({ switchModal }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/forgot-password", {
        email,
      });

      setMessage(res.data.message);
      setSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
      setSuccess(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "35px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          animation: "fadeIn 0.3s ease-in-out",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          🔑 Forgot Password
        </h2>

        {!success ? (
          <>
            <form onSubmit={submit}>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  marginBottom: "15px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#4f46e5",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
              >
                Generate Reset Link
              </button>
            </form>

            {message && (
              <p
                style={{
                  marginTop: "12px",
                  color: "#ef4444",
                  fontSize: "14px",
                }}
              >
                {message}
              </p>
            )}
          </>
        ) : (
          <>
            <p
              style={{
                color: "#10b981",
                fontWeight: "500",
                marginBottom: "20px",
              }}
            >
              {message}
            </p>

            <button
              onClick={() => switchModal("login")}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                background: "#10b981",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;