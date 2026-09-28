import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";

const participants = ["Manufacturer", "Distributor", "Logistics", "Retailer"];

export default function TransferReceive({ notify }) {
  const { role, products, transferProduct, receiveProduct } = useApp();
  const [params] = useSearchParams();
  const [selected, setSelected] = useState(params.get("product") || products[0]?.id || "");
  const [destination, setDestination] = useState("");
  const [busy, setBusy] = useState(false);

  const product = products.find((p) => p.id === selected);
  const lastTransfer = product?.history?.slice().reverse().find((e) => e.eventType === "TRANSFERRED");
  const canReceive = product?.status === "IN_TRANSIT" && lastTransfer?.to === role;
  const canTransfer = product?.currentCustodian === role && product?.status !== "IN_TRANSIT";

  const otherParticipants = useMemo(() => participants.filter((p) => p !== role), [role]);

  const doTransfer = async () => {
    if (!destination) return notify({ type: "error", title: "Choose destination", message: "Select the next participant." });
    setBusy(true);
    try {
      await transferProduct(selected, destination);
      notify({ title: "Transfer recorded", message: `${selected} is now in transit to ${destination}.` });
      setDestination("");
    } catch (e) {
      notify({ type: "error", title: "Transfer rejected", message: e.message });
    } finally { setBusy(false); }
  };

  const doReceive = async () => {
    setBusy(true);
    try {
      await receiveProduct(selected);
      notify({ title: "Product received", message: `${selected} is now under ${role} custody.` });
    } catch (e) {
      notify({ type: "error", title: "Receive rejected", message: e.message });
    } finally { setBusy(false); }
  };

  return (
    <div className="page">
      <div className="split-header"><div><span className="section-kicker">CUSTODY CONTROL</span><h2>Transfer & receive</h2><p className="muted">Only the valid current custodian can initiate the next transfer.</p></div><div className="rule-chip">● Authorization enforced</div></div>
      <div className="transfer-layout">
        <div className="panel action-panel">
          <div className="panel-heading"><div><h3>Select product</h3><p className="muted">Choose a product to inspect its next valid action.</p></div></div>
          <select className="large-select" value={selected} onChange={(e) => setSelected(e.target.value)}>
            {products.map((p) => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}
          </select>

          {product ? (
            <>
              <div className="selected-product">
                <div className="selected-product-icon">◈</div>
                <div><span className="product-id">{product.id}</span><h3>{product.name}</h3><p>{product.category} · {product.origin}</p></div>
                <StatusBadge status={product.status} />
              </div>

              {canReceive && (
                <div className="action-box receive-box">
                  <span className="action-number">02</span>
                  <div><span className="section-kicker">INCOMING CUSTODY</span><h3>Receive this product</h3><p>Transfer from <strong>{lastTransfer.from}</strong> to <strong>{role}</strong> is waiting for confirmation.</p></div>
                  <button className="primary-btn" onClick={doReceive} disabled={busy}>{busy ? "Processing..." : "Confirm receive →"}</button>
                </div>
              )}

              {canTransfer && (
                <div className="action-box">
                  <span className="action-number">01</span>
                  <div><span className="section-kicker">OUTGOING CUSTODY</span><h3>Transfer product</h3><p>Current custodian: <strong>{role}</strong>. Choose the next authorized participant.</p></div>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                    <option value="">Select destination</option>
                    {otherParticipants.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <button className="primary-btn" onClick={doTransfer} disabled={busy}>{busy ? "Processing..." : "Transfer custody →"}</button>
                </div>
              )}

              {!canReceive && !canTransfer && (
                <div className="notice-box"><span>i</span><div><strong>No action available for this role</strong><p>The chaincode/API layer should reject unauthorized custody changes. Select a product that is waiting for your role.</p></div></div>
              )}
            </>
          ) : <div className="empty-state">No product found.</div>}
        </div>

        <div className="panel rules-panel">
          <span className="section-kicker">VALIDATION MODEL</span>
          <h3>Custody rules</h3>
          <div className="rule-list">
            <div><span>01</span><p><strong>Current custodian</strong><br />Only the current custodian can transfer.</p></div>
            <div><span>02</span><p><strong>Authorized recipient</strong><br />The next participant must be valid.</p></div>
            <div><span>03</span><p><strong>State transition</strong><br />Transfer → IN_TRANSIT → Receive.</p></div>
            <div><span>04</span><p><strong>Immutable history</strong><br />Every event remains visible in the journey.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}