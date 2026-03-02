import { useEffect, useState } from "react";
import "../Bugs/bug.css";

function AdvancedFilterPanel({ onApply }) {

  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [presets, setPresets] = useState([]);
  const [presetName, setPresetName] = useState("");
  const [sharePreset, setSharePreset] = useState(false);

  const token = localStorage.getItem("token");
  const projectId = localStorage.getItem("projectId");

  const currentFilters = {
    type: "bug",
    priority,
    status,
    assignedTo,
    projectId
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/users/developers")
      .then(res => res.json())
      .then(data => setDevelopers(data));

    fetch("http://localhost:5000/api/filter-presets", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => setPresets(data));
  }, []);

  const applyFilters = async (filters = currentFilters) => {
    const res = await fetch(
      "http://localhost:5000/api/advanced-filter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(filters)
      }
    );

    const data = await res.json();
    onApply(data);
  };

  const savePreset = async () => {
    if (!presetName.trim()) {
      alert("Enter preset name");
      return;
    }

    await fetch("http://localhost:5000/api/filter-presets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        name: presetName,
        filters: currentFilters,
        isShared: sharePreset
      })
    });

    alert("Preset saved ✅");
    setPresetName("");
  };

  const applyPreset = (preset) => {
    applyFilters(preset.filters);
  };

  return (
    <div className="advanced-filter-panel">

      {/* FILTER CONTROLS */}
      <select onChange={e => setPriority(e.target.value)}>
        <option value="">Priority</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <select onChange={e => setStatus(e.target.value)}>
        <option value="">Status</option>
        <option>Open</option>
        <option>In Progress</option>
        <option>Fixed</option>
        <option>Closed</option>
      </select>

      <select onChange={e => setAssignedTo(e.target.value)}>
        <option value="">Assigned To</option>
        {developers.map(dev => (
          <option key={dev.id} value={dev.id}>
            {dev.name}
          </option>
        ))}
      </select>

      <button onClick={() => applyFilters()}>
        Apply
      </button>

      {/* SAVE PRESET */}
      <input
        type="text"
        placeholder="Preset name"
        value={presetName}
        onChange={e => setPresetName(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={sharePreset}
          onChange={() => setSharePreset(!sharePreset)}
        />
        Share
      </label>

      <button onClick={savePreset}>
        Save Preset
      </button>

      {/* PRESET DROPDOWN */}
      <select onChange={e => {
        const preset = presets.find(p => p.id === e.target.value);
        if (preset) applyPreset(preset);
      }}>
        <option value="">Load Preset</option>
        {Array.isArray(presets) && presets.map(p => (
          <option key={p.id} value={p.id}>
            {p.name} {p.isShared ? "(Shared)" : ""}
          </option>
        ))}
      </select>

    </div>
  );
}

export default AdvancedFilterPanel;