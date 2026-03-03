import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./notification.css";
import { Bell } from "lucide-react";
import { io } from "socket.io-client";



function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
const socket = io("http://localhost:5000");


  const token = localStorage.getItem("token");
const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
const role = payload?.role;

  // 🔹 Load unread count
  const loadCount = async () => {
    if (!token) return;

    const res = await fetch(
      "http://localhost:5000/api/notifications/unread-count",
      {
        headers: { Authorization: "Bearer " + token }
      }
    );

    const data = await res.json();
    setCount(data.count || 0);
  };

  // 🔹 Load notifications
  const loadNotifications = async () => {
    if (!token) return;

    const res = await fetch(
      "http://localhost:5000/api/notifications",
      {
        headers: { Authorization: "Bearer " + token }
      }
    );

    const data = await res.json();
    setNotifications(Array.isArray(data) ? data : []);
  };

  // 🔹 Mark single as read
  const markAsRead = async (notification) => {

  await fetch(
    `http://localhost:5000/api/notifications/${notification.id}/read`,
    {
      method: "PATCH",
      headers: { Authorization: "Bearer " + token }
    }
  );

  loadNotifications();
  loadCount();

  /* =========================
     BUG RELATED NOTIFICATIONS
  ========================= */

  if (
    notification.type === "BUG_ASSIGNED" ||
    notification.type === "STATUS_CHANGED" ||
    notification.type === "COMMENT" ||
    notification.type === "RETEST"
  ) {

    if (role === "developer") {
      navigate(`/developer/issues?highlight=${notification.referenceId}`);
    }

    if (role === "tester" || role === "admin") {
      navigate(`/dashboard/bugs?highlight=${notification.referenceId}`);
    }

    setOpen(false);
    return;
  }

  /* =========================
     TEST RUN ASSIGNED
  ========================= */

  if (notification.type === "TEST_ASSIGNED") {

    if (role === "tester") {
      navigate(`/dashboard/my-runs?highlight=${notification.referenceId}`);
    }

    if (role === "admin") {
      navigate(`/admin/dashboard/testruns?highlight=${notification.referenceId}`);
    }

    setOpen(false);
    return;
  }

  if (notification.type === "COMMENT") {

  if (role === "developer") {
    navigate(`/developer/issues?highlight=${notification.referenceId}&openDiscussion=true`);
  }

  if (role === "tester" || role === "admin") {
    navigate(`/dashboard/bugs?highlight=${notification.referenceId}&openDiscussion=true`);
  }

  setOpen(false);
  return;
}

};


  // 🔹 Mark all read
  const markAllRead = async () => {
    await fetch(
      "http://localhost:5000/api/notifications/mark-all-read",
      {
        method: "PATCH",
        headers: { Authorization: "Bearer " + token }
      }
    );

    loadNotifications();
    loadCount();
  };

// 🔹 Delete single notification
const deleteNotification = async (id) => {
  await fetch(
    `http://localhost:5000/api/notifications/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    }
  );

  loadNotifications();
  loadCount();
};


  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    loadCount();
  }, []);


  useEffect(() => {

  if (payload?.id) {
    socket.emit("register", payload.id);
  }

  socket.on("new_notification", (notification) => {

    // 🔥 Add notification instantly
    setNotifications(prev => [notification, ...prev]);
    setCount(prev => prev + 1);

  });

  return () => {
    socket.off("new_notification");
  };

}, []);

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <div
        className="bell-icon"
        onClick={() => {
          setOpen(!open);
          loadNotifications();
        }}
      >
        <Bell size={20} />
        {count > 0 && <span className="badge">{count}</span>}
      </div>
{open && (
  <>
    <div
      className="notification-overlay"
      onClick={() => setOpen(false)}
    />

    <div className="notification-dropdown">
      <div className="dropdown-header">
        <span>Notifications</span>
        {count > 0 && (
          <button onClick={markAllRead}>Mark all read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="empty">No notifications</p>
      ) : (
        notifications.map((n) => (
  <div
    key={n.id}
    className={`notification-item ${
      n.isRead ? "" : "unread"
    }`}
  >
    <div
      className="notification-content"
      onClick={() => markAsRead(n)}
    >
      <strong>{n.title}</strong>
      <p>{n.message}</p>
      <small>
        {new Date(n.createdAt).toLocaleString()}
      </small>
    </div>

    <button
      className="delete-notification"
      onClick={(e) => {
        e.stopPropagation();  // 🔥 VERY IMPORTANT
        deleteNotification(n.id);
      }}
    >
      ✖
    </button>
  </div>
))
      )}
    </div>
  </>
)}
    </div>
  );
}

export default NotificationBell;