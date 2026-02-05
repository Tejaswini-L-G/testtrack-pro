import { Routes, Route, useNavigate } from "react-router-dom";



import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ChangePassword from "./ChangePassword";
import Verify from "./Verify";


import "./styles.css";

function App() {
  
  const navigate = useNavigate();

  return (
    <>
      {/* Floating background bubbles */}
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>

      {/* Top Bar */}
      <div className="switch-bar">
  <button onClick={() => navigate("/")}>Login</button>
  <button onClick={() => navigate("/register")}>Register</button>

  {localStorage.getItem("token") && (
    <button onClick={() => navigate("/change-password")}>
      Change Password
    </button>
  )}
</div>


      {/* Routes */}
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forgot" element={<ForgotPassword />} />
  <Route path="/reset/:token" element={<ResetPassword />} />
  <Route path="/verify/:token" element={<Verify />} />
  <Route path="/change-password" element={<ChangePassword />} />
</Routes>

    </>
  );
}

export default App;
