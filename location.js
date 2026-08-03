// ── À MODIFIER À CHAQUE DÉPLACEMENT ──
// Changez uniquement "name", "lat" et "lng" ci-dessous, puis publiez.
const CURRENT_LOCATION = {
  name: "Antsiranana, Madagascar",
  lat: -12.2787,
  lng: 49.2917,
};
// ──────────────────────────────────────

const MADAGASCAR_VIEW = { lat: -18.766, lng: 46.869, zoom: 5.4 };
const MY_ZOOM = 16;

document.getElementById("locLabel").textContent = `📍 Position actuelle : ${CURRENT_LOCATION.name}`;

const map = L.map("map", {
  zoomSnap: 0.25,
  zoomDelta: 0.5,
  wheelPxPerZoomLevel: 90,
  minZoom: 3,
  maxZoom: 19,
  worldCopyJump: true,
}).setView([-14, 46.869], 2.5);

// Fond satellite (Esri World Imagery — résolution variable selon la zone)
const satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics",
    maxZoom: 19,
    maxNativeZoom: 17,
  }
);

// Repères administratifs : régions, provinces, frontières
const boundaries = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 19, maxNativeZoom: 16 }
);

// Noms de lieux (villes, villages, quartiers) — couche dense, complémentaire
const placeLabels = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
  {
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    maxNativeZoom: 18,
    subdomains: "abcd",
  }
);

const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
});

// Vue par défaut : satellite + toutes les couches de repères (régions, frontières, noms de lieux)
const hybrid = L.layerGroup([satellite, boundaries, placeLabels]).addTo(map);

L.control
  .layers(
    { "🏔️ Hybride (recommandé)": hybrid, "🛰️ Satellite seul": satellite, "🗺️ Carte": streets },
    {},
    { position: "topright" }
  )
  .addTo(map);

L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

// Marqueur bien visible avec pastille pulsante
const pulseIcon = L.divIcon({
  className: "",
  html: `<div class="pulse-marker"><span class="pulse-dot"></span><span class="pulse-ring"></span></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});
const marker = L.marker([CURRENT_LOCATION.lat, CURRENT_LOCATION.lng], { icon: pulseIcon, zIndexOffset: 1000 })
  .addTo(map)
  .bindPopup(`📍 <strong>${CURRENT_LOCATION.name}</strong><br>Position actuelle`);

// Entrée cinématique : globe -> Madagascar -> position actuelle (zoom rapproché)
setTimeout(() => {
  map.flyTo([MADAGASCAR_VIEW.lat, MADAGASCAR_VIEW.lng], MADAGASCAR_VIEW.zoom, { duration: 2.2 });
}, 500);
setTimeout(() => {
  map.flyTo([CURRENT_LOCATION.lat, CURRENT_LOCATION.lng], MY_ZOOM, { duration: 2.6 });
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
