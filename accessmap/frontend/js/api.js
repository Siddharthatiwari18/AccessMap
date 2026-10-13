const API_BASE = window.ACCESSMAP_API_BASE || "http://localhost:8080/api/v1";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Request failed (${response.status})`);
  }
  if (response.status === 204) return null;
  return response.json();
}

const AccessMapAPI = {
  places: () => apiRequest("/places"),
  place: (id) => apiRequest(`/places/${encodeURIComponent(id)}`),
  reports: (id) => apiRequest(`/places/${encodeURIComponent(id)}/reports`),
  submitReport: (id, report) => apiRequest(`/places/${encodeURIComponent(id)}/reports`, {
    method: "POST", body: JSON.stringify(report)
  }),
  ask: (question) => apiRequest("/ai/ask", {
    method: "POST", body: JSON.stringify({ question })
  })
};
