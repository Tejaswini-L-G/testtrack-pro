import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setError(false);
      setMessage("Login successful!");

      if (res.data.role === "tester") {
        window.location.href = "/tester";
      } else {
        window.location.href = "/developer";
      }
    } catch {
      setError(true);
      setMessage("Invalid email or password");
    }
  };

  const forgotPassword = () => {
    alert("Password reset feature coming soon! (We’ll connect this to email next)");
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <p className="subtitle">Sign in to TestTrack Pro</p>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type={show ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="forgot">
          <span onClick={() => setShow(!show)}>
            {show ? "Hide password" : "Show password"}
          </span>
        </div>

        <div className="forgot">
          <span onClick={forgotPassword}>Forgot password?</span>
        </div>

        <button type="submit">Login</button>
      </form>

      <p className={`message ${error ? "error" : "success"}`}>
        {message}
      </p>
    </div>
  );
}

export default Login;
