// ── À MODIFIER À CHAQUE DÉPLACEMENT ──
// Changez uniquement "name", "lat" et "lng" ci-dessous, puis publiez.
const CURRENT_LOCATION = {
  name: "Bâtiment Master, Antsiranana, Madagascar",
  lat: -12.287732,
  lng: 49.309596,
};
// ──────────────────────────────────────

const MADAGASCAR_VIEW = { lat: -18.766, lng: 46.869, zoom: 5.4 };
const MY_ZOOM = 19.5;

document.getElementById("locLabel").textContent = `📍 Position actuelle : ${CURRENT_LOCATION.name}`;

const map = L.map("map", {
  zoomSnap: 0.25,
  zoomDelta: 0.5,
  wheelPxPerZoomLevel: 60,
  minZoom: 3,
  maxZoom: 20,
  worldCopyJump: true,
  keepBuffer: 4,
}).setView([-14, 46.869], 2.5);

// Fond satellite (Esri World Imagery — résolution variable selon la zone)
// className applique un léger boost de contraste/saturation en CSS pour une image plus nette et lisible.
const satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics",
    maxZoom: 20,
    maxNativeZoom: 19,
    className: "sat-tiles",
  }
);

// Repères de lecture : frontières, régions, villes/villages — couche unique conçue par Esri
// spécifiquement pour être lue par-dessus de l'imagerie satellite (texte à halo contrasté).
const boundaries = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 20, maxNativeZoom: 16, className: "labels-tiles" }
);

const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 20,
  maxNativeZoom: 19,
});

// Vue par défaut : satellite + une seule couche de repères (évite le doublon de texte illisible)
const hybrid = L.layerGroup([satellite, boundaries]).addTo(map);

L.control
  .layers(
    { "🏔️ Hybride (recommandé)": hybrid, "🛰️ Satellite seul": satellite, "🗺️ Carte": streets },
    {},
    { position: "topright" }
  )
  .addTo(map);

L.control.scale({ imperial: false, position: "bottomleft", maxWidth: 150 }).addTo(map);

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

function leafletZoomToMe() {
  map.flyTo([CURRENT_LOCATION.lat, CURRENT_LOCATION.lng], MY_ZOOM, { duration: 1.6 });
  marker.openPopup();
}
function leafletZoomToMada() {
  map.flyTo([MADAGASCAR_VIEW.lat, MADAGASCAR_VIEW.lng], MADAGASCAR_VIEW.zoom, { duration: 1.6 });
}
