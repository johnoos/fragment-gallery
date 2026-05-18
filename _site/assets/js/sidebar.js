// sidebar.js
export function toggleSidebar() {
  const sidebar = document.getElementById('navig-rail-container');
  const overlay = document.getElementById('sidebar-overlay');
  const menuBtn = document.querySelector('.menu-toggle');
  if (!sidebar) return;


  sidebar.classList.toggle('open');
    console.log('Sidebar toggled. Classes:', sidebar.className);

  /* sidebar.classList.toggle('mobile-open'); */
  overlay?.classList.toggle('active');

  if (menuBtn) {
    menuBtn.textContent = sidebar.classList.contains('mobile-open') ? '✕' : '☰';
  }
}

export function closeSidebarIfClickedOutside() {
  const overlay = document.getElementById('sidebar-overlay');
  const sidebar = document.getElementById('navig-rail-container');
  const menuBtn = document.querySelector('.menu-toggle');

  document.addEventListener('click', function(e) {
    if (!sidebar || !sidebar.classList.contains('mobile-open')) return;
    if (sidebar.contains(e.target) || menuBtn.contains(e.target)) return;
    if (e.target.closest('.pdf-viewer-container')) return;

    sidebar.classList.remove('mobile-open');
    overlay?.classList.remove('active');
    document.body.classList.remove('menu-open');
    menuBtn && (menuBtn.textContent = '☰');
  });

  overlay?.addEventListener('click', () => {
    sidebar?.classList.remove('mobile-open');
    overlay.classList.remove('active');
  });
}