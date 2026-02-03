import { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tester");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const checkStrength = (pass) => {
    if (pass.length < 6) return "Weak";
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass))
      return "Strong";
    return "Medium";
  };

  const strength = checkStrength(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
        role,
      });
      setError(false);
      setMessage("Registration successful! You can now login.");
    } catch {
      setError(true);
      setMessage("Registration failed. User may already exist.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <p className="subtitle">Join TestTrack Pro today</p>

      <form onSubmit={handleRegister}>
        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="strength">
          Password Strength: <b>{strength}</b>
        </div>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="tester">Tester</option>
          <option value="developer">Developer</option>
        </select>

        <button type="submit">Register</button>
      </form>

      <p className={`message ${error ? "error" : "success"}`}>
        {message}
      </p>
    </div>
  );
}

export default Register;
