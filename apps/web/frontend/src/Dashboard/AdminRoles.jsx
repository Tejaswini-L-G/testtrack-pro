import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminRoles() {

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [selectedRole, setSelectedRole] = useState(null);
  const [showPermissions, setShowPermissions] = useState(false);

  /* ========= LOAD DATA ========= */

  useEffect(() => {

    fetch("http://localhost:5000/api/admin/roles")
      .then(res => res.json())
      .then(setRoles);

   fetch("http://localhost:5000/api/admin/permissions/master")
  .then(res => res.json())
  .then(setPermissions);

  }, []);

  /* ========= CLICK ROLE ========= */

  const selectRole = (role) => {

    setSelectedRole(role);

    setRoleName(role.name);

    setSelectedPermissions(
      role.permissions?.map(p => p.name) || []
    );
  };


  useEffect(() => {
  if (!selectedRole) return;

  const names = selectedRole.permissions.map(p => p.name);
  setSelectedPermissions(names);

}, [selectedRole]);
  /* ========= CHECKBOX TOGGLE ========= */

 

  const togglePermission = (perm) => {
  setSelectedPermissions(prev =>
    prev.includes(perm)
      ? prev.filter(p => p !== perm)
      : [...prev, perm]
  );
};
  /* ========= CREATE / UPDATE ROLE ========= */

  const saveRole = async () => {

    if (!roleName.trim()) {
      alert("Enter role name");
      return;
    }

    const url = selectedRole
      ? `http://localhost:5000/api/admin/roles/${selectedRole.id}`
      : "http://localhost:5000/api/admin/roles";

    const method = selectedRole ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: roleName,
        permissions: selectedPermissions
      })
    });

    alert(selectedRole ? "Role updated ✅" : "Role created ✅");

    window.location.reload();
  };

  /* ========= UI ========= */

  return (
    <div className="admin-roles-page">

      <h2>Manage Roles</h2>

      <div className="roles-container">

        {/* ===== LEFT: ROLES LIST ===== */}

        <div className="roles-list">

          <h3>Existing Roles</h3>

          {roles.map(r => (
            <div
              key={r.id}
              className={`role-item ${
                selectedRole?.id === r.id ? "active" : ""
              }`}
              onClick={() => selectRole(r)}
            >
              {r.name}
            </div>
          ))}

        </div>

        {/* ===== RIGHT: CREATE / EDIT ===== */}

        <div className="role-editor">

          <h3>
            {selectedRole
              ? "Edit Role"
              : "Create Role"}
          </h3>

          {/* ROLE NAME */}

         <div className="role-input-wrapper">

  <input
    placeholder="Role Name"
    value={roleName}
    onChange={e => setRoleName(e.target.value)}
    onClick={() => setShowPermissions(prev => !prev)}
    className="role-name-input"
  />

  <span className="dropdown-icon">
    {showPermissions ? "▲" : "▼"}
  </span>

</div>

          {/* PERMISSIONS */}

          <div className="permissions-grid">

         {showPermissions && (
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
)}

          </div>

          {/* SAVE BUTTON */}

          <button
            className="create-role-btn"
            onClick={saveRole}
          >
            {selectedRole
              ? "Update Role"
              : "Create Role"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminRoles;