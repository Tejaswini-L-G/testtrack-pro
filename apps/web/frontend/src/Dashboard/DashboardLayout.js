function DashboardLayout({ sidebar, children }) {
  return (
    
    
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {sidebar}
      <main style={{
        flex: 1,
        padding: "24px 32px",
        background: "#f9fafb"
      }}>
        {children}
      </main>
    </div>
    
  );
}

export default DashboardLayout;
