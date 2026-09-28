import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Toast from "./components/Toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterProduct from "./pages/RegisterProduct";
import TransferReceive from "./pages/TransferReceive";
import VerifyProduct from "./pages/VerifyProduct";
import { useApp } from "./context/AppContext";

export default function App() {
  const { role } = useApp();
  const [toast, setToast] = useState(null);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-shell">
        <Topbar />
        <div className="page-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard notify={setToast} />} />
            <Route path="/register" element={<RegisterProduct notify={setToast} />} />
            <Route path="/transfer" element={<TransferReceive notify={setToast} />} />
            <Route path="/verify/:id" element={<VerifyProduct />} />
            <Route path="/" element={<Navigate to={role ? "/dashboard" : "/login"} replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}