// Bascule entre les 3 vues de la carte : Leaflet (2D/Satellite/Hybride), 3D (relief), Google Maps.

let currentView = "leaflet";

const viewEls = {
  leaflet: document.getElementById("map"),
  "3d": document.getElementById("map3d"),
  google: document.getElementById("mapGoogle"),
};
const tabEls = {
  leaflet: document.getElementById("viewLeaflet"),
  "3d": document.getElementById("view3D"),
  google: document.getElementById("viewGoogle"),
};
const mapHintEl = document.getElementById("mapHint");
const hints = {
  leaflet: "Astuce : molette pour zoomer, sélecteur en haut à droite pour basculer Carte / Satellite / Hybride.",
  "3d": "Astuce : glisser-déposer pour pivoter, clic droit + glisser (ou 2 doigts) pour incliner le relief.",
  google: "Vue Google Maps — la plus détaillée pour se repérer précisément.",
};

function switchView(view) {
  currentView = view;
  Object.entries(viewEls).forEach(([k, el]) => {
    el.style.display = k === view ? "block" : "none";
  });
  Object.entries(tabEls).forEach(([k, btn]) => btn.classList.toggle("active", k === view));
  mapHintEl.textContent = hints[view];

  if (view === "3d") {
    init3D();
    setTimeout(() => map3dInstance && map3dInstance.resize(), 150);
  } else if (view === "google") {
    initGoogle();
  } else {
    setTimeout(() => map.invalidateSize(), 150);
  }
}

tabEls.leaflet.addEventListener("click", () => switchView("leaflet"));
tabEls["3d"].addEventListener("click", () => switchView("3d"));
tabEls.google.addEventListener("click", () => switchView("google"));

document.getElementById("zoomToMe").addEventListener("click", () => {
  if (currentView === "leaflet") leafletZoomToMe();
  else if (currentView === "3d") {
    init3D();
    map3dZoomToMe();
  } else {
    initGoogle();
    googleZoomToMe();
  }
});

document.getElementById("zoomToMada").addEventListener("click", () => {
  if (currentView === "leaflet") leafletZoomToMada();
  else if (currentView === "3d") {
    init3D();
    map3dZoomToMada();
  } else {
    initGoogle();
    googleZoomToMada();
  }
});

document.getElementById("zoomFullscreen").addEventListener("click", () => {
  const el = viewEls[currentView];
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    el.requestFullscreen().catch(() => {});
  }
});
document.addEventListener("fullscreenchange", () => {
  setTimeout(() => {
    if (currentView === "3d" && map3dInstance) map3dInstance.resize();
    if (currentView === "leaflet") map.invalidateSize();
  }, 200);
});
