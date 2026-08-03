# Portfolio — Rajaonaorivo Harinaivo Jean François

Site portfolio statique (HTML/CSS/JS, sans dépendance), généré à partir du CV.

## Avant de publier

1. **Photo** : placez votre photo dans `assets/photo.jpg` (format carré recommandé). Sans photo, un avatar avec vos initiales "HJF" s'affiche automatiquement.
2. **LinkedIn** : dans [index.html](index.html), remplacez le `href="#"` du lien `id="linkedinLink"` par l'URL réelle de votre profil LinkedIn.
3. Relisez les textes des sections (Formation, Expériences, etc.) et ajustez si besoin.

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
