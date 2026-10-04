// Site-wide behavior: mobile menu, quick-action bar, map animation trigger.
const menu = document.getElementById('sheet');
const openBtn = document.querySelector('[data-menu-open]');
if (menu && openBtn) {
  let lastFocus = null;
  const focusables = () => [...menu.querySelectorAll('a, button')];
  const close = () => {
    menu.hidden = true;
    openBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    (lastFocus || openBtn).focus();
  };
  openBtn.addEventListener('click', () => {
    lastFocus = document.activeElement;
    menu.hidden = false;
    openBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    focusables()[1]?.focus();
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('[data-menu-close]')) close();
    else if (e.target.closest('a')) { menu.hidden = true; document.documentElement.style.overflow = ''; openBtn.setAttribute('aria-expanded', 'false'); }
  });
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') return close();
    if (e.key !== 'Tab') return;
    const f = focusables(), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

// Hide the phone action bar while the hero buttons or the request form are on screen,
// so it never covers them.
const bar = document.getElementById('actionbar');
if (bar && 'IntersectionObserver' in window) {
  const vis = new Map();
  const update = (entries) => {
    entries.forEach((en) => vis.set(en.target, en.isIntersecting));
    bar.classList.toggle('away', [...vis.values()].some(Boolean));
  };
  const heroCta = document.querySelector('[data-hide-bar]');
  if (heroCta) new IntersectionObserver(update, { threshold: 0.5 }).observe(heroCta);
  const req = document.getElementById('request');
  if (req) new IntersectionObserver(update, { threshold: 0, rootMargin: '0px 0px -90px 0px' }).observe(req);
}

// Start the map's route animation only while it's visible.
const map = document.querySelector('[data-map]');
if (map && 'IntersectionObserver' in window) {
  new IntersectionObserver(([en]) => map.classList.toggle('live', en.isIntersecting)).observe(map);
}
