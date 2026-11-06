(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  if (!header || !toggle) return;

  const setMenu = open => {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.querySelectorAll('.nav-menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.querySelectorAll('.team-avatar img').forEach(img => {
    const showFallback = () => img.remove();
    img.addEventListener('error', showFallback);
    if (img.complete && !img.naturalWidth) showFallback();
  });
  addEventListener('resize', () => { if (innerWidth > 820) setMenu(false); });
})();
