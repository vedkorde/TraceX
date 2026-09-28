import { useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

const titles = {
  "/dashboard": ["Overview", "Monitor product identity, custody and movement."],
  "/register": ["Register Product", "Create a trusted digital identity for a product."],
  "/transfer": ["Transfer & Receive", "Move custody through the supply chain with validation."],
};

export default function Topbar() {
  const location = useLocation();
  const { role } = useApp();
  const data = titles[location.pathname] || (location.pathname.startsWith("/verify") ? ["Product Verification", "Read the recorded identity and custody journey."] : ["TraceX", "Supply chain traceability workspace."]);

  return (
    <header className="topbar">
      <div>
        <div className="eyebrow">TRACEX / {role?.toUpperCase() || "GUEST"}</div>
        <h1>{data[0]}</h1>
        <p>{data[1]}</p>
      </div>
      <div className="top-actions">
        <div className="secure-chip"><span>●</span> Demo environment</div>
        <div className="user-mini">{role?.[0] || "G"}</div>
      </div>
    </header>
  );
}