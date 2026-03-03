import { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

function Login({ switchModal })  {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
 const [remember, setRemember] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [data , setData] = useState({});

 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:5000/login", {
      email,
      password,
      remember,
    });

    if (!res.data.accessToken) {
      setMessage("Token not received from server");
      return;
    }

    // ✅ Save token
    localStorage.setItem("token", res.data.accessToken);

    // ✅ Decode role from token
    const payload = JSON.parse(atob(res.data.accessToken.split(".")[1]));

    localStorage.setItem("role", payload.role); 
    localStorage.setItem("token", res.data.accessToken);
localStorage.setItem("user", JSON.stringify(res.data.user));  // ⭐ FIXED

    if (res.data.refreshToken) {
      localStorage.setItem("refreshToken", res.data.refreshToken);
    }

    setMessage("Login successful!");

    // ✅ Redirect based on role
    if (payload.role === "admin") {
  window.location.href = "/admin/dashboard";

} else if (payload.role === "developer") {
  window.location.href = "/developer/dashboard";

} else {
  // tester (default)
  window.location.href = "/dashboard";
}

  } catch (err) {
    setMessage(err.response?.data?.message || "Login failed");
  }
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

<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "12px"
  }}
>
  <label
    style={{
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "#333",
      cursor: "pointer"
    }}
  >
    <input
      type="checkbox"
      checked={remember}
      onChange={(e) => setRemember(e.target.checked)}
      style={{
        marginRight: "8px",
        width: "16px",
        height: "16px",
        cursor: "pointer"
      }}
    />
    Remember Me
  </label>
</div>

        <button type="submit">Login</button>
      </form>
<span
  onClick={() => switchModal && switchModal("forgot")}
  style={{
    marginTop: "10px",
    display: "inline-block",
    cursor: "pointer",
    color: "#4f46e5",
    textDecoration: "underline",
  }}
>
  Forgot Password?
</span>

<div
  style={{
    marginTop: "18px",
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
  }}
>
  Don’t have an account?{" "}
  <span
    onClick={() => switchModal && switchModal("register")}
    style={{
      color: "#4f46e5",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.2s",
    }}
    onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
    onMouseOut={(e) => (e.target.style.textDecoration = "none")}
  >
    Register
  </span>
</div>
      

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
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500"
  }}
>
  <FcGoogle size={20} />
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
