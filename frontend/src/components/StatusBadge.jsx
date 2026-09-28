export default function StatusBadge({ status }) {
  const map = {
    REGISTERED: "registered",
    IN_TRANSIT: "transit",
    RECEIVED: "received"
  };
  return <span className={`status-badge ${map[status] || ""}`}><i />{status.replace("_", " ")}</span>;
}