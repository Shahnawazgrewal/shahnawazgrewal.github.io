/* Shared chrome: theme toggle + current-page nav highlight. */
(function () {
  var KEY = 'sn-theme';

  function apply(t) {
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
  }

  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
  apply(stored);

  document.addEventListener('DOMContentLoaded', function () {
    // Mark the nav link for the page we are on.
    var here = location.pathname.replace(/\/$/, '/index.html').split('/').pop() || 'index.html';
    document.querySelectorAll('nav.site-nav a').forEach(function (a) {
      var target = a.getAttribute('href').split('/').pop();
      if (target === here) a.setAttribute('aria-current', 'page');
    });

    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark' ||
        (!document.documentElement.getAttribute('data-theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      var next = dark ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
    });
  });
})();
