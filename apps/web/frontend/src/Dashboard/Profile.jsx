import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/users/me",
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      const data = await res.json();
      setUserInfo(data);
    };

    loadUser();
  }, []);

  return (
    <div className="topbar">

      <div
        className="profile-avatar"
        onClick={() => setOpen(prev => !prev)}
      >
        {userInfo?.name?.charAt(0).toUpperCase() || "U"}
      </div>

      {open && (
        <div className="profile-menu">

          <div className="profile-header">
            <div className="profile-avatar large">
              {userInfo?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div>
              <h4>{userInfo?.name}</h4>
              <p>{userInfo?.email}</p>
            </div>
          </div>

          <p className="role">{userInfo?.role}</p>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/dashboard/home");
            }}
          >
            Logout
          </button>

        </div>
      )}
    </div>
  );
}

export default Profile;