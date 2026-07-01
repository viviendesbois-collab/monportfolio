/* ==========================================================================
   MonPortfolio — Liste du blog (JavaScript vanilla)
   Lit blog/posts.json et génère les cartes d'articles.
   Données locales et de confiance (rédigées par l'auteur).
   Dépend de js/utils.js (escapeHtml, formatDisplayDate, fetchAndRenderGrid),
   chargé avant ce fichier.
   ========================================================================== */

const blogGrid = document.querySelector("[data-blog-grid]");

if (blogGrid) {
  fetchAndRenderGrid("blog/posts.json", blogGrid, {
    renderItem: renderCard,
    emptyMessage: "Aucun article pour le moment.",
    errorMessage: "Les articles n'ont pas pu être chargés.",
    messageClass: "blog__message",
    // Tri du plus récent au plus ancien (dates au format ISO AAAA-MM-JJ)
    sortBy: (a, b) => b.date.localeCompare(a.date),
  });
}

function renderCard(post) {
  const title = escapeHtml(post.title);
  const excerpt = escapeHtml(post.excerpt);
  const url = escapeHtml(post.url);
  const tags = post.tags
    .map((tag) => `<li class="project-card__tag">${escapeHtml(tag)}</li>`)
    .join("");

  return `
    <article class="project-card">
      <div class="project-card__banner" aria-hidden="true"></div>
      <h2 class="project-card__title">${title}</h2>
      <p class="project-card__date">${escapeHtml(formatDisplayDate(post.date))}</p>
      <p class="project-card__desc">${excerpt}</p>
      <ul class="project-card__tags">${tags}</ul>
      <a href="${url}" class="project-card__link">Lire l'article →</a>
    </article>`;
}

// escapeHtml, formatDisplayDate et fetchAndRenderGrid sont définies dans js/utils.js
