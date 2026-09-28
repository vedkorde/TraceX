import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import StatusBadge from "../components/StatusBadge";
import CustodyTimeline from "../components/CustodyTimeline";
import { useApp } from "../context/AppContext";

export default function Dashboard({ notify }) {
  const { products, role } = useApp();
  const active = products.filter((p) => p.currentCustodian === role || p.history.at(-1)?.to === role);
  const transit = products.filter((p) => p.status === "IN_TRANSIT").length;
  const received = products.filter((p) => p.status === "RECEIVED").length;

  return (
    <div className="page">
      <section className="welcome-row">
        <div>
          <div className="eyebrow">LIVE WORKSPACE</div>
          <h2>Good to see you, {role}.</h2>
          <p className="muted">Your supply chain activity is ready for the next verified action.</p>
        </div>
        {role === "Manufacturer" && <Link to="/register" className="primary-btn">＋ Register product</Link>}
      </section>

      <section className="metric-grid">
        <div className="metric-card"><span className="metric-icon cyan">◈</span><div><small>PRODUCTS</small><strong>{products.length}</strong><p>Total identities</p></div></div>
        <div className="metric-card"><span className="metric-icon purple">⇄</span><div><small>IN TRANSIT</small><strong>{transit}</strong><p>Moving through chain</p></div></div>
        <div className="metric-card"><span className="metric-icon green">✓</span><div><small>RECEIVED</small><strong>{received}</strong><p>Custody confirmed</p></div></div>
        <div className="metric-card"><span className="metric-icon orange">⌁</span><div><small>ROLE</small><strong>{role[0]}</strong><p>{role}</p></div></div>
      </section>

      <section className="dashboard-grid">
        <div className="panel products-panel">
          <div className="panel-heading">
            <div><span className="section-kicker">INVENTORY</span><h3>Products in your workspace</h3></div>
            <span className="count-pill">{active.length}</span>
          </div>
          {active.length === 0 ? <div className="empty-state">No products currently require action for this role.</div> : (
            <div className="product-list">
              {active.map((product) => <ProductCard key={product.id} product={product} role={role} />)}
            </div>
          )}
        </div>

        <div className="panel journey-panel">
          <div className="panel-heading">
            <div><span className="section-kicker">CHAIN OF CUSTODY</span><h3>Journey preview</h3></div>
            <Link to="/verify/TX-10482" className="text-link">Open verify →</Link>
          </div>
          <CustodyTimeline product={products[0]} />
          <div className="journey-product">
            <div><span className="product-id">{products[0].id}</span><strong>{products[0].name}</strong></div>
            <StatusBadge status={products[0].status} />
          </div>
        </div>
      </section>

      <section className="info-banner">
        <div className="info-symbol">⌁</div>
        <div><strong>Built for the TraceX MVP</strong><p>Register → Transfer → Receive → Verify → Track. Blockchain rules stay behind the API boundary so the frontend can evolve independently.</p></div>
        <Link to="/verify/TX-10482" className="ghost-btn">View verification</Link>
      </section>
    </div>
  );
}