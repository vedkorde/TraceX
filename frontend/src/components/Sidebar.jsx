import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const links = [
  { to: "/dashboard", icon: "▦", label: "Dashboard" },
  { to: "/register", icon: "＋", label: "Register Product" },
  { to: "/transfer", icon: "⇄", label: "Transfer / Receive" }
];

export default function Sidebar() {
  const { role, resetDemo } = useApp();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><span>TX</span></div>
        <div>
          <div className="brand-name">Trace<span>X</span></div>
          <div className="brand-sub">TRUSTED SUPPLY CHAIN</div>
        </div>
      </div>

      <div className="network-status">
        <span className="pulse-dot" />
        <div>
          <strong>TraceX workspace</strong>
          <small>Prototype</small>
        </div>
      </div>

      <nav className="side-nav">
        <div className="nav-label">OPERATIONS</div>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <span className="nav-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
        <NavLink to="/verify/TX-10482" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">⌁</span>
          <span>Verify Product</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="role-card">
          <div className="avatar">{role?.[0] || "?"}</div>
          <div>
            <small>ACTIVE ROLE</small>
            <strong>{role || "Guest"}</strong>
          </div>
          <button className="icon-btn" onClick={() => navigate("/login")} title="Change role">↗</button>
        </div>
        <button className="reset-btn" onClick={resetDemo}>Reset local demo</button>
      </div>
    </aside>
  );
}