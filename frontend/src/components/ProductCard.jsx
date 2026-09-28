import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function ProductCard({ product, role }) {
  const canTransfer = product.currentCustodian === role && product.status !== "IN_TRANSIT";
  const canReceive = product.status === "IN_TRANSIT" && product.history.at(-1)?.to === role;

  return (
    <article className="product-card">
      <div className="product-card-top">
        <div className="product-icon">◈</div>
        <StatusBadge status={product.status} />
      </div>
      <div className="product-id">{product.id}</div>
      <h3>{product.name}</h3>
      <div className="product-meta">
        <span>Category</span><strong>{product.category}</strong>
        <span>Custodian</span><strong>{product.currentCustodian}</strong>
      </div>
      <div className="card-actions">
        <Link className="ghost-btn" to={`/verify/${product.id}`}>View journey</Link>
        {canTransfer && <Link className="primary-btn small" to={`/transfer?product=${product.id}`}>Transfer</Link>}
        {canReceive && <Link className="primary-btn small" to={`/transfer?product=${product.id}`}>Receive</Link>}
      </div>
    </article>
  );
}