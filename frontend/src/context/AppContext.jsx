import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mockApi } from "../services/api";

const AppContext = createContext(null);
const STORAGE_KEY = "tracex-demo-state";

const initialProducts = [
  {
    id: "TX-10482",
    name: "Vaccine Batch A17",
    category: "Pharmaceutical",
    origin: "Nagpur Manufacturing Unit",
    currentCustodian: "Manufacturer",
    status: "REGISTERED",
    createdAt: "2026-09-28T08:20:00.000Z",
    history: [
      { eventType: "REGISTERED", from: "—", to: "Manufacturer", location: "Nagpur", timestamp: "2026-09-28T08:20:00.000Z", actor: "Manufacturer" }
    ]
  }
];

const defaultState = {
  role: "Manufacturer",
  products: initialProducts
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
  } catch {
    return defaultState;
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setRole = (role) => setState((s) => ({ ...s, role }));

  const registerProduct = async (payload) => {
    const product = {
      ...payload,
      id: payload.id.trim().toUpperCase(),
      currentCustodian: "Manufacturer",
      status: "REGISTERED",
      createdAt: new Date().toISOString(),
      history: [{
        eventType: "REGISTERED",
        from: "—",
        to: "Manufacturer",
        location: payload.origin,
        timestamp: new Date().toISOString(),
        actor: "Manufacturer"
      }]
    };
    await mockApi.register(product);
    setState((s) => ({ ...s, products: [product, ...s.products] }));
    return product;
  };

  const transferProduct = async (id, destination) => {
    let updated;
    setState((s) => {
      const product = s.products.find((p) => p.id === id);
      if (!product) throw new Error("Product not found.");
      if (product.currentCustodian !== s.role) throw new Error(`Transfer rejected: ${s.role} is not the current custodian.`);
      if (product.status === "IN_TRANSIT") throw new Error("Product is already in transit.");
      if (destination === s.role) throw new Error("Choose a different destination.");

      const next = {
        ...product,
        status: "IN_TRANSIT",
        history: [
          ...product.history,
          {
            eventType: "TRANSFERRED",
            from: s.role,
            to: destination,
            location: "Supply chain",
            timestamp: new Date().toISOString(),
            actor: s.role
          }
        ]
      };
      updated = next;
      return { ...s, products: s.products.map((p) => p.id === id ? next : p) };
    });
    await mockApi.transfer(id, destination);
    return updated;
  };

  const receiveProduct = async (id) => {
    let updated;
    setState((s) => {
      const product = s.products.find((p) => p.id === id);
      if (!product) throw new Error("Product not found.");
      const lastTransfer = [...product.history].reverse().find((e) => e.eventType === "TRANSFERRED");
      if (!lastTransfer || lastTransfer.to !== s.role || product.status !== "IN_TRANSIT") {
        throw new Error(`Receive rejected: ${s.role} is not the expected recipient.`);
      }

      const next = {
        ...product,
        currentCustodian: s.role,
        status: "RECEIVED",
        history: [
          ...product.history,
          {
            eventType: "RECEIVED",
            from: lastTransfer.from,
            to: s.role,
            location: "Supply chain",
            timestamp: new Date().toISOString(),
            actor: s.role
          }
        ]
      };
      updated = next;
      return { ...s, products: s.products.map((p) => p.id === id ? next : p) };
    });
    await mockApi.receive(id);
    return updated;
  };

  const resetDemo = () => setState(defaultState);

  const value = useMemo(() => ({
    ...state,
    setRole,
    registerProduct,
    transferProduct,
    receiveProduct,
    resetDemo
  }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}