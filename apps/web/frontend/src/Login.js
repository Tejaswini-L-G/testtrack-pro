import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
 const [remember, setRemember] = useState(false);
const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:5000/login", {
      email,
      password,
      remember,
    });

    console.log("LOGIN RESPONSE:", res.data);

    if (!res.data.accessToken) {
      setMessage("Token not received from server");
      return;
    }

    localStorage.setItem("token", res.data.accessToken);

    if (res.data.refreshToken) {
      localStorage.setItem("refreshToken", res.data.refreshToken);
    }

    setMessage("Login successful!");

    window.location.href = "/";
  } catch (err) {
    console.log(err.response);
    setMessage(err.response?.data?.message || "Login failed");
  }
  const res = await axios.post("http://localhost:5000/login", {
  email,
  password,
  remember,
});

console.log("LOGIN RESPONSE:", res.data);   // 👈 ADD THIS

};

  // 🔐 Forgot password redirect
  
  // 🌍 OAuth redirects
  const loginWithGoogle = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const loginWithGitHub = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        
  <div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <span
    className="password-eye"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "🙈" : "👁️"}
  </span>
</div>

<label style={{ display: "block", marginTop: "8px", fontSize: "14px" }}>
  <input
    type="checkbox"
    checked={remember}
    onChange={(e) => setRemember(e.target.checked)}
    style={{ marginRight: "6px" }}
  />
  Remember Me
</label>

        <button type="submit">Login</button>
      </form>
<a
  href="/forgot"
  style={{
    marginTop: "10px",
    display: "inline-block",
    cursor: "pointer",
    color: "#4facfe",
    textDecoration: "underline",
  }}
>
  Forgot Password?
</a>


      

      {/* Divider */}
      <div style={{ margin: "15px 0", textAlign: "center", color: "#aaa" }}>
        — OR —
      </div>

      {/* OAuth Buttons */}
      <button
        onClick={loginWithGoogle}
        style={{
          width: "100%",
          background: "#fff",
          color: "#444",
          border: "1px solid #ddd",
          marginBottom: "10px",
        }}
      >
        Login with Google
      </button>

      <button
        onClick={loginWithGitHub}
        style={{
          width: "100%",
          background: "#24292e",
          color: "#fff",
        }}
      >
        Login with GitHub
      </button>

      <p className="message">{message}</p>
    </div>
  );
}

export default Login;
