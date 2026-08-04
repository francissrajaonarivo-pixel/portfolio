// Bascule entre les 3 vues de la carte : Leaflet (2D/Satellite/Hybride), 3D (relief), Google Maps.
// Les bibliothèques Leaflet (~150 Ko) et MapLibre GL (~800 Ko) ne sont chargées qu'à la demande :
// Leaflet quand la section Localisation approche du viewport, MapLibre GL seulement si l'onglet 3D est ouvert.
// Sur un portfolio, beaucoup de visiteurs ne scrollent jamais jusque-là : ça évite de leur faire payer
// ce poids pour rien.

function loadStylesheet(href) {
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = resolve;
    link.onerror = resolve;
    document.head.appendChild(link);
  });
}

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

let leafletPromise = null;
function ensureLeaflet() {
  if (!leafletPromise) {
    leafletPromise = Promise.all([
      loadStylesheet("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"),
      loadScriptOnce("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"),
    ]).then(() => initLeafletMap());
  }
  return leafletPromise;
}

let maplibrePromise = null;
function ensureMapLibre() {
  if (!maplibrePromise) {
    maplibrePromise = Promise.all([
      loadStylesheet("https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css"),
      loadScriptOnce("https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"),
    ]);
  }
  return maplibrePromise;
}

// Précharge Leaflet dès que la section Localisation approche (marge de 600px), sans attendre
// que l'utilisateur l'ait réellement sous les yeux — c'est la vue par défaut de cette section.
const localisationSection = document.getElementById("localisation");
if (localisationSection) {
  const preloadObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        ensureLeaflet();
        preloadObserver.disconnect();
      }
    },
    { rootMargin: "600px 0px" }
  );
  preloadObserver.observe(localisationSection);
}

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
  tabEls[view].setAttribute("aria-selected", "true");
  Object.entries(tabEls).forEach(([k, btn]) => {
    if (k !== view) btn.setAttribute("aria-selected", "false");
  });
  mapHintEl.textContent = hints[view];

  if (view === "3d") {
    ensureMapLibre().then(() => {
      init3D();
      setTimeout(() => map3dInstance && map3dInstance.resize(), 150);
    });
  } else if (view === "google") {
    initGoogle();
  } else {
    ensureLeaflet().then(() => setTimeout(() => map.invalidateSize(), 150));
  }
}

tabEls.leaflet.addEventListener("click", () => switchView("leaflet"));
tabEls["3d"].addEventListener("click", () => switchView("3d"));
tabEls.google.addEventListener("click", () => switchView("google"));

document.getElementById("zoomToMe").addEventListener("click", () => {
  if (currentView === "leaflet") {
    ensureLeaflet().then(leafletZoomToMe);
  } else if (currentView === "3d") {
    ensureMapLibre().then(() => {
      init3D();
      map3dZoomToMe();
    });
  } else {
    initGoogle();
    googleZoomToMe();
  }
});

document.getElementById("zoomToMada").addEventListener("click", () => {
  if (currentView === "leaflet") {
    ensureLeaflet().then(leafletZoomToMada);
  } else if (currentView === "3d") {
    ensureMapLibre().then(() => {
      init3D();
      map3dZoomToMada();
    });
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
    if (currentView === "leaflet" && map) map.invalidateSize();
  }, 200);
});
