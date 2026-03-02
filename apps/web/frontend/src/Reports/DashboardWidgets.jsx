import { useEffect, useState } from "react";
import "./Widget.css";
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from "recharts";

export default function DashboardWidgets({ user }) {

  const [widgets, setWidgets] = useState([]);
  const [counterData, setCounterData] = useState({});
const [listData, setListData] = useState({});
const [chartData, setChartData] = useState([]);
const [tableData, setTableData] = useState([]);

  // ================= INIT + LOAD =================

  useEffect(() => {

    if (!user?.id) return;

    // Create default widgets (only once)
    fetch("http://localhost:5000/api/widgets/default", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        role: user.role
      })
    }).then(() => {

      // Load widgets
      fetch(`http://localhost:5000/api/widgets/${user.id}`)
        .then(res => res.json())
        .then(setWidgets);
    });

  }, [user]);


  useEffect(() => {

  if (!user?.id) return;

  // -------- COUNTERS --------

  fetch(`http://localhost:5000/api/widgets/data/counters/${user.id}`)
    .then(res => res.json())
    .then(setCounterData)
    .catch(() => setCounterData({}));

  // -------- LISTS --------

  fetch(`http://localhost:5000/api/widgets/data/lists/${user.id}`)
    .then(res => res.json())
    .then(setListData)
    .catch(() => setListData({}));

  // -------- CHART --------

  fetch(`http://localhost:5000/api/widgets/data/trend/${user.id}`)
    .then(res => res.json())
    .then(setChartData)
    .catch(() => setChartData([]));

  // -------- TABLE --------

  fetch(`http://localhost:5000/api/widgets/data/table/${user.id}`)
    .then(res => res.json())
    .then(setTableData)
    .catch(() => setTableData([]));

}, [user]);

  // ================= DRAG & DROP =================

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const onDrop = (e, index) => {

    const from = e.dataTransfer.getData("index");
    const updated = [...widgets];

    const item = updated.splice(from, 1)[0];
    updated.splice(index, 0, item);

    setWidgets(updated);

    // Save layout
    fetch("http://localhost:5000/api/widgets/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        widgets: updated.map((w, i) => ({
          id: w.id,
          position: i
        }))
      })
    });
  };


  const removeWidget = (id) => {

  fetch(`http://localhost:5000/api/widgets/${id}`, {
    method: "DELETE"
  }).then(() => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  });

};
  // ================= RENDER =================

  if (!widgets.length)
    return <div className="widget-empty">No widgets available</div>;

  return (
  <div className="widget-grid">

    {widgets.map((w, i) => (

      <div
        key={w.id}
        draggable
        onDragStart={(e) => onDragStart(e, i)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDrop(e, i)}
        className="widget-card"
      >

       <div className="widget-header">

  <h3>{w.title}</h3>

  <div className="widget-actions">

    <span className="drag-hint">⠿</span>

    <button
      className="widget-remove"
      onClick={() => removeWidget(w.id)}
      title="Remove widget"
    >
      ×
    </button>

  </div>

</div>

        {/* ================= COUNTER ================= */}
        {w.type === "counter" && (
          <div className="widget-counter">
            {counterData[w.title] ?? 0}
          </div>
        )}

        {/* ================= LIST ================= */}
        {w.type === "list" && (
          <ul className="widget-list">
            {(listData[w.title] || []).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}

        {/* ================= CHART ================= */}
        {w.type === "chart" && (
          <div className="widget-chart">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#2563eb" />
                </LineChart>
              </ResponsiveContainer>
            ) : "No data"}
          </div>
        )}

        {/* ================= TABLE ================= */}
        {w.type === "table" && (
          <table className="widget-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.name}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    ))}

  </div>
);
}