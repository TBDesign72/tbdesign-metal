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
      "#tb-cookies{position:fixed;left:0;right:0;bottom:0;z-index:2147483600;background:rgba(13,13,13,.97);border-top:1px solid rgba(200,169,110,.4);" +
      "box-shadow:0 -14px 40px rgba(0,0,0,.5);font-family:'Montserrat',system-ui,sans-serif;color:#d8d2c6;transform:translateY(100%);transition:transform .5s cubic-bezier(.16,1,.3,1)}" +
      '#tb-cookies.tbc-vu{transform:none}' +
      '#tb-cookies .tbc-in{max-width:1300px;margin:0 auto;padding:18px 32px;display:flex;align-items:center;gap:28px}' +
      '#tb-cookies .tbc-txt{flex:1;min-width:0}' +
      '#tb-cookies p{margin:0;font-size:12.5px;line-height:1.6;color:#bdb7ad}' +
      '#tb-cookies p strong{color:#f2ede4;font-weight:500}' +
      '#tb-cookies .tbc-liens{margin-top:8px;display:flex;gap:18px;flex-wrap:wrap}' +
      '#tb-cookies .tbc-liens a{font-size:10.5px;letter-spacing:.5px;color:#c8a96e;text-decoration:underline;text-underline-offset:3px}' +
      '#tb-cookies .tbc-boutons{display:flex;gap:8px;flex-shrink:0}' +
      "#tb-cookies button{min-width:150px;padding:13px 18px;font:500 9.5px/1 'Montserrat',system-ui,sans-serif;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:background .3s,border-color .3s,color .3s}" +
      '#tb-cookies .tbc-oui{background:#c8a96e;border:1px solid #c8a96e;color:#0a0a0a}' +
      '#tb-cookies .tbc-oui:hover,#tb-cookies .tbc-oui:focus-visible{background:#e2c992;border-color:#e2c992;outline:none}' +
      '#tb-cookies .tbc-non{background:transparent;border:1px solid transparent;color:#e7cf9f}' +
      '#tb-cookies .tbc-non:hover,#tb-cookies .tbc-non:focus-visible{border-color:rgba(200,169,110,.45);outline:none}' +
      '#tb-cookies .tbc-pref,#tb-cookies .tbc-ok{background:transparent;border:1px solid rgba(200,169,110,.6);color:#e7cf9f}' +
      '#tb-cookies .tbc-pref:hover,#tb-cookies .tbc-pref:focus-visible,#tb-cookies .tbc-ok:hover,#tb-cookies .tbc-ok:focus-visible{background:rgba(200,169,110,.12);border-color:#e7cf9f;outline:none}' +
      '#tb-cookies .tbc-choix{display:none;max-width:1300px;margin:0 auto;padding:0 32px 18px}' +
      '#tb-cookies.tbc-prefs .tbc-choix{display:block}' +
      '#tb-cookies.tbc-prefs .tbc-pref{display:none}' +
      '#tb-cookies .tbc-ligne{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:12px 0;border-top:1px solid rgba(200,169,110,.15)}' +
      "#tb-cookies .tbc-ligne b{display:block;font:400 17px/1.2 'Cormorant Garamond',Georgia,serif;color:#f2ede4;margin-bottom:3px}" +
      '#tb-cookies .tbc-ligne span{font-size:11.5px;color:#9a948a;line-height:1.5}' +
      '#tb-cookies .tbc-toujours{font-size:9.5px;letter-spacing:2px;text-transform:uppercase;color:#8a8478;white-space:nowrap}' +
      '#tb-cookies .tbc-inter{position:relative;width:46px;height:24px;flex-shrink:0}' +
      '#tb-cookies .tbc-inter input{position:absolute;inset:0;opacity:0;margin:0;z-index:1}' +
      '#tb-cookies .tbc-inter i{position:absolute;inset:0;border:1px solid rgba(200,169,110,.6);border-radius:12px;transition:background .3s}' +
      "#tb-cookies .tbc-inter i::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#8a8478;transition:transform .3s,background .3s}" +
      '#tb-cookies .tbc-inter input:checked+i{background:rgba(200,169,110,.25)}' +
      '#tb-cookies .tbc-inter input:checked+i::after{transform:translateX(22px);background:#c8a96e}' +
      '#tb-cookies .tbc-inter input:focus-visible+i{outline:2px solid #e7cf9f;outline-offset:2px}' +
      '#tb-cookies .tbc-ok{margin-top:12px}' +
      '@media(max-width:900px){#tb-cookies .tbc-in{flex-direction:column;align-items:stretch;gap:14px;padding:16px}' +
      '#tb-cookies .tbc-boutons{flex-wrap:wrap}#tb-cookies button{flex:1;min-width:0;padding:12px 8px;letter-spacing:1.5px}' +
      '#tb-cookies .tbc-choix{padding:0 16px 16px}#tb-cookies p{font-size:12px}#tb-cookies .tbc-toujours{font-size:8.5px;letter-spacing:1px;white-space:normal;text-align:right;max-width:70px}}';
    document.head.appendChild(st);
  }
  function montrer(avecPrefs) {
    style();
    if (!bandeau) {
      bandeau = document.createElement('div');
      bandeau.id = 'tb-cookies';
      bandeau.setAttribute('role', 'dialog');
      bandeau.setAttribute('aria-label', 'Gestion des cookies');
      bandeau.innerHTML =
        '<div class="tbc-in"><div class="tbc-txt">' +
          '<p>Nous utilisons des cookies pour <strong>optimiser</strong> notre site web et notre service.</p>' +
          '<div class="tbc-liens"><a href="/mentions-legales.html#cookies">Politique de cookies</a><a href="/mentions-legales.html#donnees">Politique de confidentialité</a></div>' +
        '</div><div class="tbc-boutons">' +
          '<button type="button" class="tbc-oui">Accepter</button>' +
          '<button type="button" class="tbc-non">Refuser</button>' +
          '<button type="button" class="tbc-pref" aria-expanded="false">Préférences</button>' +
        '</div></div>' +
        '<div class="tbc-choix">' +
          '<div class="tbc-ligne"><div><b>Fonctionnels</b><span>Nécessaires au bon fonctionnement du site (mémorisation de votre choix). Aucune donnée n’est transmise.</span></div><span class="tbc-toujours">Toujours actifs</span></div>' +
          '<div class="tbc-ligne"><div><b>Statistiques</b><span>Google Analytics : mesure anonyme des pages consultées, pour améliorer le site.</span></div>' +
            '<label class="tbc-inter"><input type="checkbox" class="tbc-stats" aria-label="Autoriser les cookies statistiques"><i></i></label></div>' +
          '<button type="button" class="tbc-ok">Enregistrer mes préférences</button>' +
        '</div>';
      bandeau.querySelector('.tbc-oui').addEventListener('click', function () { ecrire('oui'); chargerGA(); cacher(); });
      bandeau.querySelector('.tbc-non').addEventListener('click', function () { ecrire('non'); effacerGA(); cacher(); });
      bandeau.querySelector('.tbc-pref').addEventListener('click', function () { ouvrirPrefs(); });
      bandeau.querySelector('.tbc-ok').addEventListener('click', function () {
        if (bandeau.querySelector('.tbc-stats').checked) { ecrire('oui'); chargerGA(); }
        else { ecrire('non'); effacerGA(); }
        cacher();
      });
      document.body.appendChild(bandeau);
    }
    bandeau.classList.remove('tbc-prefs');
    bandeau.style.display = '';
    if (avecPrefs) ouvrirPrefs();
    requestAnimationFrame(function () { requestAnimationFrame(function () { bandeau.classList.add('tbc-vu'); }); });
  }
  function ouvrirPrefs() {
    bandeau.querySelector('.tbc-stats').checked = lire() === 'oui';
    bandeau.classList.add('tbc-prefs');
    bandeau.querySelector('.tbc-pref').setAttribute('aria-expanded', 'true');
  }
  function cacher() {
    if (!bandeau) return;
    bandeau.classList.remove('tbc-vu');
    setTimeout(function () { if (bandeau && !bandeau.classList.contains('tbc-vu')) bandeau.style.display = 'none'; }, 550);
  }

  window.tbGererCookies = function () { montrer(true); };
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-tb-cookies]');
    if (!a) return;
    e.preventDefault(); montrer(true);
  });

  var choix = lire();
  if (choix === 'oui') chargerGA();
  else if (choix === null) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { montrer(false); }); else montrer(false);
  }
})();
