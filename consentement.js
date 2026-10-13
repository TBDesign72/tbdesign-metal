/* ==========================================================================
   TB Design Métal — consentement aux cookies de mesure d'audience
   Google Analytics n'est chargé qu'après « Accepter ». Le choix est gardé
   6 mois dans le navigateur, puis redemandé. Un lien portant l'attribut
   data-tb-cookies (ex. « Gérer les cookies ») rouvre le bandeau.
   ========================================================================== */
(function () {
  var CLE = 'tbConsentement', ID_GA = 'G-EJ17KD2KZK', DUREE = 182 * 864e5;

  function lire() {
    try {
      var v = JSON.parse(localStorage.getItem(CLE));
      if (v && (v.choix === 'oui' || v.choix === 'non') && Date.now() - v.t < DUREE) return v.choix;
    } catch (e) {}
    return null;
  }
  function ecrire(choix) {
    try { localStorage.setItem(CLE, JSON.stringify({ choix: choix, t: Date.now() })); } catch (e) {}
  }

  function chargerGA() {
    if (window.__tbGA) return;
    window.__tbGA = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ID_GA);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID_GA;
    document.head.appendChild(s);
  }
  // refus : on efface les cookies Google Analytics éventuellement déjà posés
  function effacerGA() {
    var noms = document.cookie.split(';').map(function (c) { return c.split('=')[0].trim(); })
      .filter(function (n) { return n === '_ga' || n.indexOf('_ga_') === 0 || n === '_gid' || n === '_gat'; });
    var hote = location.hostname, domaines = ['', hote, '.' + hote, '.' + hote.replace(/^www\./, '')];
    noms.forEach(function (n) {
      domaines.forEach(function (d) {
        document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  var bandeau = null;
  function style() {
    if (document.getElementById('tb-cookies-style')) return;
    var st = document.createElement('style');
    st.id = 'tb-cookies-style';
    st.textContent =
      '#tb-cookies{position:fixed;right:20px;bottom:20px;z-index:2147483600;width:min(400px,calc(100vw - 40px));' +
      'background:#0d0d0d;border:1px solid rgba(200,169,110,.45);box-shadow:0 18px 50px rgba(0,0,0,.6);padding:20px 20px 18px;' +
      "font-family:'Montserrat',system-ui,sans-serif;color:#d8d2c6;opacity:0;transform:translateY(12px);transition:opacity .5s ease,transform .5s ease}" +
      '#tb-cookies.tbc-vu{opacity:1;transform:none}' +
      "#tb-cookies h2{margin:0 0 8px;font:400 19px/1.2 'Cormorant Garamond',Georgia,serif;color:#f2ede4;letter-spacing:.02em}" +
      '#tb-cookies p{margin:0 0 16px;font-size:12px;line-height:1.7;color:#a9a397}' +
      '#tb-cookies a{color:#c8a96e}' +
      '#tb-cookies .tbc-boutons{display:flex;gap:8px}' +
      '#tb-cookies button{flex:1;padding:12px 10px;font:500 9.5px/1 \'Montserrat\',system-ui,sans-serif;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:background .3s,border-color .3s,color .3s}' +
      '#tb-cookies .tbc-non{background:transparent;border:1px solid rgba(200,169,110,.6);color:#e7cf9f}' +
      '#tb-cookies .tbc-non:hover,#tb-cookies .tbc-non:focus-visible{background:rgba(200,169,110,.12);border-color:#e7cf9f;outline:none}' +
      '#tb-cookies .tbc-oui{background:#c8a96e;border:1px solid #c8a96e;color:#0a0a0a}' +
      '#tb-cookies .tbc-oui:hover,#tb-cookies .tbc-oui:focus-visible{background:#e2c992;border-color:#e2c992;outline:none}' +
      '@media(max-width:600px){#tb-cookies{left:12px;right:12px;bottom:12px;width:auto;padding:16px 16px 14px}#tb-cookies p{font-size:11.5px;margin-bottom:12px}}';
    document.head.appendChild(st);
  }
  function montrer() {
    style();
    if (!bandeau) {
      bandeau = document.createElement('div');
      bandeau.id = 'tb-cookies';
      bandeau.setAttribute('role', 'dialog');
      bandeau.setAttribute('aria-label', 'Cookies');
      bandeau.innerHTML =
        '<h2>Cookies</h2>' +
        '<p>J\'utilise Google Analytics pour savoir quelles pages sont consultées, de façon statistique. ' +
        'Ces cookies ne sont déposés qu\'avec votre accord. <a href="/mentions-legales.html#cookies">En savoir plus</a></p>' +
        '<div class="tbc-boutons"><button type="button" class="tbc-non">Refuser</button><button type="button" class="tbc-oui">Accepter</button></div>';
      bandeau.querySelector('.tbc-oui').addEventListener('click', function () { ecrire('oui'); chargerGA(); cacher(); });
      bandeau.querySelector('.tbc-non').addEventListener('click', function () { ecrire('non'); effacerGA(); cacher(); });
      document.body.appendChild(bandeau);
    }
    bandeau.style.display = '';
    requestAnimationFrame(function () { requestAnimationFrame(function () { bandeau.classList.add('tbc-vu'); }); });
  }
  function cacher() {
    if (!bandeau) return;
    bandeau.classList.remove('tbc-vu');
    setTimeout(function () { if (bandeau && !bandeau.classList.contains('tbc-vu')) bandeau.style.display = 'none'; }, 500);
  }

  window.tbGererCookies = montrer;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-tb-cookies]');
    if (!a) return;
    e.preventDefault(); montrer();
  });

  var choix = lire();
  if (choix === 'oui') chargerGA();
  else if (choix === null) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montrer); else montrer();
  }
})();
