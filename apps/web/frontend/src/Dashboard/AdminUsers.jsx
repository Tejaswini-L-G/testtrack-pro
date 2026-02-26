import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminUsers() {

  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tester");
  const [search, setSearch] = useState("");
const [editingUser, setEditingUser] = useState(null);
const [editName, setEditName] = useState("");
const [editEmail, setEditEmail] = useState("");
const [editRole, setEditRole] = useState("tester");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= LOAD USERS ================= */

  const loadUsers = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/admin/users",
      { headers: { Authorization: "Bearer " + token } }
    );

    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ================= CREATE USER ================= */

  const createUser = async () => {

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/admin/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ name, email, password, role })
      }
    );

    if (!res.ok) {
      alert("Failed to create user");
      return;
    }

    setMessage("User created successfully ✅");

    setName("");
    setEmail("");
    setPassword("");
    setRole("tester");

    loadUsers();

    setTimeout(() => setMessage(""), 3000);
  };

  /* ================= ACTIONS ================= */

  const deactivateUser = async (id) => {

    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5000/api/admin/users/${id}/deactivate`,
      {
        method: "PUT",
        headers: { Authorization: "Bearer " + token }
      }
    );

    loadUsers();
  };

  const activateUser = async (id) => {

    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5000/api/admin/users/${id}/activate`,
      {
        method: "PUT",
        headers: { Authorization: "Bearer " + token }
      }
    );

    loadUsers();
  };

  const filteredUsers = users.filter(u =>
  u.name.toLowerCase().includes(search.toLowerCase()) ||
  u.email.toLowerCase().includes(search.toLowerCase())
);

const openEdit = (user) => {
  setEditingUser(user.id);
  setEditName(user.name);
  setEditEmail(user.email);
  setEditRole(user.role);
};

const updateUser = async (id) => {

  const token = localStorage.getItem("token");

  await fetch(
    `http://localhost:5000/api/admin/users/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        name: editName,
        email: editEmail,
        role: editRole
      })
    }
  );

  alert("User updated successfully ✅");

  setEditingUser(null);
  window.location.reload();
};
  /* ================= UI ================= */

  return (
    <div className="admin-users-page">

      <h2>Manage Users</h2>

      {message && (
        <div className="success-alert">{message}</div>
      )}

      {/* ===== CREATE USER FORM ===== */}

      <div className="create-user-card">

        <input
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        {/* PASSWORD FIELD WITH EYE ICON */}

        <div className="password-wrapper">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>

        </div>

        <select
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="tester">Tester</option>
          <option value="developer">Developer</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={createUser}>
          Create User
        </button>



        

      </div>

      {/* ===== SEARCH BAR ===== */}

<div className="users-toolbar">

  <input
    type="text"
    placeholder="🔍 Search users by name or email..."
    value={search}
    onChange={e => setSearch(e.target.value)}
  />

</div>

      {/* ===== USERS TABLE WITH SCROLL ===== */}

      <div className="users-table-wrapper">

        <table className="users-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

           {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>

                <td>
                  <span className={u.active ? "badge active" : "badge inactive"}>
                    {u.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>

<button
    className="edit-btn"
    onClick={() => openEdit(u)}
  >
    Edit
  </button>

                  {u.active ? (
                    <button
                      className="btn-deactivate"
                      onClick={() => deactivateUser(u.id)}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className="btn-activate"
                      onClick={() => activateUser(u.id)}
                    >
                      Activate
                    </button>
                  )}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>


      {editingUser && (
  <div className="modal-overlay">

    <div className="modal">

      <h3>Edit User</h3>

      <input
        value={editName}
        onChange={e => setEditName(e.target.value)}
      />

      <input
        value={editEmail}
        onChange={e => setEditEmail(e.target.value)}
      />

      <select
        value={editRole}
        onChange={e => setEditRole(e.target.value)}
      >
        <option value="tester">Tester</option>
        <option value="developer">Developer</option>
        <option value="admin">Admin</option>
      </select>

      <div className="modal-actions">

        <button
          className="save-btn"
          onClick={() =>
            updateUser(editingUser)
          }
        >
          Save
        </button>

        <button
          className="cancel-btn"
          onClick={() => setEditingUser(null)}
        >
          Cancel
        </button>

      </div>

    </div>
  </div>
)}

    </div>
  );
}

export default AdminUsers;