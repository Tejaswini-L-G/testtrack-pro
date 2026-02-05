import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Verify() {
  const { token } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/verify/${token}`)
      .then(() => {
        window.location.href = "/";
      })
      .catch(() => {
        document.body.innerHTML = "Verification link expired";
      });
  }, [token]);

  return <p>Verifying your account...</p>;
}

export default Verify;
