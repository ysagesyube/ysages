(function(){
  const META = {
    en: { lang:'en',    title:'YSAGES · Infrastructure for Human Cultural Continuity', desc:'YSAGES is the Infrastructure for Human Cultural Continuity. We exist so that no culture ceases to exist.', canonical:'https://ysages.com/',    locale:'en_US', path:'/' },
    pt: { lang:'pt-BR', title:'YSAGES · Infraestrutura de Continuidade Cultural Humana', desc:'A YSAGES é a Infraestrutura de Continuidade Cultural Humana. Existimos para que nenhuma cultura deixe de existir.', canonical:'https://ysages.com/pt', locale:'pt_BR', path:'/pt' },
    es: { lang:'es',    title:'YSAGES · Infraestructura de Continuidad Cultural Humana', desc:'YSAGES es la Infraestructura de Continuidad Cultural Humana. Existimos para que ninguna cultura deje de existir.', canonical:'https://ysages.com/es', locale:'es_ES', path:'/es' }
  };
  let currentLang = null;
  let pagesReady = false;
  function detect(){
    const p = location.pathname.replace(/\/+$/,'').toLowerCase();
    if (p === '/pt' || p.endsWith('/pt')) return 'pt';
    if (p === '/es' || p.endsWith('/es')) return 'es';
    const saved = (function(){ try { return localStorage.getItem('ysages-lang'); } catch(e){ return null; } })();
    if (saved && META[saved]) return saved;
    const n = (navigator.language||'').toLowerCase();
    if (n.startsWith('pt')) return 'pt';
    if (n.startsWith('es')) return 'es';
    return 'en';
  }
  function setQuery(q, attr, value){
    document.querySelectorAll(q).forEach(el => {
      if (attr === 'text') el.textContent = value;
      else el.setAttribute(attr, value);
    });
  }
  function applyMeta(code){
    const m = META[code]; if (!m) return;
    document.documentElement.lang = m.lang;
    document.title = m.title;
    setQuery('meta[name="description"]', 'content', m.desc);
    setQuery('link[rel="canonical"]', 'href', m.canonical);
    setQuery('meta[property="og:title"]', 'content', m.title);
    setQuery('meta[property="og:description"]', 'content', m.desc);
    setQuery('meta[property="og:url"]', 'content', m.canonical);
    setQuery('meta[property="og:locale"]', 'content', m.locale);
    setQuery('meta[name="twitter:title"]', 'content', m.title);
    setQuery('meta[name="twitter:description"]', 'content', m.desc);
  }
  function applyPages(code){
    const pages = document.querySelectorAll('.lang-page');
    if (!pages.length) return false;
    pages.forEach(s => { s.hidden = s.dataset.lang !== code; });
    pagesReady = true;
    return true;
  }
  function refreshActive(code){
    document.querySelectorAll('.lang-switcher-inline').forEach(sw => {
      sw.querySelectorAll('a, span').forEach(el => {
        const label = (el.textContent||'').trim().toLowerCase();
        if (!['en','pt','es'].includes(label)) return;
        el.classList.toggle('active', label === code);
      });
    });
  }
  function apply(code, pushUrl){
    if (!META[code]) return;
    currentLang = code;
    applyMeta(code);
    applyPages(code);
    refreshActive(code);
    try { localStorage.setItem('ysages-lang', code); } catch(e){}
    if (pushUrl) {
      const target = META[code].path;
      if (location.pathname !== target) history.pushState({lang:code}, '', target);
    }
    document.dispatchEvent(new CustomEvent('ysages:langchange', {detail:{lang:code}}));
  }
  document.addEventListener('click', function(e){
    const t = e.target;
    if (!t || !t.closest) return;
    const sw = t.closest('.lang-switcher-inline');
    if (!sw) return;
    const el = t.closest('a, span');
    if (!el || el.classList.contains('sep') || el.classList.contains('disabled')) return;
    const label = (el.textContent||'').trim().toLowerCase();
    if (!['en','pt','es'].includes(label)) return;
    e.preventDefault();
    apply(label, true);
  }, true);
  window.addEventListener('popstate', function(){ const c = detect(); apply(c, false); });
  function init(){ const c = detect(); apply(c, false); }
  init();
  if (!pagesReady) {
    const startObserver = function(){
      if (!document.body) { setTimeout(startObserver, 30); return; }
      const obs = new MutationObserver(function(){
        if (document.querySelector('.lang-page')) {
          obs.disconnect();
          const c = currentLang || detect();
          applyPages(c);
          refreshActive(c);
        }
      });
      obs.observe(document.body, {childList:true, subtree:true});
      setTimeout(function(){ try { obs.disconnect(); } catch(e){} }, 15000);
    };
    startObserver();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){
      const c = currentLang || detect();
      apply(c, false);
    });
  }
})();
