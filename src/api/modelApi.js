// src/api/modelApi.js
const API_BASE = import.meta?.env?.VITE_API_BASE || "https://void.vynqe.com";
async function post(path, body) {
  const requestBody = body ?? {};

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

export function greetUser(payload) {
  return post("/greet_user", payload);
}

// you only have /predict_action right now
export function predictAction(payload) {
  return post("/predict_action", payload);
}
