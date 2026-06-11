/* ==========================================================================
   Catalogue dynamique — Masmoudi Wedding Planner
   Le contenu est géré depuis l'application admin et chargé via son API.
   ========================================================================== */

/* IMPORTANT : remplacez par l'URL publique de votre application admin */
const CATALOGUE_API = "https://admin.masmoudiweddingplanner.com";

(function () {
  const root = document.getElementById('catalogue-app');
  if (!root) return;

  let data = { exclusive: [], stars: [], decorations: [], services: [] };
  let mainTab = 'artists';   // 'artists' | 'decor' | 'services'
  let subTab = 'exclusive';  // 'exclusive' | 'stars'

  const GOLD = '#d4b78f';

  /* Un média peut être une photo ou une vidéo : on choisit la balise selon l'extension */
  const isVideo = v => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(v || '');
  function mediaEl(v, opts = {}) {
    if (!v) return '';
    if (isVideo(v)) {
      return opts.controls
        ? `<video src="${esc(v)}" controls playsinline preload="metadata"></video>`
        : `<video src="${esc(v)}" muted playsinline loop preload="metadata"></video>`;
    }
    return `<img src="${esc(v)}" alt="${esc(opts.alt || '')}" loading="lazy">`;
  }

  /* ---------- Rendu ---------- */

  function render() {
    root.innerHTML = `
      <div class="d-flex justify-content-center mb-4">
        <div class="catalogue-tabs shadow-sm">
          ${mainTabBtn('artists', 'fa-music', 'Chanteurs Stars')}
          ${mainTabBtn('decor', 'fa-image', 'Décorations')}
          ${mainTabBtn('services', 'fa-concierge-bell', 'Services')}
        </div>
      </div>
      <div id="catalogue-content">${renderContent()}</div>
    `;
    bindEvents();
    observeVideos();
  }

  function mainTabBtn(key, icon, label) {
    const active = mainTab === key;
    return `<button class="catalogue-tab ${active ? 'active' : ''}" data-maintab="${key}">
      <i class="fas ${icon} me-2"></i>${label}
    </button>`;
  }

  function renderContent() {
    if (mainTab === 'artists') {
      return `
        <div class="d-flex justify-content-center mb-4">
          <div class="catalogue-subtabs">
            <button class="catalogue-subtab ${subTab === 'exclusive' ? 'active' : ''}" data-subtab="exclusive">Nos Artistes Exclusifs</button>
            <button class="catalogue-subtab ${subTab === 'stars' ? 'active' : ''}" data-subtab="stars">Les Stars Tunisiennes</button>
          </div>
        </div>
        ${subTab === 'exclusive' ? renderExclusive() : renderStars()}
      `;
    }
    if (mainTab === 'decor') return renderTiles(data.decorations);
    return renderTiles(data.services);
  }

  function renderExclusive() {
    if (!data.exclusive.length) return emptyState();
    return `<div class="row g-4">` + data.exclusive.map(a => `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="catalogue-video-card" data-item="exclusive:${a.id}">
          ${mediaEl(a.thumb || (a.media && a.media[0]), { alt: a.name })}
          <div class="cvc-overlay"></div>
          <div class="cvc-info">
            <div class="cvc-badge"><i class="fas fa-star"></i> EXCLUSIF</div>
            <h3>${esc(a.name)}</h3>
            <p>${esc(a.category || '')}</p>
            <span class="cvc-cta"><i class="fas fa-play"></i> Voir la prestation</span>
          </div>
        </div>
      </div>`).join('') + `</div>`;
  }

  function renderStars() {
    if (!data.stars.length) return emptyState();
    return `<div class="row g-3">` + data.stars.map(s => `
      <div class="col-6 col-sm-4 col-lg-3 col-xl-2-4">
        <div class="catalogue-star-card" data-item="stars:${s.id}">
          ${mediaEl(s.thumb || (s.media && s.media[0]), { alt: s.name })}
          <div class="csc-overlay"></div>
          <div class="csc-info">
            <h3>${esc(s.name)}</h3>
            <span>En savoir plus <i class="fas fa-arrow-right"></i></span>
          </div>
        </div>
      </div>`).join('') + `</div>`;
  }

  function renderTiles(items) {
    if (!items || !items.length) return emptyState();
    return `<div class="row g-4">` + items.map((d, idx) => `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="catalogue-tile">
          ${mediaEl(d.thumb || (d.media && d.media[0]), { alt: d.title })}
          <div class="ct-overlay"></div>
          <div class="ct-info">
            <h3>${esc(d.title)}</h3>
            <p>${esc(d.description || '')}</p>
          </div>
        </div>
      </div>`).join('') + `</div>`;
  }

  function emptyState() {
    return `<p class="text-center text-muted py-5" style="font-family:'Montserrat',sans-serif;">Contenu bientôt disponible.</p>`;
  }

  /* ---------- Modale ---------- */

  function openModal(section, id) {
    const item = (data[section] || []).find(i => i.id === id);
    if (!item) return;
    const isExclusive = section === 'exclusive';
    const name = item.name || item.title || '';

    const overlay = document.createElement('div');
    overlay.className = 'catalogue-modal';
    overlay.innerHTML = `
      <div class="cm-backdrop"></div>
      <div class="cm-dialog">
        <div class="cm-header">
          <div>
            <h2>${esc(name)}</h2>
            <p>${isExclusive ? '<i class="fas fa-star"></i> ' + esc(item.category || 'Artiste Exclusif') : 'Star Tunisienne'}</p>
          </div>
          <button class="cm-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="cm-body">
          <p class="cm-desc">${esc(item.description || '')}</p>
          ${(item.media || []).map(v => isVideo(v)
            ? `<div class="cm-video">${mediaEl(v, { controls: true })}</div>`
            : `<img class="cm-img" src="${esc(v)}" alt="${esc(name)}">`).join('')}
          <div class="cm-contact">
            <h3>Réserver ${esc(name)}</h3>
            <p>Masmoudi Wedding Planner gère pour vous la disponibilité et la réservation pour votre événement.</p>
            <a href="#contact" class="cm-contact-btn">Nous contacter</a>
          </div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const close = () => {
      overlay.remove();
      document.body.style.overflow = '';
    };
    overlay.querySelector('.cm-backdrop').addEventListener('click', close);
    overlay.querySelector('.cm-close').addEventListener('click', close);
    overlay.querySelector('.cm-contact-btn').addEventListener('click', close);
  }

  /* ---------- Événements ---------- */

  function bindEvents() {
    root.querySelectorAll('[data-maintab]').forEach(btn =>
      btn.addEventListener('click', () => { mainTab = btn.dataset.maintab; render(); }));
    root.querySelectorAll('[data-subtab]').forEach(btn =>
      btn.addEventListener('click', () => { subTab = btn.dataset.subtab; render(); }));
    root.querySelectorAll('[data-item]').forEach(card =>
      card.addEventListener('click', () => {
        const [section, id] = card.dataset.item.split(':');
        openModal(section, id);
      }));
  }

  function observeVideos() {
    const videos = root.querySelectorAll('#catalogue-content video');
    if (!videos.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.play().catch(() => {});
        else e.target.pause();
      });
    }, { threshold: 0.2 });
    videos.forEach(v => observer.observe(v));
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ---------- Chargement ---------- */

  fetch(CATALOGUE_API.replace(/\/$/, '') + '/api/public/catalogue')
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(json => { data = json; render(); })
    .catch(err => {
      console.error('Catalogue indisponible:', err);
      root.innerHTML = emptyState();
    });
})();
