// ── À MODIFIER À CHAQUE DÉPLACEMENT ──
// Changez "name", "lat" et "lng". Pour l'angle de vue (heading/pitch), ouvrez Google Earth Web,
// positionnez-vous où vous voulez, copiez le lien (@lat,lng,alt a,dist d,fov y,heading h,tilt t,roll r)
// et reportez lat/lng ici, et "heading" dans HEADING ci-dessous.
const CURRENT_LOCATION = {
  name: "Bâtiment Master, Antsiranana, Madagascar",
  lat: -12.28773549,
  lng: 49.30959578,
  heading: 219.3,
};
// ──────────────────────────────────────

document.getElementById("locLabel").textContent = `📍 Position actuelle : ${CURRENT_LOCATION.name}`;
