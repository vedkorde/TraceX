import { Link, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import CustodyTimeline from "../components/CustodyTimeline";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { useApp } from "../context/AppContext";

function formatDate(value) {
  return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

export default function VerifyProduct() {
  const { id } = useParams();
  const { products } = useApp();
  const product = products.find((p) => p.id === id?.toUpperCase());

  if (!product) {
    return <div className="access-denied panel"><div className="deny-icon">?</div><h2>Product not found</h2><p>The verification route could not find a product with ID <strong>{id}</strong>.</p><Link to="/dashboard" className="primary-btn">Back to dashboard</Link></div>;
  }

  return (
    <div className="page verify-page">
      <div className="verify-banner"><div><span className="verified-icon">✓</span></div><div><span className="section-kicker">TRACEX VERIFIED RECORD</span><h2>Digital identity found</h2><p>This page displays the recorded product identity and custody journey.</p></div><StatusBadge status={product.status} /></div>

      <div className="verify-grid">
        <div className="panel identity-panel">
          <div className="panel-heading"><div><span className="section-kicker">PRODUCT IDENTITY</span><h3>{product.name}</h3></div><span className="product-id">{product.id}</span></div>
          <div className="identity-fields">
            <div><span>ORIGIN</span><strong>{product.origin}</strong></div>
            <div><span>CURRENT CUSTODIAN</span><strong>{product.currentCustodian}</strong></div>
            <div><span>CATEGORY</span><strong>{product.category}</strong></div>
            <div><span>CREATED</span><strong>{formatDate(product.createdAt)}</strong></div>
          </div>
          <div className="divider" />
          <span className="section-kicker">FULL CHAIN OF CUSTODY</span>
          <CustodyTimeline product={product} />
        </div>

        <div className="panel qr-verify-panel">
          <span className="section-kicker">PUBLIC LOOKUP</span>
          <h3>Scan to verify</h3>
          <p className="muted">The QR is a lookup mechanism for this recorded verification route.</p>
          <QRCodeDisplay productId={product.id} />
        </div>
      </div>

      <div className="panel history-panel">
        <div className="panel-heading"><div><span className="section-kicker">AUDIT TRAIL</span><h3>Recorded journey</h3></div><span className="count-pill">{product.history.length} events</span></div>
        <div className="history-table">
          {product.history.map((event, index) => (
            <div className="history-row" key={`${event.timestamp}-${index}`}>
              <div className="event-dot">{event.eventType === "REGISTERED" ? "R" : event.eventType === "TRANSFERRED" ? "→" : "✓"}</div>
              <div><strong>{event.eventType}</strong><span>{event.from} {event.eventType !== "REGISTERED" ? `→ ${event.to}` : `→ ${event.to}`}</span></div>
              <div><span>{event.location}</span></div>
              <div><span>{formatDate(event.timestamp)}</span><small>Actor: {event.actor}</small></div>
            </div>
          ))}
        </div>
      </div>

      <div className="verification-note"><span>i</span><p><strong>Verification scope:</strong> QR lookup displays the identity and journey recorded by the TraceX application. It does not independently prove physical authenticity.</p></div>
    </div>
  );
}