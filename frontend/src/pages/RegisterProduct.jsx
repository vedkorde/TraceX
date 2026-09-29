import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { useApp } from "../context/AppContext";

export default function RegisterProduct({ notify }) {
  const { role, registerProduct } = useApp();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ id: "", name: "", category: "Pharmaceutical", origin: "" });
  const [created, setCreated] = useState(null);
  const [loading, setLoading] = useState(false);

  if (role !== "Manufacturer") {
    return <div className="access-denied panel"><div className="deny-icon">!</div><h2>Manufacturer access required</h2><p>Product registration is the first step of the TraceX custody chain and is assigned to the Manufacturer role.</p><button className="primary-btn" onClick={() => navigate("/login")}>Change role</button></div>;
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!product.id || !product.name || !product.origin) {
      notify({ type: "error", title: "Missing information", message: "Complete Product ID, name and origin." });
      return;
    }
    if (!/^TX-[A-Z0-9-]+$/i.test(product.id)) {
      notify({ type: "error", title: "Invalid Product ID", message: "Use an ID such as TX-10482." });
      return;
    }
    setLoading(true);
    try {
      const result = await registerProduct({ ...product, productId: product.id });
      setCreated(result);
      notify({ title: "Product registered", message: `${result.id} is now recorded as REGISTERED.` });
    } catch (error) {
      notify({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="split-header"><div><span className="section-kicker">DIGITAL IDENTITY</span><h2>Register a product</h2><p className="muted">Create the first ledger-ready identity before custody begins.</p></div><div className="step-chip"><span>01</span> IDENTITY</div></div>
      <div className="form-layout">
        <form className="panel form-panel" onSubmit={submit}>
          <div className="panel-heading"><div><h3>Product information</h3><p className="muted">Fields match the TraceX prototype contract.</p></div></div>
          <label>Product ID<input value={product.id} onChange={(e) => setProduct({ ...product, id: e.target.value.toUpperCase() })} placeholder="TX-10482" /></label>
          <label>Product name<input value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} placeholder="Vaccine Batch A17" /></label>
          <div className="two-col">
            <label>Category<select value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })}><option>Pharmaceutical</option><option>Electronics</option><option>Food & Beverage</option><option>Industrial</option><option>Other</option></select></label>
            <label>Origin<input value={product.origin} onChange={(e) => setProduct({ ...product, origin: e.target.value })} placeholder="Nagpur Manufacturing Unit" /></label>
          </div>
          <div className="form-footer"><span>Custodian will start as <strong>Manufacturer</strong>.</span><button className="primary-btn" disabled={loading}>{loading ? "Registering..." : "Register product →"}</button></div>
        </form>

        <div className="panel identity-preview">
          <span className="section-kicker">IDENTITY PREVIEW</span>
          <div className="identity-mark">TX</div>
          <span className="tiny-label">PRODUCT ID</span>
          <div className="preview-id">{created?.id || product.id || "TX-•••••"}</div>
          <div className="preview-line"><span>STATUS</span><strong>{created ? "REGISTERED" : "READY TO REGISTER"}</strong></div>
          <div className="preview-line"><span>ORIGIN</span><strong>{created?.origin || product.origin || "—"}</strong></div>
          {created && <QRCodeDisplay productId={created.id} />}
        </div>
      </div>
    </div>
  );
}