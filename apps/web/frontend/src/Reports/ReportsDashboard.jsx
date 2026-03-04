import { useNavigate } from "react-router-dom";

function ReportsDashboard() {

  const navigate = useNavigate();

  return (
    <div>
      <h2>Reports & Analytics</h2>

      <button onClick={() => navigate("/admin/dashboard/reports/schedule")}>
        Schedule Report
      </button>
    </div>
  );
}

export default ReportsDashboard;