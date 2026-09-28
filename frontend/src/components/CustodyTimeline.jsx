const labels = ["Manufacturer", "Distributor", "Logistics", "Retailer"];

export default function CustodyTimeline({ product }) {
  const reached = new Set(["Manufacturer"]);
  product.history.forEach((event) => {
    if (event.eventType === "RECEIVED") reached.add(event.to);
    if (event.eventType === "REGISTERED") reached.add(event.to);
  });

  return (
    <div className="custody-flow">
      {labels.map((label, index) => (
        <div className="custody-node-wrap" key={label}>
          <div className={`custody-node ${reached.has(label) ? "done" : ""} ${product.currentCustodian === label ? "current" : ""}`}>
            <span>{reached.has(label) ? "✓" : index + 1}</span>
          </div>
          <div className="custody-label">{label}</div>
          {index < labels.length - 1 && <div className={`custody-line ${reached.has(labels[index + 1]) ? "done" : ""}`} />}
        </div>
      ))}
    </div>
  );
}