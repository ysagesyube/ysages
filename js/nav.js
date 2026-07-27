(function () {
  function closeNav(nav, toggle) {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  document.querySelectorAll('.nav').forEach(function (nav) {
    const toggle = nav.querySelector('.nav-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });

    nav.querySelectorAll('.nav-links a, .nav-cta').forEach(function (link) {
      link.addEventListener('click', function () { closeNav(nav, toggle); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav(nav, toggle);
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1100) {
      document.querySelectorAll('.nav.is-open').forEach(function (nav) {
        const toggle = nav.querySelector('.nav-toggle');
        if (toggle) closeNav(nav, toggle);
      });
    }
  });
})();
