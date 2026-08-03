// ── À MODIFIER À CHAQUE DÉPLACEMENT ──
// Changez uniquement "name", "lat" et "lng" ci-dessous, puis publiez.
const CURRENT_LOCATION = {
  name: "Antsiranana, Madagascar",
  lat: -12.2787,
  lng: 49.2917,
};
// ──────────────────────────────────────

const MADAGASCAR_VIEW = { lat: -18.766, lng: 46.869, zoom: 5 };

document.getElementById("locLabel").textContent = `📍 Position actuelle : ${CURRENT_LOCATION.name}`;

const map = L.map("map", { scrollWheelZoom: false }).setView(
  [MADAGASCAR_VIEW.lat, MADAGASCAR_VIEW.lng],
  MADAGASCAR_VIEW.zoom
);

const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
}).addTo(map);

const satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics",
    maxZoom: 19,
  }
);

L.control.layers({ "Carte": streets, "Satellite": satellite }).addTo(map);

L.marker([CURRENT_LOCATION.lat, CURRENT_LOCATION.lng])
  .addTo(map)
  .bindPopup(`📍 ${CURRENT_LOCATION.name}`)
  .openPopup();

// Active le zoom molette seulement après un clic, pour ne pas bloquer le défilement de la page
map.on("click", () => map.scrollWheelZoom.enable());
document.addEventListener("click", (e) => {
  if (!e.target.closest("#map")) map.scrollWheelZoom.disable();
});

document.getElementById("zoomToMe").addEventListener("click", () => {
  map.flyTo([CURRENT_LOCATION.lat, CURRENT_LOCATION.lng], 12);
});
document.getElementById("zoomToMada").addEventListener("click", () => {
  map.flyTo([MADAGASCAR_VIEW.lat, MADAGASCAR_VIEW.lng], MADAGASCAR_VIEW.zoom);
});
