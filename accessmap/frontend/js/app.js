let allPlaces = [];
let activeFilter = "all";

const featureLabels = {
  RAMP: "Ramp", STEP_FREE: "Step-free entry", ACCESSIBLE_TOILET: "Accessible toilet",
  PARKING: "Accessible parking", DOOR_WIDTH: "Door width"
};

function statusLabel(status) {
  return ({ YES: "Reported: yes", NO: "Reported: no", LIMITED: "Limited", UNKNOWN: "Unknown" })[status] || "Unknown";
}

function renderPlaceCard(place) {
  const reports = Array.isArray(place.accessibility) ? place.accessibility : [];
  const tags = reports.slice(0, 4).map(item =>
    `<span class="status-tag ${item.status === "UNKNOWN" ? "unknown" : ""}">${escapeHTML(featureLabels[item.feature] || item.feature)} · ${escapeHTML(statusLabel(item.status))}</span>`
  ).join("");
  return `<article class="place-card" tabindex="0" data-place-id="${escapeHTML(place.id)}">
    <div class="place-top"><div><h3>${escapeHTML(place.name)}</h3><p class="place-address">${escapeHTML(place.address || "Address not provided")}</p><div class="place-category">${escapeHTML(place.category || "Community place")}</div></div><span class="place-open" aria-hidden="true">↗</span></div>
    <div class="status-list">${tags || '<span class="status-tag unknown">No accessibility reports yet</span>'}</div>
  </article>`;
}

function filteredPlaces() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  return allPlaces.filter(place => {
    const matchesQuery = !query || `${place.name} ${place.address} ${place.category}`.toLowerCase().includes(query);
    const matchesFilter = activeFilter === "all" || (place.accessibility || []).some(item => item.feature === activeFilter && item.status === "YES");
    return matchesQuery && matchesFilter;
  });
}

function renderPlaces() {
  const list = document.getElementById("placeList");
  const places = filteredPlaces();
  document.getElementById("placeCount").textContent = `${places.length} place${places.length === 1 ? "" : "s"} shown`;
  list.innerHTML = places.length ? places.map(renderPlaceCard).join("") : '<div class="empty-card">No matching places. Try another search or filter.</div>';
  list.querySelectorAll(".place-card").forEach(card => {
    const open = () => {
      list.querySelectorAll(".place-card").forEach(item => item.classList.remove("selected"));
      card.classList.add("selected");
      const place = places.find(item => String(item.id) === card.dataset.placeId);
      if (place && accessMapLeaflet && typeof place.latitude === "number" && typeof place.longitude === "number") {
        accessMapLeaflet.setView([place.latitude, place.longitude], 15);
        const marker = placeMarkers.find(m => {
          const p = m.getLatLng();
          return p.lat === place.latitude && p.lng === place.longitude;
        });
        if (marker) marker.openPopup();
      }
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
  const select = document.getElementById("reportPlace");
  const current = select.value;
  select.innerHTML = '<option value="">Choose a place…</option>' + allPlaces.map(p => `<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)}</option>`).join("");
  if (allPlaces.some(p => String(p.id) === current)) select.value = current;
  updateMapMarkers(places);
}

async function loadPlaces() {
  const list = document.getElementById("placeList");
  try {
    allPlaces = await AccessMapAPI.places();
    renderPlaces();
  } catch (error) {
    document.getElementById("placeCount").textContent = "Demo data";
    list.innerHTML = '<div class="empty-card">Could not reach the API. Start the backend to load live demo data.</div>';
    allPlaces = [];
  }
}

function setupFilters() {
  document.querySelectorAll(".filter-chip").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("selected"));
    button.classList.add("selected");
    activeFilter = button.dataset.filter;
    renderPlaces();
  }));
  document.getElementById("searchForm").addEventListener("submit", event => { event.preventDefault(); renderPlaces(); });
  document.getElementById("searchInput").addEventListener("input", renderPlaces);
  document.getElementById("reportTopButton").addEventListener("click", () => document.getElementById("report").scrollIntoView({ behavior: "smooth" }));
}

document.addEventListener("DOMContentLoaded", () => {
  initAccessMap();
  setupFilters();
  setupAssistant();
  setupVoiceInput();
  setupReportForm();
  loadPlaces();
});
