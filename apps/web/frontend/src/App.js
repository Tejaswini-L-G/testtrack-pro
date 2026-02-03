import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./styles.css";

function App() {
  const [page, setPage] = useState("login");

  return (
    <>
      {/* Floating background bubbles */}
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>

      <div className="switch-bar">
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("register")}>Register</button>
      </div>

      {page === "login" ? <Login /> : <Register />}
    </>
  );
}

export default App;
