// Vue 3D : relief réel (élévation), inclinaison et rotation à la souris.
// Réutilise CURRENT_LOCATION et MADAGASCAR_VIEW définis dans location.js.

let map3dInstance = null;
let is3D = false;

function build3DStyle() {
  return {
    version: 8,
    sources: {
      satellite: {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        maxzoom: 19,
        attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics",
      },
      boundaries: {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        maxzoom: 16,
      },
      terrainSource: {
        type: "raster-dem",
        tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
        tileSize: 256,
        encoding: "terrarium",
        maxzoom: 15,
        attribution: "Terrain data &copy; Mapzen, SRTM, OpenStreetMap contributors",
      },
      hillshadeSource: {
        type: "raster-dem",
        tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
        tileSize: 256,
        encoding: "terrarium",
        maxzoom: 15,
      },
    },
    layers: [
      {
        id: "satellite",
        type: "raster",
        source: "satellite",
        paint: { "raster-saturation": 0.25, "raster-contrast": 0.15 },
      },
      {
        id: "hillshade",
        type: "hillshade",
        source: "hillshadeSource",
        paint: { "hillshade-exaggeration": 0.7 },
      },
      { id: "boundaries", type: "raster", source: "boundaries" },
    ],
    terrain: { source: "terrainSource", exaggeration: 1.6 },
    sky: {
      "sky-color": "#a7c8f2",
      "horizon-color": "#e8eef7",
      "fog-color": "#e8eef7",
      "fog-ground-blend": 0.5,
      "horizon-fog-blend": 0.6,
      "sky-horizon-blend": 0.8,
    },
  };
}

function init3D() {
  if (map3dInstance) return;

  map3dInstance = new maplibregl.Map({
    container: "map3d",
    style: build3DStyle(),
    center: [CURRENT_LOCATION.lng, CURRENT_LOCATION.lat],
    zoom: 11,
    pitch: 58,
    bearing: -20,
    antialias: true,
    maxPitch: 85,
    maxZoom: 24,
    minZoom: 0,
  });

  map3dInstance.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
  map3dInstance.addControl(new maplibregl.TerrainControl({ source: "terrainSource", exaggeration: 1.6 }), "top-right");

  map3dInstance.on("load", () => {
    map3dInstance.setTerrain({ source: "terrainSource", exaggeration: 1.6 });

    const el = document.createElement("div");
    el.className = "pulse-marker";
    el.innerHTML = `<span class="pulse-dot"></span><span class="pulse-ring"></span>`;

    new maplibregl.Marker({ element: el })
      .setLngLat([CURRENT_LOCATION.lng, CURRENT_LOCATION.lat])
      .setPopup(new maplibregl.Popup({ offset: 18 }).setHTML(`📍 <strong>${CURRENT_LOCATION.name}</strong>`))
      .addTo(map3dInstance);

    // Léger survol automatique pour révéler le relief à l'ouverture
    map3dInstance.easeTo({ bearing: 40, duration: 6000 });
  });
}

document.getElementById("toggle3D").addEventListener("click", () => {
  const map2dEl = document.getElementById("map");
  const map3dEl = document.getElementById("map3d");
  const btn = document.getElementById("toggle3D");
  const hint = document.getElementById("mapHint");

  is3D = !is3D;

  if (is3D) {
    map2dEl.style.display = "none";
    map3dEl.style.display = "block";
    btn.textContent = "🗾 Vue 2D";
    hint.textContent = "Astuce : glisser-déposer pour pivoter, clic droit + glisser (ou 2 doigts) pour incliner le relief.";
    init3D();
    setTimeout(() => map3dInstance && map3dInstance.resize(), 150);
  } else {
    map3dEl.style.display = "none";
    map2dEl.style.display = "block";
    btn.textContent = "🧊 Vue 3D";
    hint.textContent = "Astuce : molette pour zoomer, sélecteur en haut à droite pour basculer Carte / Satellite / Hybride.";
    if (typeof map !== "undefined") setTimeout(() => map.invalidateSize(), 150);
  }
});
