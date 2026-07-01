/* ==========================================================================
   MonPortfolio — Interactivité globale (JavaScript vanilla)
   Dépend de js/utils.js (escapeHtml, formatDisplayDate, fetchAndRenderGrid),
   chargé avant ce fichier.
   ========================================================================== */

// --- Menu mobile : ouvre/ferme la navigation au clic sur le bouton burger ---
const navToggle = document.querySelector(".header__toggle");
const nav = document.querySelector(".nav");

if (navToggle && nav) {
  const navToggleIcon = navToggle.querySelector("span");
  const mainEl = document.querySelector("main");
  const footerEl = document.querySelector("footer");

  // Centralise l'état ouvert/fermé : classe, aria-expanded, libellé, icône, et neutralise
  // (inert) le contenu caché derrière l'overlay pour ne pas pouvoir y tabuler
  const setNavOpen = (isOpen) => {
    nav.classList.toggle("nav--open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    if (navToggleIcon) navToggleIcon.textContent = isOpen ? "✕" : "☰";
    if (mainEl) mainEl.inert = isOpen;
    if (footerEl) footerEl.inert = isOpen;
  };

  navToggle.addEventListener("click", () => {
    setNavOpen(!nav.classList.contains("nav--open"));
  });

  // Referme le menu après un clic sur un lien (utile sur mobile)
  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      setNavOpen(false);
    });
  });

  // Échap referme le menu et rend le focus au bouton burger
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("nav--open")) {
      setNavOpen(false);
      navToggle.focus();
    }
  });
}

// --- Bascule du thème clair / sombre (la préférence est mémorisée) ---
const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  // Reflète l'état courant pour les lecteurs d'écran (aria-pressed + libellé décrivant l'action)
  const syncThemeToggleA11y = (theme) => {
    const isLight = theme === "light";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "Activer le mode sombre" : "Activer le mode clair");
  };

  syncThemeToggleA11y(document.documentElement.getAttribute("data-theme"));

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    syncThemeToggleA11y(next);
  });
}

// --- Animations d'apparition : révèle les éléments .reveal au défilement ---
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  // Repli : si l'API n'est pas disponible, on affiche tout directement
  revealElements.forEach((el) => el.classList.add("is-visible"));
}

// --- Formulaire de contact : pas de backend pour l'instant ---
const contactForm = document.querySelector(".contact__form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

// --- Année dynamique dans le pied de page ---
const yearEl = document.querySelector("[data-current-year]");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// --- Section Projets : lit data/projects.json et génère les cartes ---
const projectsGrid = document.querySelector("[data-projects-grid]");

if (projectsGrid) {
  fetchAndRenderGrid("data/projects.json", projectsGrid, {
    renderItem: renderProjectCard,
    emptyMessage: "Aucun projet pour le moment.",
    errorMessage: "Impossible de charger les projets.",
    messageClass: "projects__message",
  });
}

function renderProjectCard(project) {
  const rawDescription = project.description && project.description.trim()
    ? project.description
    : "Pas de description disponible.";
  const description = escapeHtml(rawDescription);
  const name = escapeHtml(project.name);
  const url = escapeHtml(project.url);
  // (project.languages || []) : un projet du JSON peut ne pas avoir ce champ, on ne casse pas le rendu des autres cartes
  const tags = (project.languages || [])
    .map((language) => `<li class="project-card__tag">${escapeHtml(language)}</li>`)
    .join("");
  // Pas de date affichée si le champ est absent, plutôt qu'un "Invalid Date" visible
  const dateHtml = project.lastUpdated
    ? `<p class="project-card__date">${escapeHtml(formatDisplayDate(project.lastUpdated))}</p>`
    : "";

  return `
    <article class="project-card">
      <div class="project-card__banner" aria-hidden="true"></div>
      <h3 class="project-card__title"><a href="${url}" target="_blank" rel="noopener" aria-label="${name} (ouvre un nouvel onglet)">${name}</a></h3>
      <p class="project-card__desc">${description}</p>
      ${dateHtml}
      <ul class="project-card__tags">${tags}</ul>
      <a href="${url}" class="project-card__link" target="_blank" rel="noopener" aria-label="Voir ${name} sur GitHub (ouvre un nouvel onglet)">Voir sur GitHub →</a>
    </article>`;
}

// escapeHtml, formatDisplayDate et fetchAndRenderGrid sont définies dans js/utils.js

// --- Section Actualités : lit data/news.json et génère les cartes ---
const newsGrid = document.querySelector("[data-news-grid]");

if (newsGrid) {
  fetchAndRenderGrid("data/news.json", newsGrid, {
    renderItem: renderNewsCard,
    emptyMessage: "Aucune actualité pour le moment.",
    errorMessage: "Impossible de charger les actualités.",
    messageClass: "news__message",
    // (a.date || "") car le champ peut être absent
    sortBy: (a, b) => (b.date || "").localeCompare(a.date || ""),
  });
}

function renderNewsCard(item) {
  const title = escapeHtml(item.title || "Sans titre");
  const excerpt = escapeHtml(item.excerpt || "");
  // Pas de date affichée si le champ est absent, plutôt qu'un "Invalid Date" visible
  const dateHtml = item.date
    ? `<p class="project-card__date">${escapeHtml(formatDisplayDate(item.date))}</p>`
    : "";
  // Pas de liste de tags si le champ est absent (item.tag est une chaîne unique, pas un tableau)
  const tagsHtml = item.tag
    ? `<ul class="project-card__tags"><li class="project-card__tag">${escapeHtml(item.tag)}</li></ul>`
    : "";

  return `
    <article class="project-card">
      <div class="project-card__banner" aria-hidden="true"></div>
      <h3 class="project-card__title">${title}</h3>
      <p class="project-card__desc">${excerpt}</p>
      ${dateHtml}
      ${tagsHtml}
    </article>`;
}

