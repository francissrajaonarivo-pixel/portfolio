// ── À MODIFIER À CHAQUE DÉPLACEMENT ──
// Changez uniquement "name", "lat" et "lng" ci-dessous, puis publiez.
const CURRENT_LOCATION = {
  name: "Antsiranana, Madagascar",
  lat: -12.2787,
  lng: 49.2917,
};
// ──────────────────────────────────────

const MADAGASCAR_VIEW = { lat: -18.766, lng: 46.869, zoom: 5.4 };
const MY_ZOOM = 13;

document.getElementById("locLabel").textContent = `📍 Position actuelle : ${CURRENT_LOCATION.name}`;

const map = L.map("map", {
  zoomSnap: 0.25,
  zoomDelta: 0.5,
  wheelPxPerZoomLevel: 90,
  minZoom: 3,
  maxZoom: 19,
  worldCopyJump: true,
}).setView([-14, 46.869], 2.5);

const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
});

const satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics",
    maxZoom: 19,
  }
).addTo(map);

const labels = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 19, pane: "shadowPane" }
);

const hybrid = L.layerGroup([satellite, labels]);

L.control
  .layers(
    { "🛰️ Satellite": satellite, "🗺️ Carte": streets, "🏔️ Hybride": hybrid },
    {},
    { position: "topright" }
  )
  .addTo(map);

L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

const marker = L.marker([CURRENT_LOCATION.lat, CURRENT_LOCATION.lng])
  .addTo(map)
  .bindPopup(`📍 ${CURRENT_LOCATION.name}`);

// Entrée cinématique : globe -> Madagascar -> position actuelle
setTimeout(() => {
  map.flyTo([MADAGASCAR_VIEW.lat, MADAGASCAR_VIEW.lng], MADAGASCAR_VIEW.zoom, { duration: 2.2 });
}, 500);
setTimeout(() => {
  map.flyTo([CURRENT_LOCATION.lat, CURRENT_LOCATION.lng], MY_ZOOM, { duration: 2.4 });
  marker.openPopup();
}, 3200);

document.getElementById("zoomToMe").addEventListener("click", () => {
  map.flyTo([CURRENT_LOCATION.lat, CURRENT_LOCATION.lng], MY_ZOOM, { duration: 1.6 });
  marker.openPopup();
});
document.getElementById("zoomToMada").addEventListener("click", () => {
  map.flyTo([MADAGASCAR_VIEW.lat, MADAGASCAR_VIEW.lng], MADAGASCAR_VIEW.zoom, { duration: 1.6 });
});
document.getElementById("zoomFullscreen").addEventListener("click", () => {
  const el = document.getElementById("map");
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    el.requestFullscreen().then(() => setTimeout(() => map.invalidateSize(), 200));
  }
});
document.addEventListener("fullscreenchange", () => setTimeout(() => map.invalidateSize(), 200));
