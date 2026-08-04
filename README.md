# Portfolio — Rajaonarivo Harinaivo Jean Francis

Site portfolio statique (HTML/CSS/JS, sans dépendance), généré à partir du CV.

## Avant de publier

1. **Photo** : placez votre photo dans `assets/photo.jpg` (format carré recommandé). Sans photo, un avatar avec vos initiales "HJF" s'affiche automatiquement.
2. **LinkedIn** : dans [index.html](index.html), remplacez le `href="#"` du lien `id="linkedinLink"` par l'URL réelle de votre profil LinkedIn.
3. Relisez les textes des sections (Formation, Expériences, etc.) et ajustez si besoin.

## Mettre à jour votre position sur la carte 3D

La carte (section Localisation) est une vue 3D unique (relief + satellite), positionnée exactement comme un lien Google Earth.

1. Ouvrez [Google Earth Web](https://earth.google.com/web/), placez-vous à l'endroit et à l'angle voulus, copiez le lien de la barre d'adresse. Il ressemble à :
   `.../@LAT,LNG,ALTa,DISTd,FOVy,HEADINGh,TILTt,ROLLr/...`
2. Ouvrez [location.js](location.js) et reportez les valeurs :
   ```js
   const CURRENT_LOCATION = {
     name: "Votre lieu, Madagascar",
     lat: LAT,       // 1ère valeur après le @
     lng: LNG,       // 2ème valeur après le @
     heading: HEADING, // la valeur juste avant le "h"
   };
   ```
3. Republiez (commit + push).

**Important** : après chaque mise à jour de `location.js`, augmentez le numéro de version dans [index.html](index.html) (`location.js?v=11` → `?v=12`, et `map3d.js?v=9` → `?v=10` si vous touchez aussi ce fichier). Sans ça, les navigateurs qui ont déjà visité le site gardent l'ancienne position en cache jusqu'à 10 minutes.

## Ajouter du contenu lourd (vidéos, photos HD, PDF de projets)

GitHub Pages est gratuit mais a des limites : ~100 Mo max par fichier, dépôt recommandé sous 1 Go, ~100 Go de bande passante/mois. Pour rester rapide et professionnel :

- **Vidéos** : ne jamais les mettre directement dans le dépôt. Publiez-les sur YouTube ou Vimeo (non répertorié si besoin de discrétion), puis intégrez-les avec la classe déjà prête dans [style.css](style.css) :
  ```html
  <div class="video-embed">
    <iframe src="https://www.youtube.com/embed/VOTRE_ID" loading="lazy" allowfullscreen></iframe>
  </div>
  ```
- **Photos de projets (galerie)** : compressez-les avant import (viser <300 Ko/photo, [squoosh.app](https://squoosh.app) fait ça gratuitement), placez-les dans `assets/`, et utilisez :
  ```html
  <div class="photo-gallery">
    <img src="assets/projet1.jpg" alt="..." loading="lazy" decoding="async">
  </div>
  ```
  `loading="lazy"` évite de charger les images hors écran tant que le visiteur n'a pas scrollé jusque-là.
- **Rapports/PDF techniques** : comme pour le CV, gardez-les sous ~5 Mo (compressez avec un outil comme [ilovepdf.com](https://www.ilovepdf.com)) et placez-les dans `assets/`.

## Aperçu en local

Ouvrez simplement `index.html` dans un navigateur, ou lancez un petit serveur local :

```bash
python -m http.server 8000
```

puis rendez-vous sur http://localhost:8000

## Publier sur GitHub Pages

```bash
git init
git add .
git commit -m "Portfolio initial"
git branch -M main
git remote add origin https://github.com/<votre-utilisateur>/<nom-du-repo>.git
git push -u origin main
```

Puis dans le repo GitHub : **Settings → Pages → Source : branche `main`, dossier `/ (root)`**.
Le site sera disponible à `https://<votre-utilisateur>.github.io/<nom-du-repo>/`.
