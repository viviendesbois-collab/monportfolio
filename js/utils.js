/* ==========================================================================
   MonPortfolio — Fonctions utilitaires partagées (JavaScript vanilla)
   Chargé avant js/main.js et js/blog.js via une balise <script> dédiée
   (pas de module ES ni de bundler) : les fonctions ci-dessous sont
   globales et utilisées par les deux fichiers.
   ========================================================================== */

// Échappe une valeur avant injection via innerHTML (les données JSON sont modifiées à la main, pas de garantie sur leur contenu)
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Formate une date ISO (YYYY-MM-DD) en français, ex. "15 novembre 2025"
function formatDisplayDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Affiche un message d'état (vide ou erreur) juste après une grille
function showGridMessage(grid, messageClass, text) {
  const message = document.createElement("p");
  message.className = messageClass;
  message.textContent = text;
  grid.insertAdjacentElement("afterend", message);
}

// Factorise le pattern fetch -> rendu des cartes -> repli vide/erreur, commun aux grilles
// Projets, Actualités (js/main.js) et Blog (js/blog.js). `sortBy` est optionnel.
function fetchAndRenderGrid(url, grid, { renderItem, emptyMessage, errorMessage, messageClass, sortBy }) {
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Réponse réseau invalide");
      return response.json();
    })
    .then((items) => {
      if (items.length === 0) {
        showGridMessage(grid, messageClass, emptyMessage);
        return;
      }

      if (sortBy) items.sort(sortBy);
      grid.innerHTML = items.map(renderItem).join("");
    })
    .catch(() => {
      showGridMessage(grid, messageClass, errorMessage);
    });
}
