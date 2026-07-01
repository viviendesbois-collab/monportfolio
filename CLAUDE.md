# MonPortfolio

## Description
Portfolio développeur — site statique HTML / CSS / JavaScript vanilla, sans framework ni bundler. Document en français (`lang="fr"`).

## Architecture
- `index.html` — page principale du portfolio (sections Hero, À propos, Projets, Contact, Footer)
- `paiement.html` — maquette de page de paiement (démonstration, aucun paiement réel traité)
- `css/style.css` — styles globaux (variables CSS, composants BEM, responsive)
- `js/main.js` — interactivité du portfolio (menu mobile, animations au défilement)
- `js/paiement.js` — logique du formulaire de paiement (formatage des champs, validation)
- `assets/images/` — images et icônes

## Conventions de code
- HTML sémantique : `header`, `nav`, `main`, `section`, `article`, `footer`.
- CSS : méthodologie BEM pour le nommage des classes (`.block__element--modifier`).
- CSS : couleurs, polices et espacements définis via des variables CSS (`:root`), jamais codés en dur.
- Mobile-first : styles de base pour mobile, puis adaptation via media queries `min-width` (breakpoints `768px` et `1024px`).
- JavaScript : vanilla uniquement, aucune librairie ni framework.
- Variables et fonctions nommées en anglais ; contenu visible par l'utilisateur en français.

## Design
- Palette (via variables CSS) : fond `#0a0a0a`, surface `#141414`, texte `#e0e0e0`, accent `#64ffda`.
- Police : Inter (Google Fonts), graisses 400 / 500 / 600 / 700.
- Espacement aéré via une échelle cohérente (variables `--space-*`).
- Animations subtiles : transitions et keyframes CSS uniquement, pas de librairie.

## Interdictions
- Pas de librairie ni framework JavaScript (jQuery, React, etc.).
- Pas de framework CSS (Bootstrap, Tailwind).
- Pas de bundler (Webpack, Vite).
- Ne jamais modifier ce fichier CLAUDE.md sans permission explicite.

## Commandes
- Servir en local (recommandé, pour que les chemins relatifs CSS/JS se chargent) :
  `python3 -m http.server 8000` puis ouvrir `http://localhost:8000`.
- Ouverture directe du fichier : `open index.html` (macOS) / `xdg-open index.html` (Linux).
