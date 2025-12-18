(function(){
  const SUBMIT_URL = "https://forms.gle/xUcm8cPiDVoDgMyN6";

  // Drawer wiring
  const menuBtn = document.getElementById('menuBtn');
  const drawer = document.getElementById('drawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer(){
    document.body.classList.add('drawer-open');
    drawer?.setAttribute('aria-hidden','false');
    menuBtn?.setAttribute('aria-expanded','true');
  }
  function closeDrawer(){
    document.body.classList.remove('drawer-open');
    drawer?.setAttribute('aria-hidden','true');
    menuBtn?.setAttribute('aria-expanded','false');
  }

  menuBtn?.addEventListener('click', openDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawer?.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.tagName === 'A') closeDrawer();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Active nav highlighting (desktop + drawer)
  function normalizePath(p){
    if (!p || p.endsWith('/')) return 'index.html';
    return (p.split('/').pop() || 'index.html');
  }
  const current = normalizePath(location.pathname);

  document.querySelectorAll('a[data-page]').forEach(a => {
    const page = a.getAttribute('data-page');
    if (page === current) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  // Ensure Submit links are consistent
  document.querySelectorAll('a[data-submit]').forEach(a => {
    a.href = SUBMIT_URL;
    a.target = "_blank";
    a.rel = "noopener";
  });

  // SVG placeholder generator
  function esc(s){
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function svgPlaceholder({ title='Image', subtitle='Replace with final image', w=1200, h=600 } = {}){
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2f8f5b" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#1b6b45" stop-opacity="0.18"/>
    </linearGradient>
    <pattern id="p" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M0 32 L32 0" stroke="#1b6b45" stroke-opacity="0.10" stroke-width="2"/>
    </pattern>
  </defs>
  <rect x="0" y="0" width="${w}" height="${h}" fill="#ffffff"/>
  <rect x="0" y="0" width="${w}" height="${h}" fill="url(#g)"/>
  <rect x="0" y="0" width="${w}" height="${h}" fill="url(#p)" opacity=".85"/>
  <rect x="24" y="24" width="${w-48}" height="${h-48}" rx="28" ry="28" fill="rgba(255,255,255,0.75)" stroke="rgba(15,23,42,0.14)"/>
  <g fill="#0f172a" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial">
    <text x="64" y="120" font-size="38" font-weight="800">${esc(title)}</text>
    <text x="64" y="170" font-size="20" fill="#475569">${esc(subtitle)}</text>
  </g>
  <g transform="translate(${w-220}, ${h-210})" opacity=".9">
    <rect x="0" y="0" width="156" height="156" rx="24" fill="rgba(47,143,91,0.10)" stroke="rgba(15,23,42,0.14)"/>
    <path d="M32 112 L70 74 L92 96 L126 60" fill="none" stroke="#1b6b45" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="56" cy="56" r="16" fill="rgba(47,143,91,0.25)" stroke="#1b6b45" stroke-width="4"/>
  </g>
</svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function hydrateImages(){
    document.querySelectorAll('img[data-placeholder]').forEach(img => {
      const kind = img.getAttribute('data-placeholder');
      const realSrc = img.getAttribute('data-src');
      const title = img.getAttribute('data-title') || (kind === 'avatar' ? 'Organizer photo' : 'Workshop image');
      const subtitle = img.getAttribute('data-subtitle') || (kind === 'avatar' ? (img.getAttribute('data-name') || 'Organizer') : 'Replace with final image');
      const w = kind === 'avatar' ? 400 : 1400;
      const h = kind === 'avatar' ? 400 : 720;

      if (realSrc){
        img.onerror = () => {
          img.removeAttribute('data-src');
          img.src = svgPlaceholder({ title, subtitle, w, h });
        };
        img.src = realSrc;
      } else {
        img.src = svgPlaceholder({ title, subtitle, w, h });
      }
    });
  }

  hydrateImages();
})();
