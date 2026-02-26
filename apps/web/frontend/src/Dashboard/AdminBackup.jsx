function AdminBackup() {

  const triggerBackup = async () => {

    await fetch(
      "http://localhost:5000/api/admin/backup",
      { method: "POST" }
    );

    alert("Backup triggered");
  };

  return (
    <div>

      <h2>Backup Management</h2>

      <button onClick={triggerBackup}>
        Run Backup
      </button>

    </div>
  );
}

export default AdminBackup;