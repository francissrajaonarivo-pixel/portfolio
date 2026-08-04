// Vue Google Maps (mode "hybride" officiel : satellite + noms de lieux/routes) — sans clé API.
// Réutilise CURRENT_LOCATION et MADAGASCAR_VIEW définis dans location.js.

const googleWrap = document.getElementById("mapGoogle");
let googleLoaded = false;

function googleEmbedUrl(lat, lng, zoom, label) {
  const q = label ? `${lat},${lng}(${label})` : `${lat},${lng}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&t=h&output=embed`;
}

function initGoogle() {
  if (googleLoaded) return;
  const iframe = document.createElement("iframe");
  iframe.id = "googleMapsFrame";
  iframe.src = googleEmbedUrl(CURRENT_LOCATION.lat, CURRENT_LOCATION.lng, 20, CURRENT_LOCATION.name);
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.style.border = "0";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.title = "Carte Google Maps";
  googleWrap.appendChild(iframe);
  googleLoaded = true;
}

function googleZoomToMe() {
  const iframe = document.getElementById("googleMapsFrame");
  if (iframe) iframe.src = googleEmbedUrl(CURRENT_LOCATION.lat, CURRENT_LOCATION.lng, 20, CURRENT_LOCATION.name);
}

function googleZoomToMada() {
  const iframe = document.getElementById("googleMapsFrame");
  if (iframe) iframe.src = googleEmbedUrl(MADAGASCAR_VIEW.lat, MADAGASCAR_VIEW.lng, 6);
}
