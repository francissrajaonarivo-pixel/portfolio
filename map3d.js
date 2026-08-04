// Vue 3D unique : relief réel + satellite, avec l'angle de caméra repris d'un lien Google Earth.
// Réutilise CURRENT_LOCATION défini dans location.js.

const FINAL_ZOOM = 19.3;
const FINAL_PITCH = 45;
const FINAL_BEARING = CURRENT_LOCATION.heading;

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

const map3dInstance = new maplibregl.Map({
  container: "map3d",
  style: build3DStyle(),
  center: [CURRENT_LOCATION.lng, CURRENT_LOCATION.lat],
  zoom: 4,
  pitch: 0,
  bearing: 0,
  antialias: true,
  maxPitch: 85,
  maxZoom: 20,
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

  // Entrée cinématique : globe -> position exacte, à l'angle repris de Google Earth
  setTimeout(() => {
    map3dInstance.flyTo({
      center: [CURRENT_LOCATION.lng, CURRENT_LOCATION.lat],
      zoom: FINAL_ZOOM,
      pitch: FINAL_PITCH,
      bearing: FINAL_BEARING,
      duration: 4000,
    });
  }, 400);
});

function recenterView() {
  map3dInstance.flyTo({
    center: [CURRENT_LOCATION.lng, CURRENT_LOCATION.lat],
    zoom: FINAL_ZOOM,
    pitch: FINAL_PITCH,
    bearing: FINAL_BEARING,
    duration: 1600,
  });
}

document.getElementById("recenterView").addEventListener("click", recenterView);

document.getElementById("zoomFullscreen").addEventListener("click", () => {
  const el = document.getElementById("map3d");
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    el.requestFullscreen().catch(() => {});
  }
});
document.addEventListener("fullscreenchange", () => {
  setTimeout(() => map3dInstance.resize(), 200);
});
