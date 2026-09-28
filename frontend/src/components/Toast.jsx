export default function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type || "success"}`}>
      <div className="toast-symbol">{toast.type === "error" ? "!" : "✓"}</div>
      <div>
        <strong>{toast.title || (toast.type === "error" ? "Action rejected" : "Success")}</strong>
        <span>{toast.message}</span>
      </div>
      <button onClick={onClose}>×</button>
    </div>
  );
}