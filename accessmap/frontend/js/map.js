let accessMapLeaflet;
let placeMarkers = [];

function initAccessMap() {
  const element = document.getElementById("map");
  if (!element || !window.L) {
    if (element) element.innerHTML = '<div class="loading-card">Map library unavailable. You can still explore the place list.</div>';
    return;
  }
  accessMapLeaflet = L.map("map", { scrollWheelZoom: false }).setView([28.6139, 77.2090], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(accessMapLeaflet);
}

function updateMapMarkers(places) {
  if (!accessMapLeaflet) return;
  placeMarkers.forEach(marker => marker.remove());
  placeMarkers = [];
  places.forEach(place => {
    if (typeof place.latitude !== "number" || typeof place.longitude !== "number") return;
    const marker = L.marker([place.latitude, place.longitude]).addTo(accessMapLeaflet);
    marker.bindPopup(`<strong>${escapeHTML(place.name)}</strong><br>${escapeHTML(place.address || "Address not provided")}`);
    placeMarkers.push(marker);
  });
  if (placeMarkers.length) {
    const group = L.featureGroup(placeMarkers);
    accessMapLeaflet.fitBounds(group.getBounds().pad(0.2), { maxZoom: 14 });
  }
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}
