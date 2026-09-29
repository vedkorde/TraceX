import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const roles = [
  { name: "Manufacturer", code: "M", text: "Register products & initiate custody" },
  { name: "Distributor", code: "D", text: "Receive and forward products" },
  { name: "Logistics", code: "L", text: "Track and transfer in transit" },
  { name: "Retailer", code: "R", text: "Receive and verify final custody" }
];

export default function Login() {
  const { role, setRole } = useApp();
  const navigate = useNavigate();

  const enter = (nextRole) => {
    setRole(nextRole);
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="login-logo"><span>TX</span></div>
        <div className="eyebrow">SUPPLY CHAIN WORKSPACE</div>
        <h2>Track every product.<br /><span>From origin to handover.</span></h2>
        <p>TraceX keeps product records, handovers and verification in one place.</p>
        <div className="hero-stat-row">
          <div><strong>01</strong><span>REGISTER</span></div>
          <div><strong>02</strong><span>MOVE</span></div>
          <div><strong>03</strong><span>VERIFY</span></div>
        </div>
      </div>

      <div className="login-panel">
        <div className="login-panel-inner">
          <div className="eyebrow">TRACE-X WORKSPACE</div>
          <h1>Select your role</h1>
          <p className="muted">Choose the role you want to work with.</p>

          <div className="role-grid">
            {roles.map((item) => (
              <button key={item.name} className={`role-option ${role === item.name ? "selected" : ""}`} onClick={() => enter(item.name)}>
                <span className="role-code">{item.code}</span>
                <span className="role-copy"><strong>{item.name}</strong><small>{item.text}</small></span>
                <span className="arrow">→</span>
              </button>
            ))}
          </div>

          <div className="login-note">
            <span>i</span>
            <p>Prototype access only. Production authentication can be added later.</p>
          </div>
        </div>
      </div>
    </div>
  );
}