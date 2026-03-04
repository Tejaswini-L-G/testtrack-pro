import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminRoles() {

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [selectedRole, setSelectedRole] = useState(null);
  const token = localStorage.getItem("token");

 
  /* ========= LOAD DATA ========= */

  useEffect(() => {

  

  fetch("http://localhost:5000/api/admin/roles", {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setRoles(data);
      } else if (Array.isArray(data.roles)) {
        setRoles(data.roles);
      } else {
        setRoles([]);
      }
    })
    .catch(() => setRoles([]));

}, []);

useEffect(() => {

 

  fetch("http://localhost:5000/api/admin/permissions/master", {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setPermissions(data);
      } else {
        setPermissions([]);
      }
    })
    .catch(() => setPermissions([]));

}, []);


  /* ========= SELECT ROLE ========= */

  const selectRole = (role) => {
    setSelectedRole(role);
    setRoleName(role.name);

    const names = role.permissions?.map(p => p.name) || [];
    setSelectedPermissions(names);
  };

  /* ========= TOGGLE PERMISSION ========= */

  const togglePermission = (perm) => {
    setSelectedPermissions(prev =>
      prev.includes(perm)
        ? prev.filter(p => p !== perm)
        : [...prev, perm]
    );
  };

  /* ========= SAVE ROLE ========= */

 const saveRole = async () => {

  if (!roleName.trim()) {
    alert("Enter role name");
    return;
  }

  const url = selectedRole
    ? `http://localhost:5000/api/admin/roles/${selectedRole.id}`
    : "http://localhost:5000/api/admin/roles";

  const method = selectedRole ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      name: roleName,
      permissions: selectedPermissions
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Error saving role");
    return;
  }

  alert(selectedRole ? "Role updated ✅" : "Role created ✅");

  // Refresh roles
  fetch("http://localhost:5000/api/admin/roles", {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(res => res.json())
    .then(setRoles);

  setSelectedRole(null);
  setRoleName("");
  setSelectedPermissions([]);
};

const deleteRole = async (id) => {

  const confirmDelete = window.confirm("Are you sure?");
  if (!confirmDelete) return;

  const res = await fetch(`http://localhost:5000/api/admin/roles/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Error deleting role");
    return;
  }

  alert("Role deleted ✅");

  fetch("http://localhost:5000/api/admin/roles", {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(res => res.json())
    .then(setRoles);

  if (selectedRole?.id === id) {
    setSelectedRole(null);
    setRoleName("");
    setSelectedPermissions([]);
  }
};


  /* ========= UI ========= */

  return (
    <div className="admin-roles-page">

      <h2 className="page-title">Role Management</h2>

      <div className="roles-container">

        {/* ===== LEFT: ROLES LIST ===== */}
        <div className="roles-list">
          <h3>Existing Roles</h3>
{roles.length === 0 && <p>No roles found</p>}
          {Array.isArray(roles) && roles.map(r =>  (
            <div
              key={r.id}
              className={`role-item ${selectedRole?.id === r.id ? "active" : ""}`}
              onClick={() => selectRole(r)}
            >
              {r.name}
            </div>
          ))}
        </div>

        {/* ===== RIGHT: EDIT PANEL ===== */}
        <div className="role-editor">

          <h3>{selectedRole ? "Edit Role" : "Create New Role"}</h3>

          <input
            placeholder="Role Name"
            value={roleName}
            onChange={e => setRoleName(e.target.value)}
            className="role-name-input"
          />

          <div className="permissions-panel">
            {permissions.map(p => (
              <label key={p} className="permission-item">
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(p)}
                  onChange={() => togglePermission(p)}
                />
                <span>{p.replaceAll("_", " ")}</span>
              </label>
            ))}
          </div>

          <button className="create-role-btn" onClick={saveRole}>
            {selectedRole ? "Update Role" : "Create Role"}
          </button>

          {selectedRole && (
  <button
    className="delete-role-btn"
    onClick={() => deleteRole(selectedRole.id)}
  >
    Delete Role
  </button>
)}

        </div>
      </div>
    </div>
  );
}

export default AdminRoles;