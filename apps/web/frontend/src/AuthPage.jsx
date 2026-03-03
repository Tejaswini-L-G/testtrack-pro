import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import "./App.css";

function AuthPage() {
  const [modal, setModal] = useState("login");

  const switchModal = (type) => {
    setModal(type);
  };

  return (
    <>
      {modal === "login" && <Login switchModal={switchModal} />}
      {modal === "register" && <Register switchModal={switchModal} />}
      {modal === "forgot" && <ForgotPassword switchModal={switchModal} />}
    </>
  );
}

export default AuthPage;