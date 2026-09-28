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
        <div className="eyebrow">DECENTRALIZED TRACEABILITY</div>
        <h2>Every product.<br /><span>One trusted journey.</span></h2>
        <p>TraceX creates a verifiable digital identity and records each custody transition across the supply chain.</p>
        <div className="hero-stat-row">
          <div><strong>01</strong><span>IDENTITY</span></div>
          <div><strong>02</strong><span>TRANSFER</span></div>
          <div><strong>03</strong><span>VERIFY</span></div>
        </div>
      </div>

      <div className="login-panel">
        <div className="login-panel-inner">
          <div className="eyebrow">ACCESS WORKSPACE</div>
          <h1>Choose your role</h1>
          <p className="muted">Select a participant to enter the TraceX prototype.</p>

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
            <p>This MVP uses role selection instead of production authentication. The interface is ready for a real auth layer later.</p>
          </div>
        </div>
      </div>
    </div>
  );
}