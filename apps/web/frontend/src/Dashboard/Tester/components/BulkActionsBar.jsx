function BulkActionsBar({
  selected,
  onDelete,
  onStatusChange
}) {
  if (selected.length === 0) return null;

  return (
    <div className="bulk-bar">
      <span>{selected.length} selected</span>

      <select
        onChange={(e) =>
          onStatusChange(e.target.value)
        }
      >
        <option>Change Status</option>
        <option>Draft</option>
        <option>Approved</option>
        <option>Ready</option>
      </select>

      <button
        className="danger"
        onClick={onDelete}
      >
        Delete Selected
      </button>
    </div>
  );
}

export default BulkActionsBar;
