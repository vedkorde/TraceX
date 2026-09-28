const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

const delay = (ms = 250) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function request(path, options = {}) {
  if (!BASE_URL || USE_MOCK) {
    await delay();
    return { ok: true, data: null };
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "API request failed."
    );
  }

  return data;
}

export const mockApi = {
  register: (product) =>
    request("/api/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  transfer: (id, destination) =>
    request(`/api/products/${id}/transfer`, {
      method: "POST",
      body: JSON.stringify({ destination }),
    }),

  receive: (id) =>
    request(`/api/products/${id}/receive`, {
      method: "POST",
    }),

  get: (id) =>
    request(`/api/products/${id}`),

  history: (id) =>
    request(`/api/products/${id}/history`),

  verify: (id) =>
    request(`/api/products/${id}/verify`),
};