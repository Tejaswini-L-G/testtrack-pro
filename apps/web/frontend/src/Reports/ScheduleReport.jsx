import React, { useState, useEffect } from "react";
import "./Report.css";

function ScheduleReport() {

  const token = localStorage.getItem("token");

  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [type, setType] = useState("TEST_EXECUTION");
  const [frequency, setFrequency] = useState("WEEKLY");
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [time, setTime] = useState("09:00");

  // Load schedules
  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = () => {
    fetch("http://localhost:5000/api/reports/schedule", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSchedules(data);
        else setSchedules([]);
      });
  };

  const handleSave = async () => {

    const res = await fetch(
      "http://localhost:5000/api/reports/schedule",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          type,
          frequency,
          dayOfWeek,
          time
        })
      }
    );

    if (res.ok) {
      alert("Report scheduled successfully");
      setShowModal(false);
      loadSchedules();
    }
  };

  const deleteSchedule = async (id) => {

    await fetch(
      `http://localhost:5000/api/reports/schedule/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
      }
    );

    loadSchedules();
  };

  function calculateNextRun(schedule) {

    const now = new Date();

    if (schedule.frequency === "WEEKLY") {

      const next = new Date();

      next.setDate(
        now.getDate() +
        ((7 + schedule.dayOfWeek - now.getDay()) % 7)
      );

      next.setHours(...schedule.time.split(":"));

      return next.toLocaleString();
    }

    return "Auto";
  }

 const runNow = async (id) => {

  try {

    const res = await fetch(
      `http://localhost:5000/api/reports/run/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const text = await res.text();   // read raw response first

    try {
      const data = JSON.parse(text);
      alert(data.message || "Report executed");
    } catch {
      console.error("Server returned HTML:", text);
      alert("Server error. Check backend console.");
    }

  } catch (err) {
    console.error(err);
    alert("Run failed");
  }

};
  return (
    <div className="schedule-page">

      <div className="schedule-header">

        <h2>Scheduled Reports</h2>

        <button
          className="create-btn"
          onClick={() => setShowModal(true)}
        >
          + Create Schedule
        </button>

      </div>

      <table className="schedule-table">

        <thead>
          <tr>
            <th>Type</th>
            <th>Frequency</th>
            <th>Time</th>
            <th>Next Run</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

        {schedules.length === 0 ? (

          <tr>
            <td colSpan="5">No scheduled reports</td>
          </tr>

        ) : (

          schedules.map(s => (

            <tr key={s.id}>

              <td>{s.type}</td>
              <td>{s.frequency}</td>
              <td>{s.time}</td>
              <td>{calculateNextRun(s)}</td>

              <td>

                <button
    className="run-btn"
    onClick={() => runNow(s.id)}
  >
    ▶ Run Now
  </button>


                <button
                  className="edit-btn"
                  onClick={() => {
                    setType(s.type);
                    setFrequency(s.frequency);
                    setDayOfWeek(s.dayOfWeek);
                    setTime(s.time);
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteSchedule(s.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))

        )}

        </tbody>

      </table>


      {/* CREATE MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>Create Schedule</h3>

            <label>Report Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="TEST_EXECUTION">Test Execution</option>
              <option value="BUG_REPORT">Bug Report</option>
              <option value="DEV_PERFORMANCE">Developer Performance</option>
            </select>

            <label>Frequency</label>
            <select
              value={frequency}
              onChange={e => setFrequency(e.target.value)}
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>

            {frequency === "WEEKLY" && (
              <>
                <label>Day</label>
                <select
                  value={dayOfWeek}
                  onChange={e => setDayOfWeek(Number(e.target.value))}
                >
                  <option value={1}>Monday</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                  <option value={6}>Saturday</option>
                  <option value={0}>Sunday</option>
                </select>
              </>
            )}

            <label>Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
            />

            <div className="modal-actions">

              <button
                className="save-btn"
                onClick={handleSave}
              >
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
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

export default ScheduleReport;