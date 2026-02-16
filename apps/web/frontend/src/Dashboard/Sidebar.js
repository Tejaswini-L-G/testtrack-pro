import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ links }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside style={{
      width: "240px",
      background: "#111827",
      color: "#e5e7eb",
      padding: "24px"
    }}>
      <h2 style={{ color: "#fff", marginBottom: "24px" }}>
        TestTrack Pro
      </h2>

      {links.map(link => {
        const active = location.pathname === link.path;

        return (
          <div
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              padding: "10px 12px",
              marginBottom: "6px",
              borderRadius: "4px",
              background: active ? "#1f2937" : "transparent",
              color: active ? "#fff" : "#d1d5db",
              cursor: "pointer"
            }}
          >
            {link.label}
          </div>
        );
      })}
    </aside>
  );
}

export default Sidebar;
