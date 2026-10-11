/* ==========================================================================
   TB Design Métal — écran d'entrée immersif
   Couche indépendante posée au-dessus de la page d'accueil (index.html).
   - logo, devise et bouton « ENTRER SUR LE SITE » affichés immédiatement ;
   - engrenage de chargement autour du logo : les neuf créations se construisent
     ensemble de 0 à 100 %, puis deviennent interactives ;
   - créations en rotation lente (Three.js) ;
   - sélection individuelle, portail et verrière articulés ;
   - sortie : ralentissement, dispersion, fondu, puis retrait complet de la couche.
   ========================================================================== */

const URL_THREE = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
const BASE = new URL('./', import.meta.url);
const CLE_VU = 'tbIntroVue';
const LOGO_EMBLEME = new URL('entree-logo-embleme.webp', BASE).href;
const LOGO_TEXTE = new URL('entree-logo-texte.webp', BASE).href;
const chargerDef = f => fetch(new URL('entree-' + f, BASE)).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });
// contours vectoriels du logo (tracés au démarrage, puis remplis par l'image)
const TRACE_LOGO = {"embleme":{"w":480,"h":477,"traits":[["M4.6,2.4 H474.6 V474.4 H4.6 Z",4.8],["M87.7,369.6 H93.3",7.2],["M107.3,369.6 H234.7",7.2],["M137.8,369.6 V218.2",7.2],["M101,255 L235,121",7.2],["M213.4,369.6 V270 H234.3",7.2],["M160.7,218.3 L206.7,172.3",7.2],["M69,242.3 L78,233 L88.7,211.7 L208.3,91.5 L209.7,87.3 L217,80 L219.3,79.3 L222.7,80 L231,88.3 L231.7,91.3 L231,94 L223.7,101.3 L219.5,102.8 L99.3,222.3 L78,233",7.2],["M88.7,211.7 L99.3,222.3",7.2],["M208.3,91.5 L219.5,102.8",7.2],["M248.8,397.6 V77.6 L411,238.4 L248.8,397.6",7.2],["M288.4,173.4 L355,238 L288.4,303.2 Z",7.2],["M278.7,129.7 L335.3,186.3",7.2],["M347.7,198.7 L353,204.3",7.2],["M384,261 L377,254",7.2],["M359.7,285.7 L347.7,273.3",7.2],["M335.3,310 L328.3,302.7",7.2],["M311,334 L299,322",7.2],["M286.7,358.7 L279.7,351.3",7.2]]},"texte":{"w":560,"h":151,"traits":[["M4,17 L4.7,8.3 L6,4.7 L11,3.3 L32.7,3.3 L35.7,4.3 L38,6.3",2.6],["M26.3,78.7 L34,78 L37.7,75.3",2.6],["M38,75 L38,6.7",2.6],["M70.3,4.7 L65.3,3.3 L44,3.3 L40,4.7 L38.3,6.3",2.6],["M38.3,75.3 L39.7,76.7 L43.7,78.3 L50.7,78.3",2.6],["M70.7,4.7 L73.7,2.7 L79.7,2.7 L82.3,3.3 L85.7,5.7",2.6],["M70.7,5 L72.3,17.3",2.6],["M74,77.7 L80.7,77.3 L83.3,76.3 L85.7,74.3",2.6],["M118.7,35 L120,36.7 L124.3,37.7 L129.3,40 L133.3,43.3 L136,47 L137.7,52 L138,58 L137.3,62.3 L134.3,68 L131.3,71 L125,74.7 L114,77.3 L91.7,77.3 L88,76 L86,74.3",2.6],["M86,74 L86,6",2.6],["M118.7,35 L119.7,33 L123.3,30.7 L127.3,26.3 L129,21.7 L129.3,17.7 L128.7,14 L126.7,10.3 L123.3,7 L118,4.3 L110.3,3 L91.3,3 L88.3,4 L86.3,5.7",2.6],["M95.7,36 L118.7,35",2.6],["M175.3,5.7 L171,3 L163.7,2.3",2.6],["M163.7,77.7 L170.3,77.3 L173,76.3 L175.3,74.3",2.6],["M175.7,74 L175.7,6",2.6],["M176,5.7 L181.3,3 L198.7,3 L208.7,4.3 L219.7,9 L228.3,16.3 L232.3,22 L235.3,28.3 L237.3,40.7 L235.7,50.7 L231.7,59.7 L227.3,65.3 L218,72.3 L211,75.3 L198.7,77.3 L181.3,77.3 L177.7,76 L175.7,74.3",2.6],["M253.7,5.7 L249.3,3 L242,2.3",2.6],["M242,77.7 L248.7,77.3 L251.3,76.3 L253.7,74.3",2.6],["M254,41.7 L254,6",2.6],["M254,74 L254,42.3",2.6],["M362,14 L355.7,6.3 L352.3,4.7 L345.3,2.7 L332.7,2 L324.3,4 L316.7,8.7 L313.3,14 L312,20.7 L312,23.3 L314,28.3 L317.7,32 L322,34.7 L327.3,36.7 L353.3,43 L359,46 L363,49.7 L366,55.7 L366.3,59.3 L365.3,65.3 L362.7,70 L356,75.7 L345.7,79.3 L336.7,79.7 L329.3,79 L318,75.3 L306.7,67.3 L304,68.3 L302.3,75.3 L301.3,76.3 L298,77 L260,77.3 L257.3,76.7 L254,74.3",2.6],["M254.3,42 L291,42",2.6],["M254.3,5.7 L256.3,4 L259.3,3 L295,3.3 L299,4.7 L301.7,14",2.6],["M291.3,41.7 L292.7,38 L293,33.3",2.6],["M293,50 L291.3,42.3",2.6],["M371.3,78 L379,77 L383,74.3",2.6],["M383,5.7 L378.7,3 L371.3,2.3",2.6],["M395.3,77.7 L387.3,77 L383.3,74.3",2.6],["M383.3,74 L383.3,6",2.6],["M383.7,5.7 L388,3 L395.3,2.3",2.6],["M464.3,14.7 L457.7,6.3 L453.7,4 L448,2.3 L442,1.3 L435.7,1.3 L427.7,2.7 L419.7,5.7 L413.7,9.7 L409.7,13.7 L405.7,19.3 L401.7,29.3 L400.3,37 L400.3,43.3 L402.7,54.7 L405,60 L409,66 L417.7,73.7 L423,76.3 L429.7,78.3 L447,78.3 L457.3,75.3 L463.3,72 L464.7,70.3 L464.7,51.3",2.6],["M451.7,48 L459.3,48.3 L464.7,51",2.6],["M465,51 L470,48.3 L475.3,47.7",2.6],["M477.3,78.7 L483.7,78.3 L487.3,77",2.6],["M490.7,7.7 L490,6 L487.7,4 L484,3 L479,3",2.6],["M487.7,76.7 L487.7,11.3 L490.7,8",2.6],["M498.7,78.3 L491.3,78.3 L488,77",2.6],["M542,72.3 L539.3,71.3 L537.3,69.3 L495,10.3 L493.3,8.7 L491,8",2.6],["M535.3,3 L541,3 L545.7,4.3",2.6],["M542.3,72.3 L545.7,69 L545.7,4.3",2.6],["M556.7,2.7 L548,3.3 L545.7,4.3",2.6],["M209.7,141.3 L209.7,137.3 L210.7,136.7 L217.3,137.7 L219.3,139.7 L220.3,142 L220.3,145.7 L219.3,147.7 L216,150 L210,150",1.6],["M225,121 L225,127.3 L225.7,128 L229,128 L230.7,127.3 L232.3,125 L231.7,122.3 L230,120.7",1.6],["M225,120.3 L225,115.3 L225.7,114.7 L229.7,115 L230.7,116 L231,118 L230,120.3",1.6],["M225.3,120.7 L229.7,120.7",1.6],["M244.7,115.3 L245,125.3 L246.7,127.3 L250,128 L253,125 L253,115",1.6],["M253.7,150.7 L252.3,150 L246,150 L245.7,143",1.6],["M245.7,142.3 L245.7,137.7 L246.3,137 L253,136.7",1.6],["M252.3,142.7 L246,142.7",1.6],["M266.3,128 L266.7,121.7",1.6],["M266.7,137 L266.3,150",1.6],["M270,121.3 L273.3,120.3 L274.3,118.3 L274,116.7 L272.3,115 L267.3,114.7 L266.7,115.3 L266.7,121",1.6],["M270.3,136.7 L266.7,137",1.6],["M274.3,128.3 L270.3,123.7 L269.7,121.7",1.6],["M289.7,136.3 L289.3,147 L287,150 L283.7,150 L281.3,147.3 L281,137",1.6],["M286,121 L286,127.3 L286.7,128 L293,128",1.6],["M293,114.7 L286.7,114.7 L286,115.3 L286,120.3",1.6],["M286.3,120.7 L293,120.7",1.6],["M310.3,149.3 L309,150 L303,149.7 L303.3,137 L308.7,137 L311,138 L313,140 L313.7,145.3 L313,147.3",1.6],["M307,122.7 L305.3,124.7 L304,128.3",1.6],["M307,122.7 L308.3,118.3 L309.7,117",1.6],["M307,122.7 L312.7,122.7",1.6],["M310.3,117 L311.3,117.7 L312.7,122.3",1.6],["M316,128 L313,122.7",1.6],["M326.7,142.3 L327,137 L333.3,137",1.6],["M334,150.3 L327,150 L326.7,143",1.6],["M327.3,114.7 L327,125 L328.7,127.3 L332,128 L334.3,126.7 L335.3,124.3 L335.3,114.3",1.6],["M333,142.7 L327,142.7",1.6],["M351,138.3 L349.3,137 L347.3,137 L345.7,139.7 L346,141 L351.3,145.7 L351.3,148.7 L349.3,150 L347,150 L345,148.3",1.6]]}};
const RACINE = document.documentElement;


/* --------------------------------------------------------------------------
   Les neuf créations — modèles issus des pages déjà réalisées
   toutes en matière pleine, assemblées pièce par pièce ; rotation complète et lente
   -------------------------------------------------------------------------- */
const CREATIONS = [
  { id: 'portail',  nom: 'Portail en ferronnerie d\'art', fichier: 'portail.json',              mouv: 'tour', periode: 46 },
  { id: 'helico',   nom: 'Escalier hélicoïdal',           fichier: 'escalier.json',             mouv: 'tour', periode: 40 },
  { id: 'charpente',nom: 'Charpente métallique',          fichier: 'charpente.json',            mouv: 'tour', periode: 54 },
  { id: 'voiture',  nom: 'Voiture sculpturale',           fichier: 'voiture-lamelles.json',     mouv: 'tour', periode: 44 },
  { id: 'taureau',  nom: 'Taureau en métal facetté',      fichier: 'taureau.json',              mouv: 'tour', periode: 56 },
  { id: 'mikado',   nom: 'Table Mikado',                  fichier: 'table-mikado.json',         mouv: 'tour', periode: 40 },
  { id: 'veranda',  nom: 'Véranda métallique vitrée',     fichier: 'veranda.json',              mouv: 'tour', periode: 50 },
  { id: 'deuxq',    nom: 'Escalier deux-quarts tournant', fichier: 'escalier-cremaillere.json', mouv: 'tour', periode: 42 },
  { id: 'verriere', nom: 'Verrière',                      fichier: 'verriere.json',             mouv: 'tour', periode: 48 }
];

function demarrer(){
  const reduit = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- 1. Couche HTML (immédiate, sans attendre la 3D) ---------------- */
  const ov = document.createElement('div');
  ov.id = 'tb-entree';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-label', 'Bienvenue chez TB Design Métal');
  ov.innerHTML = `
    <canvas class="tbe-canvas" aria-hidden="true"></canvas>
    <div class="tbe-halo" aria-hidden="true"></div>
    <div class="tbe-noms"></div>
    <div class="tbe-centre">
      <div class="tbe-logo-zone">
        <svg class="tbe-engrenage" viewBox="-115 -115 230 230" aria-hidden="true"></svg>
        <div class="tbe-logo-boite">
          <img class="tbe-logo" src="${LOGO_EMBLEME}" alt="" decoding="async">
          <svg class="tbe-trace" viewBox="0 0 ${TRACE_LOGO.embleme.w} ${TRACE_LOGO.embleme.h}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${TRACE_LOGO.embleme.traits.map(([d, e]) => `<path d="${d}" stroke-width="${e}"/>`).join('')}</svg>
        </div>
      </div>
      <div class="tbe-marque-boite">
        <img class="tbe-marque" src="${LOGO_TEXTE}" alt="TB Design — bureau d'études" decoding="async">
        <svg class="tbe-trace" viewBox="0 0 ${TRACE_LOGO.texte.w} ${TRACE_LOGO.texte.h}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${TRACE_LOGO.texte.traits.map(([d, e]) => `<path d="${d}" stroke-width="${e}"/>`).join('')}</svg>
      </div>
      <p class="tbe-devise">L’ART DU MÉTAL SUR MESURE</p>
      <button type="button" class="tbe-entrer">Entrer sur le site</button>
    </div>
    <div class="tbe-panneau" role="region" aria-live="polite">
      <h2></h2>
      <p class="tbe-astuce">Glisser pour tourner</p>
      <div class="tbe-actions">
        <button type="button" class="tbe-btn" data-a="portes" hidden></button>
        <button type="button" class="tbe-btn" data-a="rejouer">Reconstruire</button>
        <button type="button" class="tbe-btn" data-a="reinit">Réinitialiser</button>
        <button type="button" class="tbe-btn" data-a="fermer">Fermer</button>
      </div>
    </div>
    <button type="button" class="tbe-fermer-x" aria-label="Fermer la vue en grand">×</button>
    <button type="button" class="tbe-pause" aria-pressed="false">Pause</button>
    <p class="tbe-sr" aria-live="polite"></p>`;
  document.body.appendChild(ov);
  RACINE.classList.add('tb-intro-pret');
  if (/[?&]intro=1/.test(location.search)){
    try { history.replaceState(null, '', location.pathname + location.search.replace(/([?&])intro=1(&|$)/, (m, a, b) => b ? a : '').replace(/\?$/, '') + location.hash); } catch (e) {}
  }
  const ancienDebordement = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  const $ = s => ov.querySelector(s);
  const canvas = $('.tbe-canvas'), boutonEntrer = $('.tbe-entrer'), panneau = $('.tbe-panneau');
  const titrePanneau = panneau.querySelector('h2'), btnPortes = panneau.querySelector('[data-a="portes"]');
  const btnFermerX = $('.tbe-fermer-x'), btnPause = $('.tbe-pause'), annonce = $('.tbe-sr');
  $('.tbe-marque').addEventListener('error', e => {   // repli si l'image du logo est absente
    const t = document.createElement('div'); t.className = 'tbe-logo-texte'; t.textContent = 'TB DESIGN';
    e.target.replaceWith(t);
  });

  /* ---------------- Le logo se trace au trait dès l'ouverture (≈ 3 s), sans attendre la 3D ----------------
     L'emblème puis le logotype se tracent, le logotype passe en plein, puis la devise apparaît.
     Le bouton « Entrer sur le site » arrive en fondu à la fin du tracé, sans attendre le chargement de la 3D. */
  const logo = (function(){
    const groupes = [[...ov.querySelectorAll('.tbe-logo-boite .tbe-trace path')], [...ov.querySelectorAll('.tbe-marque-boite .tbe-trace path')]];
    const plages = [[0, 0.27], [0.25, 0.41]], PLEIN = 0.43, DEVISE = 0.46;
    const traits = [];
    groupes.forEach((liste, g) => {
      const lg = liste.map(el => { let L = 1; try { L = el.getTotalLength() || 1; } catch (e) {} return L; });
      const tot = lg.reduce((a, b) => a + b, 0), [d0, d1] = plages[g];
      let cumul = 0;
      liste.forEach((el, i) => {
        const L = lg[i];
        el.style.strokeDasharray = L + ' ' + (L + 2); el.style.strokeDashoffset = L + 1;
        traits.push({ el, L, u: -1, d: d0 + (d1 - d0) * cumul / tot, f: d0 + (d1 - d0) * (cumul + L) / tot });
        cumul += L;
      });
    });
    let dernierP = -1, auto = 0;
    function poser(p){
      if (p <= dernierP) return;
      dernierP = p;
      traits.forEach(tr => {
        const u = Math.max(0, Math.min(1, (p - tr.d) / (tr.f - tr.d)));
        if (u === tr.u) return;
        tr.u = u; tr.el.style.strokeDashoffset = (u >= 1 ? 0 : (tr.L + 1) * (1 - u)).toFixed(1);
      });
      if (p >= PLEIN) ov.classList.add('tbe-logo-plein');
      if (p >= DEVISE) ov.classList.add('tbe-devise-pret');
    }
    return {
      poser,
      seul(){
        if (auto) return;
        if (reduit){ setTimeout(() => { poser(1); engrenage.progression(1, true); montrerEntrer(); }, 0); return; }
        let p = Math.max(0, dernierP), avant = null, debut = 0;
        // compteur de l'engrenage : suit le tracé du logo, sans dépasser le chargement réel des créations
        const pas = now => {
          if (avant !== null) p += Math.min(0.1, Math.max(0, now - avant) / 1000) / 6.5;
          else debut = now;
          avant = now;
          p = Math.max(p, (now - debut - 1000) / 6500);    // navigateur occupé : jamais plus de 1,5 s de retard
          poser(Math.min(1, p));
          const compte = Math.min(p / DEVISE, 0.3 + 0.7 * fracFichiers);
          engrenage.progression(Math.min(1, compte), compte >= 1);
          if (compte >= 1){ setTimeout(montrerEntrer, 400); return; }   // logo tracé et créations chargées : le bouton arrive
          if (ov.isConnected) auto = requestAnimationFrame(pas);
        };
        auto = requestAnimationFrame(pas);
      }
    };
  })();
  function montrerEntrer(){ ov.classList.add('tbe-entrer-pret'); }
  let fracFichiers = 0;                                    // part des créations chargées (0 → 1)
  logo.seul();
  setTimeout(() => { logo.poser(1); engrenage.progression(1, true); montrerEntrer(); }, 9000);   // filet de sécurité (connexion très lente)

  /* ---------------- Engrenage de chargement (indépendant de la 3D) ---------------- */
  const engrenage = creerEngrenage($('.tbe-engrenage'), reduit);

  // noms (boutons) sous chaque création
  const noms = CREATIONS.map((c, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tbe-nom'; b.textContent = c.nom; b.dataset.i = i;
    $('.tbe-noms').appendChild(b);
    return b;
  });

  /* ---------------- 2. État partagé ---------------- */
  let sortie = false, scene3D = null;
  const etat = { pause: false, selection: -1, observer: false };

  boutonEntrer.addEventListener('click', entrer);
  ov.addEventListener('keydown', e => {
    if (e.key === 'Escape' && etat.selection >= 0){ e.preventDefault(); scene3D && scene3D.deselectionner(); }
  });

  function entrer(){
    if (sortie) return;
    sortie = true;
    try { sessionStorage.setItem(CLE_VU, '1'); } catch (e) {}
    ov.classList.add('tbe-sortie');
    if (scene3D) scene3D.sortir();
    const dFondu = reduit ? 0 : 650, dRetrait = reduit ? 320 : 1450;
    setTimeout(() => ov.classList.add('tbe-fondu'), dFondu);
    setTimeout(() => {
      if (scene3D) scene3D.detruire();
      engrenage.arreter();
      ov.remove();
      document.body.style.overflow = ancienDebordement;
      RACINE.classList.remove('tb-intro', 'tb-intro-pret');
      const cible = document.querySelector('main, header, h1, body');
      if (cible && cible !== document.body){ cible.setAttribute('tabindex', '-1'); cible.focus({ preventScroll: true }); cible.removeAttribute('tabindex'); }
    }, dRetrait);
  }

  /* ---------------- 3. Scène 3D (chargée ensuite, ne bloque jamais le bouton) ---------------- */
  import(URL_THREE).then(THREE => {
    if (sortie) return;
    scene3D = creerScene(THREE);
  }).catch(() => {
    fracFichiers = 1;                        // sans 3D : l'écran reste utilisable (logo, compteur, bouton)
  });

  /* ======================================================================== */
  function creerScene(THREE){
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) { fracFichiers = 1; return null; }
    const mobile = Math.min(innerWidth, innerHeight) < 700;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
    camera.position.set(0, 0, 20);
    const H_VISIBLE = 2 * 20 * Math.tan(THREE.MathUtils.degToRad(15));

    const { construireDessin, construireOurs, construireTraits, construireRepli, envTex, pmrem } = atelier(THREE, renderer);   // fabrique de modèles commune (écran d'entrée + galerie)
    const l1 = new THREE.DirectionalLight(0xfff0d8, 1.9); l1.position.set(3, 4, 6);
    const l2 = new THREE.DirectionalLight(0xffdca0, 1.2); l2.position.set(-5, 2, -3);
    scene.add(l1, l2, new THREE.HemisphereLight(0x4a3a24, 0x050505, 0.15));


    let horloge = 0, detruit = false, construction = 1;
    const DUREE_RECONSTRUCTION = 9;

    /* ---------- objets de la scène ---------- */
    const OBJ = CREATIONS.map((c, i) => {
      const racine = new THREE.Group(), inclin = new THREE.Group(), lacet = new THREE.Group();
      racine.add(inclin); inclin.add(lacet); racine.visible = false; scene.add(racine);
      return { c, i, racine, inclin, lacet, pret: false, apparition: 0, az: 0, el: 0.2, R: 1, mats: [], metal: [], pivots: {},
               t: i * 3.7, phase: i * 0.83, sel: 0, att: 1, yawMain: 0, pitchMain: 0,
               porte: 0, porteCible: 0, autoSuspendu: 0, slot: new THREE.Vector3(), rayonEcran: 60, echelle: 1 };
    });

    let nbCharges = 0;
    function majCharge(){}
    function charger(o){
      return chargerDef(o.c.fichier)
        .then(def => {
          const m = def.pieces ? (def.pieces[0] && def.pieces[0].f ? construireDessin(def) : construireOurs(def)) : construireTraits(def);   // dessin puis volumes ; tôles pliées (taureau) ; traits seuls
          o.az = def.az || 0; o.el = THREE.MathUtils.clamp(def.el === undefined ? 0.2 : def.el, 0.08, 0.32);
          return m;
        })
        .catch(e => { console.error("modèle", o.c.fichier, e); return construireRepli(); })
        .then(m => {
          if (detruit) return;
          o.lacet.add(m.modele); o.R = m.R; o.bas = m.bas === undefined ? -0.8 : m.bas; o.mats = m.mats; o.prog = m.prog; o.poserOurs = m.poser; o.cadrageOurs = m.cadrage; o.pointe = m.pointe || null; o.metal = m.metal; o.pivots = m.pivots; o.p = -1;
          o.pret = true; o.racine.visible = true; nbCharges++; majCharge();
  
          disposer();
        });
    }
    // chargement progressif, trois fichiers à la fois
    (async () => {
      const file = OBJ.slice();
      const ouvrier = async () => { while (file.length && !detruit) await charger(file.shift()); };
      await Promise.all([ouvrier(), ouvrier(), ouvrier()]);
    })();

    /* ---------- disposition autour du logo ---------- */
    let W = 1, H = 1, centreGrandY = 0, ORB = null, orbite = reduit ? null : -1, phi = 0;   // rotation dès le départ (sens horaire)
    function emplacements(){
      const portrait = W / H < 0.85;
      if (portrait){
        const r = Math.min(W * 0.13, H * 0.07);
        const P = [[0.5, 0.11], [0.18, 0.15], [0.82, 0.15], [0.17, 0.33], [0.83, 0.33], [0.17, 0.71], [0.83, 0.71], [0.31, 0.87], [0.69, 0.87]];
        return { cy: 0.45, logo: Math.max(80, Math.min(112, W * 0.25)), pts: P.map(p => [p[0] * W, p[1] * H, r]) };
      }
      const r = Math.min(W * 0.072, H * 0.115);
      const rx = W * (W / H > 1.6 ? 0.37 : 0.35), ry = H * 0.355, cy = H * 0.5;
      const pts = [];
      [-90, -48, -8, 30, 58, 122, 150, 188, 228].forEach(d => { const a = d * Math.PI / 180; pts.push([W / 2 + rx * Math.cos(a), cy + ry * Math.sin(a), r]); });
      return { cy: 0.49, logo: Math.max(92, Math.min(150, H * 0.17)), pts };
    }
    function disposer(){
      W = innerWidth; H = innerHeight;
      renderer.setSize(W, H, false);
      camera.aspect = W / H; camera.updateProjectionMatrix();
      const e = emplacements();
      ov.style.setProperty('--tbe-cy', (e.cy * 100) + '%');
      ov.style.setProperty('--tbe-logo', e.logo + 'px');
      const k = H_VISIBLE / H;
      centreGrandY = 0.045 * H_VISIBLE;
      // orbite finale autour du logo (ellipse), parcourue dans le sens horaire
      const portrait = W / H < 0.85;
      const orx = portrait ? W * 0.41 : W * (W / H > 1.6 ? 0.37 : 0.35), ory = portrait ? H * 0.41 : H * 0.355, ocy = portrait ? H * 0.46 : H * 0.5;
      ORB = { rx: orx * k, ry: ory * k, cy: -(ocy - H / 2) * k, portrait, k,
              hx: W * 0.385, hy: H * 0.39, cxp: W * 0.5, cyp: H * 0.48, rc: W * 0.17 };
      OBJ.forEach((o, i) => {
        const [x, y, r] = e.pts[i];
        o.slot.set((x - W / 2) * k, -(y - H / 2) * k, 0);
        if (orbite === null) o.slotCur = o.slot.clone();
        o.rayonEcran = r;
        o.echelle = (r * k) / (o.R || 1);
        o.echelleGrand = (Math.min(W * 0.47, H * 0.35) * k) / (o.R || 1);
      });
    }
    // point d'une piste en rectangle arrondi (sens horaire à l'écran, départ en haut au centre), s ∈ [0, 1[
    function piste(s){
      const { hx, hy, cxp, cyp, rc } = ORB, lx = 2 * (hx - rc), ly = 2 * (hy - rc), arcL = Math.PI * rc / 2;
      const seg = [lx / 2, arcL, ly, arcL, lx, arcL, ly, arcL, lx / 2], tot = seg.reduce((a, b) => a + b, 0);
      let d = ((s % 1) + 1) % 1 * tot, i = 0;
      while (i < seg.length - 1 && d > seg[i]){ d -= seg[i]; i++; }
      const coin = (cx, cy, a0) => { const a = a0 + d / rc; return [cx + rc * Math.cos(a), cy + rc * Math.sin(a)]; };
      switch (i){
        case 0: return [cxp + d, cyp - hy];
        case 1: return coin(cxp + hx - rc, cyp - hy + rc, -Math.PI / 2);
        case 2: return [cxp + hx, cyp - hy + rc + d];
        case 3: return coin(cxp + hx - rc, cyp + hy - rc, 0);
        case 4: return [cxp + hx - rc - d, cyp + hy];
        case 5: return coin(cxp - hx + rc, cyp + hy - rc, Math.PI / 2);
        case 6: return [cxp - hx, cyp + hy - rc - d];
        case 7: return coin(cxp - hx + rc, cyp - hy + rc, Math.PI);
        default: return [cxp - hx + rc + d, cyp - hy];
      }
    }
    addEventListener('resize', disposer);
    disposer();

    /* ---------- sélection ---------- */
    const proj = new THREE.Vector3();
    function pointerSur(x, y){
      let best = -1, bd = 1e9;
      OBJ.forEach((o, i) => {
        if (!o.construit) return;
        proj.copy(o.racine.position).project(camera);
        const sx = (proj.x + 1) / 2 * W, sy = (1 - proj.y) / 2 * H;
        const r = o.rayonEcran * (1 + 0.3 * o.sel) * 1.05;
        const d = Math.hypot(x - sx, y - sy) / r;
        if (d < 1 && d < bd){ bd = d; best = i; }
      });
      return best;
    }
    function selectionner(i){
      if (sortie) return;
      if (etat.selection === i){ return; }
      etat.selection = i;
      OBJ.forEach(x => { x.yawMain = 0; x.pitchMain = 0; });
      noms.forEach((n, k) => n.classList.toggle('tbe-actif', k === i));
      ov.classList.add('tbe-selection', 'tbe-plein');
      const o = OBJ[i];
      titrePanneau.textContent = o.c.nom;
      if (o.c.id === 'portail'){ btnPortes.hidden = false; btnPortes.textContent = 'Ouvrir / fermer le portail'; }
      else if (o.c.id === 'verriere'){ btnPortes.hidden = false; btnPortes.textContent = 'Ouvrir / fermer les ouvrants'; }
      else btnPortes.hidden = true;
      panneau.classList.add('tbe-ouvert');
      o.rejeu = 0; o.porteCible = 0; o.porte = 0; o.autoSuspendu = horloge + DUREE_RECONSTRUCTION + 6;
    }
    function deselectionner(){
      etat.selection = -1;
      noms.forEach(n => n.classList.remove('tbe-actif'));
      ov.classList.remove('tbe-selection', 'tbe-plein');
      panneau.classList.remove('tbe-ouvert');
    }
    btnFermerX.addEventListener('click', () => deselectionner());
    noms.forEach((n, i) => n.addEventListener('click', () => { if (!OBJ[i].construit) return; etat.selection === i ? deselectionner() : selectionner(i); }));
    panneau.addEventListener('click', e => {
      const b = e.target.closest('[data-a]'); if (!b || etat.selection < 0) return;
      const o = OBJ[etat.selection];
      if (b.dataset.a === 'fermer') deselectionner();
      else if (b.dataset.a === 'rejouer'){ o.rejeu = 0; o.porteCible = 0; o.porte = 0; o.autoSuspendu = horloge + DUREE_RECONSTRUCTION + 6; }
      else if (b.dataset.a === 'reinit'){ o.yawMain = 0; o.pitchMain = 0; o.porteCible = 0; o.autoSuspendu = horloge + 20; }
      else if (b.dataset.a === 'portes'){
        const max = o.c.id === 'portail' ? 1 : 1;
        o.porteCible = o.porteCible > 0.05 ? 0 : max;
        o.autoSuspendu = horloge + 30;
      }
    });

    let appui = null;
    canvas.addEventListener('pointerdown', e => { appui = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, glisse: false }; });
    canvas.addEventListener('pointermove', e => {
      if (!appui) return;
      const dx = e.clientX - appui.x, dy = e.clientY - appui.y;
      if (Math.hypot(e.clientX - appui.x0, e.clientY - appui.y0) > 6) appui.glisse = true;
      if (appui.glisse && etat.selection >= 0){             // vue en grand : glisser pour tourner la création
        const o = OBJ[etat.selection];
        o.yawMain += dx * 0.01; o.pitchMain = THREE.MathUtils.clamp(o.pitchMain + dy * 0.006, -0.35, 0.6);
      }
      appui.x = e.clientX; appui.y = e.clientY;
    });
    canvas.addEventListener('pointerup', e => {
      if (appui && !appui.glisse){
        const i = pointerSur(e.clientX, e.clientY);
        if (etat.selection < 0 && i >= 0) selectionner(i);
      }
      appui = null;
    });
    canvas.addEventListener('pointercancel', () => { appui = null; });

    btnPause.addEventListener('click', () => {
      etat.pause = !etat.pause;
      btnPause.textContent = etat.pause ? 'Reprendre' : 'Pause';
      btnPause.setAttribute('aria-pressed', String(etat.pause));
    });

    /* ---------- animation ---------- */
    let vitesse = reduit ? 0 : 1, enSortie = false, tSortie = 0, dernier = performance.now(), rafId = 0;
    const lisse = (x, y, k, dt) => x + (y - x) * (1 - Math.exp(-k * dt));
    const ease = x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x);

    function boucle(now){
      rafId = 0;
      if (detruit) return;
      const dt = Math.max(0, Math.min(0.05, (now - dernier) / 1000)); dernier = now;
      const cibleV = (etat.pause || enSortie || reduit) ? 0 : 1;
      vitesse = lisse(vitesse, cibleV, enSortie ? 3.5 : 2.2, dt);
      horloge += dt;
      const sel = etat.selection;

      // les créations arrivent déjà construites ; l'engrenage indique seulement le chargement des fichiers
      const tousCharges = nbCharges === CREATIONS.length;
      const pc = 1;
      fracFichiers = nbCharges / CREATIONS.length;           // le compteur de l'engrenage en tient compte
      const eS = enSortie ? ease((now - tSortie - 120) / 950) : 0;
      if (orbite !== null && horloge > orbite) phi += dt * vitesse * (sel >= 0 ? 0 : 1) * (2 * Math.PI / 120);

      OBJ.forEach(o => {
        if (!o.pret) return;
        o.apparition = Math.min(1, o.apparition + dt / (reduit ? 0.2 : 0.5));
        // avancement de la construction de cette création : commun à toutes, ou « Reconstruire »
        let po = pc;
        if (o.rejeu !== undefined){
          o.rejeu = Math.min(1, o.rejeu + (reduit ? 1 : dt / DUREE_RECONSTRUCTION));
          po = o.rejeu; if (o.rejeu >= 1) o.rejeu = undefined;
        }
        if (o.p !== po){
          o.p = po;
          o.prog.forEach(m => { m.uniforms.uProg.value = po; });
          if (o.poserOurs) o.poserOurs(po, 1);
        }
        if (pc >= 1 && !o.construit){
          o.construit = true; noms[o.i].classList.add('tbe-vu');
          if (o.c.id === 'portail' || o.c.id === 'verriere') o.prochainAuto = horloge + (o.c.id === 'portail' ? 3 : 7);
        }
        const choisi = sel === o.i;
        const facteur = choisi ? 0.4 : (sel >= 0 ? 0.35 : 1);
        o.t += dt * vitesse * facteur;
        o.sel = lisse(o.sel, choisi ? 1 : 0, 4, dt);
        o.att = lisse(o.att, sel >= 0 && !choisi ? 0 : 1, 5, dt);

        // orientation : vue validée de chaque création, puis mouvement lent
        let yaw = -o.az + o.yawMain;
        if (o.c.mouv === 'tour') yaw += o.t * (2 * Math.PI / o.c.periode) + o.phase;
        else yaw += THREE.MathUtils.degToRad(o.c.amp) * Math.sin(o.t * 2 * Math.PI / o.c.periode + o.phase);
        o.lacet.rotation.y = yaw;
        o.inclin.rotation.x = o.el + o.pitchMain;

        // position : emplacement autour du logo, léger rapprochement si sélectionnée, dispersion à la sortie
        // sélection : la création vient au centre et s'ouvre en grand sur toute la page
        const k = ease(o.sel);
        const zoom = o.cadrageOurs ? o.cadrageOurs(o.p) : 1;
        const s = (o.echelle + (o.echelleGrand - o.echelle) * k) * zoom * (0.92 + 0.08 * o.apparition) * (1 - 0.25 * eS);
        o.racine.scale.setScalar(s);
        if (orbite !== null && horloge > orbite){
          let tx, ty;
          if (ORB.portrait){
            // téléphone : piste en rectangle arrondi le long des bords, autour du bloc central
            const [px, py] = piste((o.i / OBJ.length + phi / (2 * Math.PI)) % 1);
            tx = (px - W / 2) * ORB.k; ty = -(py - H / 2) * ORB.k;
          } else {
            const a = -Math.PI / 2 + o.i * (2 * Math.PI / OBJ.length) + phi;
            tx = ORB.rx * Math.cos(a); ty = ORB.cy - ORB.ry * Math.sin(a);
          }
          const kk = 1 - Math.exp(-1.6 * dt);
          if (!o.slotCur) o.slotCur = new THREE.Vector3(tx, ty, 0);
          o.slotCur.x += (tx - o.slotCur.x) * kk; o.slotCur.y += (ty - o.slotCur.y) * kk;
        }
        const sl = o.slotCur || o.slot;
        o.racine.position.set(
          (sl.x + (0 - sl.x) * k) * (1 + 0.45 * eS),
          (sl.y + (centreGrandY - sl.y) * k) * (1 + 0.45 * eS) + 0.4 * eS, -2 * eS);

        // portes : auto-ouverture lente puis refermeture (portail, verrière), commande manuelle prioritaire
        if (o.prochainAuto !== undefined && !reduit && !enSortie){
          if (horloge > o.autoSuspendu && vitesse > 0.5 && horloge > o.prochainAuto){
            if (o.porteCible === 0){ o.porteCible = o.c.id === 'portail' ? 0.72 : 0.38; o.prochainAuto = horloge + (o.c.id === 'portail' ? 6 : 4.5); }
            else { o.porteCible = 0; o.prochainAuto = horloge + (o.c.id === 'portail' ? 16 : 14); }
          }
        }
        o.porte = reduit ? o.porteCible : lisse(o.porte, o.porteCible, 1.1, dt);
        Object.values(o.pivots).forEach(p => { p.g.rotation.y = p.sens * THREE.MathUtils.degToRad(p.max) * o.porte; });

        // lumière : surbrillance champagne, reflet qui parcourt la pièce, fondu d'apparition / de sortie
        const op = o.apparition * o.att * (1 - eS);
        const cycle = ((horloge * (reduit ? 0 : 1) + o.phase * 4.3) % 12) / 12;
        o.mats.forEach(m => { m.uniforms.uOp.value = op * (m.userData.dim === undefined ? 1 : m.userData.dim); m.uniforms.uHi.value = o.sel; m.uniforms.uSweep.value = -1.6 + cycle * 6; });
        o.metal.forEach(m => {
          m.envMapIntensity = m.userData.env0 * (0.9 + 0.6 * o.sel) * o.att;
          const op0 = m.userData.op0 === undefined ? 1 : m.userData.op0;
          m.opacity = op0 * (m.userData.fill === undefined ? 1 : m.userData.fill) * (enSortie ? 1 - eS : o.apparition * o.att);
          m.transparent = m.opacity < 0.999;
        });
        o.racine.visible = o.att > 0.06 && (op > 0.003 || (o.metal.length > 0 && (1 - eS) > 0.003));
      });

      // noms sous les objets
      OBJ.forEach(o => {
        if (!o.pret) return;
        const s = o.racine.scale.x, bas = o.bas * o.R * s * Math.cos(o.inclin.rotation.x) - 0.15 * o.R * s * Math.abs(Math.sin(o.inclin.rotation.x));
        proj.set(o.racine.position.x, o.racine.position.y + bas, o.racine.position.z).project(camera);
        const x = (proj.x + 1) / 2 * W, y = (1 - proj.y) / 2 * H + 8;
        noms[o.i].style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translateX(-50%)`;
      });

      renderer.render(scene, camera);
      if (!document.hidden) rafId = requestAnimationFrame(boucle);
    }
    rafId = requestAnimationFrame(boucle);
    // onglet masqué : plus aucun calcul ; retour : reprise sans saut
    document.addEventListener('visibilitychange', surVisibilite);
    function surVisibilite(){ if (!document.hidden && !rafId && !detruit){ dernier = performance.now(); rafId = requestAnimationFrame(boucle); } }

    function sortir(){ enSortie = true; tSortie = performance.now(); deselectionner(); }
    function detruireTout(){
      detruit = true; if (rafId) cancelAnimationFrame(rafId);
      removeEventListener('resize', disposer);
      document.removeEventListener('visibilitychange', surVisibilite);
      scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material){ (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); } });
      envTex.dispose(); pmrem.dispose(); renderer.dispose();
      try { renderer.forceContextLoss(); } catch (e) {}
    }

    // accès de test (sans effet en production)
    window.__tbEntree = { OBJ, selectionner, deselectionner, etat, get horloge(){ return horloge; }, get construction(){ return construction; }, avancer(v){ construction = v; }, tourner(v){ phi = v; } };
    return { sortir, detruire: detruireTout, deselectionner };
  }
}


/* --------------------------------------------------------------------------
   Engrenage de chargement : grande roue dentée autour de l'emblème,
   pignon engrené qui affiche l'avancement, arc de progression
   -------------------------------------------------------------------------- */
function creerEngrenage(svg, reduit){
  const NS = 'http://www.w3.org/2000/svg';
  const N1 = 48, R1 = 69, N2 = 12, M = 2 * R1 / N1, R2 = M * N2 / 2, D = R1 + R2, A2 = -42 * Math.PI / 180;
  const C2 = [D * Math.cos(A2), D * Math.sin(A2)];
  function denture(N, rp){
    const ra = rp + M, rf = rp - 1.25 * M, t = 2 * Math.PI / N; let d = '';
    for (let i = 0; i < N; i++){
      const a = i * t, P = (r, b) => (r * Math.cos(b)).toFixed(2) + ',' + (r * Math.sin(b)).toFixed(2);
      d += (i ? 'L' : 'M') + P(rf, a - 0.27 * t) + 'L' + P(ra, a - 0.13 * t) + 'L' + P(ra, a + 0.13 * t) + 'L' + P(rf, a + 0.27 * t)
         + 'A' + rf.toFixed(2) + ',' + rf.toFixed(2) + ' 0 0 1 ' + P(rf, a + 0.73 * t);
    }
    return d + 'Z';
  }
  const el = (n, a, parent) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); (parent || svg).appendChild(e); return e; };
  const roue = el('g', { class: 'tbe-roue' });
  el('path', { d: denture(N1, R1), class: 'tbe-dent' }, roue);
  el('circle', { r: 60.5, class: 'tbe-trait' }, roue);
  for (let k = 0; k < 24; k++){ const a = k * Math.PI / 12; el('line', { x1: (61.6 * Math.cos(a)).toFixed(2), y1: (61.6 * Math.sin(a)).toFixed(2), x2: (63.4 * Math.cos(a)).toFixed(2), y2: (63.4 * Math.sin(a)).toFixed(2), class: 'tbe-trait' }, roue); }
  const L = 2 * Math.PI * 57;
  const arc = el('circle', { r: 57, class: 'tbe-arc', transform: 'rotate(-90)', 'stroke-dasharray': L.toFixed(1), 'stroke-dashoffset': L.toFixed(1) });
  const pignonPos = el('g', { transform: `translate(${C2[0].toFixed(2)} ${C2[1].toFixed(2)})` });
  const pignon = el('g', {}, pignonPos);
  el('path', { d: denture(N2, R2), class: 'tbe-dent' }, pignon);
  el('circle', { r: 12.2, class: 'tbe-trait' }, pignon);
  for (let k = 0; k < 6; k++){ const a = k * Math.PI / 3; el('line', { x1: (12.2 * Math.cos(a)).toFixed(2), y1: (12.2 * Math.sin(a)).toFixed(2), x2: (R2 - 1.25 * M - 0.2) * Math.cos(a), y2: (R2 - 1.25 * M - 0.2) * Math.sin(a), class: 'tbe-trait' }, pignon); }
  const texte = el('text', { class: 'tbe-pct', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, pignonPos);
  texte.textContent = '0';

  let th = 0, vit = reduit ? 0 : 26, cible = reduit ? 0 : 26, prog = 0, fini = false, raf = 0, t0 = performance.now();
  function tour(now){
    const dt = Math.max(0, Math.min(0.05, (now - t0) / 1000)); t0 = now;
    vit += (cible - vit) * (1 - Math.exp(-1.5 * dt));
    th += vit * dt;
    roue.setAttribute('transform', 'rotate(' + th.toFixed(2) + ')');
    pignon.setAttribute('transform', 'rotate(' + (-th * N1 / N2 + 180 / N2).toFixed(2) + ')');
    raf = requestAnimationFrame(tour);
  }
  if (!reduit) raf = requestAnimationFrame(tour);
  else pignon.setAttribute('transform', 'rotate(' + (180 / N2) + ')');
  return {
    progression(p, termine){
      if (fini) return;
      p = Math.max(prog, Math.min(1, p)); prog = p;
      arc.setAttribute('stroke-dashoffset', (L * (1 - p)).toFixed(1));
      texte.textContent = termine ? 100 : Math.min(99, Math.floor(p * 100));
      if (termine){
        fini = true; cible = reduit ? 0 : 4;
        svg.classList.add('tbe-fini');
      }
    },
    abandon(){ fini = true; cible = reduit ? 0 : 4; svg.classList.add('tbe-fini'); },
    arreter(){ cancelAnimationFrame(raf); }
  };
}


/* --------------------------------------------------------------------------
   Fabrique de modèles 3D (commune à l'écran d'entrée et à la galerie de la page) :
   éclairage studio, matériaux, tracé « dessin puis volumes », tôles du taureau
   -------------------------------------------------------------------------- */
function atelier(THREE, renderer){
    // éclairage studio (sert à l'ours en tôles pleines, repris de sa page)
    function studio(){
      const s = new THREE.Scene(); s.background = new THREE.Color(0x3d2f1f);
      const boite = (d, l, h, k, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(l, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), side: THREE.DoubleSide })); m.position.copy(d).normalize().multiplyScalar(10); m.lookAt(0, 0, 0); s.add(m); };
      const V = (x, y, z) => new THREE.Vector3(x, y, z);
      boite(V(0.2, 1.2, 1.3), 9, 6, 2.3, 0xfff2dc);
      boite(V(-1.3, 0.4, -0.4), 2.6, 12, 2.2, 0xffe0b0);
      boite(V(1.2, 0.6, -0.8), 2.0, 10, 1.2, 0xffe0b0);
      boite(V(-0.6, -0.2, 1.2), 6, 4, 0.85, 0xffe6c0);
      boite(V(0, 2, 0), 7, 7, 0.75, 0xfff4e4);
      return s;
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(studio(), 0.02).texture;
    /* ---------- matériau des traits : champagne, tracé progressif « ligne après ligne »,
                  reflet qui parcourt la pièce ---------- */
    const OR = new THREE.Color(0xC9A66B);
    function materiauTraits(R){
      return new THREE.ShaderMaterial({
        transparent: true, depthWrite: false,
        uniforms: { uCol: { value: OR }, uOp: { value: 0 }, uHi: { value: 0 }, uSweep: { value: -9 }, uR: { value: R }, uProg: { value: 0 } },
        vertexShader: `attribute float a; attribute float tt; varying float vA; varying float vS; varying float vT; uniform float uR;
          void main(){ vA = a; vT = tt; vS = (position.x * 0.8 + position.y * 0.6) / uR; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform vec3 uCol; uniform float uOp; uniform float uHi; uniform float uSweep; uniform float uProg; varying float vA; varying float vS; varying float vT;
          void main(){
            if (vT > uProg) discard;
            float pointe = (1.0 - smoothstep(0.0, 0.012, uProg - vT)) * step(uProg, 0.9995);   // le « crayon » qui trace
            float g = exp(-pow((vS - uSweep) / 0.16, 2.0));
            vec3 c = uCol * (0.92 + 0.45 * uHi) + vec3(1.0, 0.92, 0.76) * (g * 0.6 + pointe * 0.9);
            gl_FragColor = vec4(c, clamp(vA * uOp * (1.0 + 0.4 * uHi + pointe) + g * 0.3 * vA * uOp, 0.0, 1.0));
          }`
      });
    }
    // volumes masquants (lignes cachées) : apparaissent quand leur pièce est tracée
    function materiauOccultant(){
      return new THREE.ShaderMaterial({
        polygonOffset: true, polygonOffsetFactor: 1.5, polygonOffsetUnits: 2,
        uniforms: { uProg: { value: 0 } },
        vertexShader: `attribute float tt; varying float vT; void main(){ vT = tt; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform float uProg; varying float vT; void main(){ if (vT > uProg) discard; gl_FragColor = vec4(0.031, 0.031, 0.031, 1.0); }`
      });
    }

    /* ---------- construction d'un modèle de traits ---------- */
    function trianguler(pts){                 // polygone plan → triangles
      const n = pts.length; if (n < 3) return [];
      const N = new THREE.Vector3();
      for (let i = 0; i < n; i++){ const a = pts[i], b = pts[(i + 1) % n]; N.x += (a.y - b.y) * (a.z + b.z); N.y += (a.z - b.z) * (a.x + b.x); N.z += (a.x - b.x) * (a.y + b.y); }
      if (N.lengthSq() < 1e-14) return [];
      N.normalize();
      const u = new THREE.Vector3().crossVectors(N, Math.abs(N.z) < 0.9 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0)).normalize();
      const v = new THREE.Vector3().crossVectors(N, u);
      const c2 = pts.map(p => new THREE.Vector2(p.dot(u), p.dot(v)));
      const out = [];
      THREE.ShapeUtils.triangulateShape(c2, []).forEach(t => t.forEach(k => out.push(pts[k].x, pts[k].y, pts[k].z)));
      return out;
    }
    function triangulerTrous(pts, trous){      // polygone plan avec trous (lamelles ajourées, roues) → triangles
      const ferme = a => (a.length > 3 && a[0].distanceTo(a[a.length - 1]) < 1e-6 ? a.slice(0, -1) : a);
      pts = ferme(pts); trous = trous.map(ferme).filter(t => t.length >= 3);
      const n = pts.length; if (n < 3) return [];
      const N = new THREE.Vector3();
      for (let i = 0; i < n; i++){ const a = pts[i], b = pts[(i + 1) % n]; N.x += (a.y - b.y) * (a.z + b.z); N.y += (a.z - b.z) * (a.x + b.x); N.z += (a.x - b.x) * (a.y + b.y); }
      if (N.lengthSq() < 1e-14) return [];
      N.normalize();
      const u = new THREE.Vector3().crossVectors(N, Math.abs(N.z) < 0.9 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0)).normalize();
      const v = new THREE.Vector3().crossVectors(N, u);
      const v2 = a => a.map(p => new THREE.Vector2(p.dot(u), p.dot(v)));
      const tous = pts.concat(...trous), out = [];
      THREE.ShapeUtils.triangulateShape(v2(pts), trous.map(v2)).forEach(t => t.forEach(k => out.push(tous[k].x, tous[k].y, tous[k].z)));
      return out;
    }
    function lirePolyligne(pl){ const p = []; for (let k = 0; k < pl.length; k += 3) p.push(new THREE.Vector3(pl[k] / 1000, pl[k + 1] / 1000, pl[k + 2] / 1000)); return p; }

    function construireTraits(def){
      const parts = {};                        // part → traits (pos, a, tt) + masques (occ, ott)
      const P = k => (parts[k] = parts[k] || { pos: [], a: [], tt: [], occ: [], ott: [] });
      const ajouterOcc = (c, tris, t) => { c.occ.push(...tris); for (let i = 0; i < tris.length / 3; i++) c.ott.push(t); };
      def.lignes.forEach(g => {
        const cible = P(g.part), remplis = new Set(g.f || []), tm = g.tm || [];
        g.pl.forEach((pl, j) => {
          const t0 = (tm[2 * j] || 0) / 10000, t1 = (tm[2 * j + 1] || 0) / 10000;
          // temps de chaque sommet : réparti le long de la polyligne, dans l'ordre du tracé d'origine
          let tot = 0; const lg = [0];
          for (let k = 3; k < pl.length; k += 3){ tot += Math.hypot(pl[k] - pl[k - 3], pl[k + 1] - pl[k - 2], pl[k + 2] - pl[k - 1]); lg.push(tot); }
          const T = i => t0 + (t1 - t0) * (tot ? lg[i] / tot : 1);
          for (let k = 0, i = 0; k + 5 < pl.length; k += 3, i++){
            cible.pos.push(pl[k] / 1000, pl[k + 1] / 1000, pl[k + 2] / 1000, pl[k + 3] / 1000, pl[k + 4] / 1000, pl[k + 5] / 1000);
            cible.a.push(g.op, g.op); cible.tt.push(T(i), T(i + 1));
          }
          if (remplis.has(j)){ const pts = lirePolyligne(pl); if (pts.length > 3 && pts[0].distanceTo(pts[pts.length - 1]) < 1e-6) pts.pop(); ajouterOcc(cible, trianguler(pts), t1); }
        });
      });
      (def.occP || []).forEach(o => o.pl.forEach((pl, j) => ajouterOcc(P(o.part), trianguler(lirePolyligne(pl)), ((o.tt || [])[j] || 0) / 10000)));
      (def.occ || []).forEach(o => ajouterOcc(P(o.part), o.t.map(v => v / 1000), (o.tt || 0) / 10000));
      (def.occH || []).forEach(o => ajouterOcc(P(o.part), triangulerTrous(lirePolyligne(o.out), (o.holes || []).map(lirePolyligne)), (o.tt || 0) / 10000));
      // boîte englobante
      const bb = new THREE.Box3();
      Object.values(parts).forEach(p => { for (let k = 0; k < p.pos.length; k += 3) bb.expandByPoint(new THREE.Vector3(p.pos[k], p.pos[k + 1], p.pos[k + 2])); });
      const centre = bb.getCenter(new THREE.Vector3());
      let R = 0; Object.values(parts).forEach(p => { for (let k = 0; k < p.pos.length; k += 3) R = Math.max(R, Math.hypot(p.pos[k] - centre.x, p.pos[k + 1] - centre.y, p.pos[k + 2] - centre.z)); });
      const modele = new THREE.Group(); modele.position.copy(centre).multiplyScalar(-1);
      const mats = [], prog = [], pivots = {};
      Object.entries(parts).forEach(([k, p]) => {
        const piv = def.pivots && def.pivots[k];
        const grp = new THREE.Group();
        if (piv){ grp.position.set(piv.x, 0, piv.z); pivots[k] = { g: grp, sens: piv.sens, max: piv.max }; }
        const dx = piv ? -piv.x : 0, dz = piv ? -piv.z : 0;
        if (p.pos.length){
          const geo = new THREE.BufferGeometry();
          geo.setAttribute('position', new THREE.Float32BufferAttribute(p.pos, 3));
          geo.setAttribute('a', new THREE.Float32BufferAttribute(p.a, 1));
          geo.setAttribute('tt', new THREE.Float32BufferAttribute(p.tt, 1));
          geo.translate(dx, 0, dz);
          const m = materiauTraits(R); mats.push(m); prog.push(m);
          const ls = new THREE.LineSegments(geo, m); ls.renderOrder = 2; ls.frustumCulled = false; grp.add(ls);
        }
        if (p.occ.length){
          const og = new THREE.BufferGeometry(); og.setAttribute('position', new THREE.Float32BufferAttribute(p.occ, 3));
          og.setAttribute('tt', new THREE.Float32BufferAttribute(p.ott, 1)); og.translate(dx, 0, dz);
          const om = materiauOccultant(); prog.push(om);
          const me = new THREE.Mesh(og, om); me.renderOrder = 1; me.frustumCulled = false; grp.add(me);
        }
        modele.add(grp);
      });
      return { modele, R, mats, prog, pivots, metal: [], bas: (bb.min.y - centre.y) / R, poser: null };
    }

    /* ---------- l'ours : tôles pliées qui arrivent une à une et s'accostent (repris de sa page) ---------- */
    function construireOurs(def){
      const base = { flatShading: true, envMap: envTex };
      const MAT = {
        metal:  { color: 0xCFB07C, metalness: 1.0, roughness: 0.38 },
        truffe: { color: 0x3a2a16, metalness: 0.9, roughness: 0.22 },
        oeil:   { color: 0x1c140a, metalness: 1.0, roughness: 0.12 },
        bouche: { color: 0x140d07, metalness: 0.35, roughness: 0.85, envMapIntensity: 0.25 },
        dent:   { color: 0xD9C7A0, metalness: 0.55, roughness: 0.42 },
        griffe: { color: 0xCDB487, metalness: 0.8, roughness: 0.3 },
        bois:   { color: 0x7d5734, metalness: 0.12, roughness: 0.62, envMapIntensity: 0.55 }
      };
      MAT.verre = { color: 0xc9dadc, metalness: 0.0, roughness: 0.06, transparent: true, opacity: 0.2, depthWrite: false, envMapIntensity: 1.3 };
      MAT.acier = { color: 0xa8957a, metalness: 1.0, roughness: 0.46 };
      MAT.pneu  = { color: 0x1d1a16, metalness: 0.35, roughness: 0.78, envMapIntensity: 0.4 };
      const metal = [], EXT = {}, DBL = {};
      for (const k in MAT){
        EXT[k] = new THREE.MeshStandardMaterial({ ...base, ...MAT[k], side: THREE.FrontSide });
        DBL[k] = new THREE.MeshStandardMaterial({ ...base, ...MAT[k], side: THREE.DoubleSide });
        metal.push(EXT[k], DBL[k]);
      }
      const INT = new THREE.MeshStandardMaterial({ color: 0x5b4426, metalness: 0.9, roughness: 0.55, flatShading: true, side: THREE.BackSide, envMap: envTex });
      metal.push(INT); metal.forEach(m => { m.userData.env0 = m.envMapIntensity; m.userData.op0 = m.opacity; });
      const F = 1 / 1000, CM = 1 / 100;                       // données en mm → mètres ; constantes d'origine en cm
      const YAW = THREE.MathUtils.degToRad(def.yaw || 44);
      const U = new THREE.Vector3(0, 1, 0), B = new THREE.Vector3(Math.sin(YAW), 0, Math.cos(YAW)), Rv = new THREE.Vector3().crossVectors(U, B);
      const modele = new THREE.Group(), bb = new THREE.Box3();
      const hash = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
      const soudures = [];
      const V3 = a => new THREE.Vector3(a[0] * F, a[1] * F, a[2] * F);

      /* ---- formes élémentaires des pièces pleines (mm) : boîte, extrusion, cylindre, balayage, sphère ---- */
      const _m = new THREE.Matrix4(), _x = new THREE.Vector3(), _y = new THREE.Vector3(), _z = new THREE.Vector3();
      function barre(A, Bp, w, h, up){              // pavé de section w × h entre deux points
        const L = A.distanceTo(Bp); if (L < 1e-9) return null;
        const g = new THREE.BoxGeometry(w, h, L + Math.min(w, h) * 0.02);
        _z.subVectors(Bp, A).normalize();
        _x.crossVectors(up, _z); if (_x.lengthSq() < 1e-9) _x.set(1, 0, 0).cross(_z); _x.normalize();
        _y.crossVectors(_z, _x);
        _m.makeBasis(_x, _y, _z).setPosition(A.clone().add(Bp).multiplyScalar(0.5));
        return g.applyMatrix4(_m);
      }
      function forme(f){
        let g = null;
        if (f.t === 'b'){
          g = new THREE.BoxGeometry(f.s[0] * F, f.s[1] * F, f.s[2] * F);
          if (f.q) g.applyQuaternion(new THREE.Quaternion(f.q[0], f.q[1], f.q[2], f.q[3]));
          g.translate(f.c[0] * F, f.c[1] * F, f.c[2] * F);
        } else if (f.t === 'x'){
          const pt = a => { const r = []; for (let k = 0; k < a.length; k += 2) r.push(new THREE.Vector2(a[k] * F, a[k + 1] * F)); return r; };
          const sh = new THREE.Shape(pt(f.pts)); (f.h || []).forEach(h => sh.holes.push(new THREE.Path(pt(h))));
          g = new THREE.ExtrudeGeometry(sh, { depth: f.e * F, bevelEnabled: false, curveSegments: 1 });
          g.translate(0, 0, -f.e * F / 2);
          const u = new THREE.Vector3().fromArray(f.u).normalize(), v = new THREE.Vector3().fromArray(f.v).normalize(), n = new THREE.Vector3().crossVectors(u, v).normalize();
          _m.makeBasis(u, v, n).setPosition(V3(f.o)); g.applyMatrix4(_m);
        } else if (f.t === 'c'){
          const A = V3(f.a), Bp = V3(f.b), L = A.distanceTo(Bp);
          g = new THREE.CylinderGeometry(f.r * F, (f.r2 || f.r) * F, L, f.n || 10, 1, false);
          g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), Bp.clone().sub(A).normalize()));
          g.translate((A.x + Bp.x) / 2, (A.y + Bp.y) / 2, (A.z + Bp.z) / 2);
        } else if (f.t === 's'){
          const up = new THREE.Vector3().fromArray(f.up || [0, 1, 0]).normalize(), parts = [];
          for (let k = 0; k + 5 < f.pts.length; k += 3){ const q = barre(V3(f.pts.slice(k, k + 3)), V3(f.pts.slice(k + 3, k + 6)), f.w * F, f.h * F, up); if (q) parts.push(q.toNonIndexed()); }
          g = fusion(parts);
        } else if (f.t === 'o'){
          g = new THREE.IcosahedronGeometry(f.r * F, f.d === undefined ? 1 : f.d); g.translate(f.c[0] * F, f.c[1] * F, f.c[2] * F);
        }
        return g ? (g.index ? g.toNonIndexed() : g) : null;
      }
      function fusion(liste){
        let n = 0; liste.forEach(g => { n += g.attributes.position.count; });
        const pos = new Float32Array(n * 3); let o = 0;
        liste.forEach(g => { pos.set(g.attributes.position.array, o); o += g.attributes.position.count * 3; });
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); return g;
      }
      function pieceV2(d){
        const parMat = {};
        d.f.forEach(f => { const g = forme(f); if (g) (parMat[f.m || 'metal'] = parMat[f.m || 'metal'] || []).push(g); });
        const noms = Object.keys(parMat), listes = noms.map(k => fusion(parMat[k]));
        const geo = fusion(listes), mats = []; let debut = 0;
        listes.forEach((l, i) => { const n = l.attributes.position.count; geo.addGroup(debut, n, i); mats.push(DBL[noms[i]] || DBL.metal); debut += n; });
        geo.computeVertexNormals();
        return { geo, mats, kg: new THREE.EdgesGeometry(geo, 40) };
      }

      const PIECES = def.pieces.map((d, i) => {
        let geo, mats, kg, rap;
        if (d.f){ ({ geo, mats, kg } = pieceV2(d)); rap = true; }
        else {
          const pos = new Float32Array(d.t.length); for (let j = 0; j < d.t.length; j++) pos[j] = d.t[j] * F;
          geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
          rap = d.e === 'rapportee'; mats = [];
          d.g.forEach(([nom, debut, n]) => { geo.addGroup(debut * 3, n * 3, mats.length); mats.push(rap ? DBL[nom] : EXT[nom]); });
          geo.computeVertexNormals();
          const kp = new Float32Array(d.k.length); for (let j = 0; j < d.k.length; j++) kp[j] = d.k[j] * F;
          kg = new THREE.BufferGeometry(); kg.setAttribute('position', new THREE.BufferAttribute(kp, 3));
        }
        geo.computeBoundingBox(); bb.union(geo.boundingBox);
        const mesh = new THREE.Mesh(geo, mats); mesh.frustumCulled = false;
        let dos = null; if (!rap){ dos = new THREE.Mesh(geo, INT); dos.frustumCulled = false; mesh.add(dos); }
        const km = new THREE.LineBasicMaterial({ color: 0xFFDCA2, transparent: true, opacity: 0, depthWrite: false });
        const ligne = new THREE.LineSegments(kg, km); ligne.visible = false; mesh.add(ligne); soudures.push(km);
        const bx = geo.boundingBox, c = d.c ? V3(d.c) : bx.getCenter(new THREE.Vector3());
        let r = d.r !== undefined ? d.r / 10 : 0;
        if (d.r === undefined){ const p = geo.attributes.position.array; for (let k = 0; k < p.length; k += 3) r = Math.max(r, Math.hypot(p[k] - c.x, p[k + 1] - c.y, p[k + 2] - c.z)); r /= CM; }
        return { rap, mesh, dos, km, ligne, c, part: d.p || 0, a: d.a ? new THREE.Vector3().fromArray(d.a).normalize() : null, r,
                 S0: d.S ? V3(d.S) : null, q0: d.q ? new THREE.Quaternion(d.q[0], d.q[1], d.q[2], d.q[3]) : null,
                 axe: new THREE.Vector3(hash(i, 1) - 0.5, hash(i, 2) - 0.5, hash(i, 3) - 0.5).normalize(),
                 vit: 0.5 + 0.6 * hash(i, 4), phase: hash(i, 5) * Math.PI * 2, s: 0, du: 0, repos: null };
      });
      // portes articulées (portail, verrière) : chaque vantail tourne autour de son axe de gonds
      const pivots = {}, groupesPart = {};
      PIECES.forEach(P => {
        let parent = modele;
        const pv = def.pivots && def.pivots[P.part];
        if (pv){
          if (!groupesPart[P.part]){
            const g = new THREE.Group(), inner = new THREE.Group();
            g.position.set(pv.x * F, 0, pv.z * F); inner.position.set(-pv.x * F, 0, -pv.z * F); g.add(inner); modele.add(g);
            groupesPart[P.part] = inner; pivots[P.part] = { g, sens: pv.sens, max: pv.max };
          }
          parent = groupesPart[P.part];
        }
        parent.add(P.mesh);
      });
      const centre = bb.getCenter(new THREE.Vector3());
      let R = 0;
      PIECES.forEach(P => { const p = P.mesh.geometry.attributes.position.array; for (let k = 0; k < p.length; k += 3) R = Math.max(R, Math.hypot(p[k] - centre.x, p[k + 1] - centre.y, p[k + 2] - centre.z)); });
      // départ : les pièces disposées en couronne autour de l'emplacement de la création
      let ex = 0, ey = 0; PIECES.forEach(P => { const v = P.c.clone().sub(centre); ex = Math.max(ex, Math.abs(v.dot(Rv))); ey = Math.max(ey, Math.abs(v.dot(U))); });
      const rx = Math.max(ex, R * 0.5) * 1.3 + R * 0.12, ry = Math.max(ey, R * 0.35) * 1.45 + R * 0.12;
      PIECES.forEach((P, i) => {
        const v = P.c.clone().sub(centre);
        if (!P.S0){
          const ang = Math.atan2(v.dot(U) / ry, v.dot(Rv) / rx) + (hash(i, 6) - 0.5) * 0.25, k = 1 + 0.12 * hash(i, 7);
          P.S0 = centre.clone().addScaledVector(Rv, rx * Math.cos(ang) * k).addScaledVector(U, ry * Math.sin(ang) * k).addScaledVector(B, (hash(i, 8) - 0.5) * R * 0.15);
        }
        if (!P.q0){ const th = 0.6 + 1.4 * hash(i, 9); P.q0 = new THREE.Quaternion().setFromAxisAngle(P.axe, th); }
        if (!P.a){ const o = v.lengthSq() > 1e-10 ? v.clone().normalize() : U.clone(); o.y = o.y * 0.6 + 0.25; P.a = o.normalize(); }
        P.S = P.S0.clone(); P.avant = (P.c.x - centre.x) * B.x + (P.c.z - centre.z) * B.z > 0 ? 1 : -1;
      });
      // calendrier d'origine : des pattes vers la tête, puis yeux, griffes, dents
      const DEBUT = 0.035, FIN_ASS = 0.925, NP = PIECES.length;
      const poids = PIECES.map(P => P.rap ? 0.06 : 0.14 + Math.pow(P.r / 72, 0.8));
      const duree = PIECES.map(P => P.rap ? 0.045 : 0.05 + 0.055 * Math.pow(P.r / 72, 0.6));
      const Wp = poids.slice(0, -1).reduce((s, x) => s + x, 0), etendue = FIN_ASS - duree[NP - 1] - DEBUT;
      let cum = 0; PIECES.forEach((P, i) => { P.s = DEBUT + etendue * cum / Wp; P.du = duree[i]; cum += poids[i]; });
      const borne = x => x < 0 ? 0 : x > 1 ? 1 : x, douce = t => t * t * t * (t * (t * 6 - 15) + 10);
      const ID = new THREE.Quaternion(), _q = new THREE.Quaternion(), _qd = new THREE.Quaternion();
      const _p0 = new THREE.Vector3(), _p1 = new THREE.Vector3(), _p2 = new THREE.Vector3(), _pos = new THREE.Vector3(), _quat = new THREE.Quaternion();
      function attente(P, p, pos, quat){
        const t = Math.min(p, P.s);
        _qd.setFromAxisAngle(P.axe, P.vit * t * 2.2); quat.copy(_qd).multiply(P.q0);
        pos.copy(P.S).addScaledVector(U, 2.0 * CM * Math.sin(P.phase + t * 9)).addScaledVector(Rv, 1.5 * CM * Math.cos(P.phase * 1.7 + t * 7));
      }
      function etat(P, p, pos, quat){
        const t = (p - P.s) / P.du;
        if (t >= 1){ pos.copy(P.c); quat.identity(); return 1; }
        attente(P, p, pos, quat);
        if (t <= 0) return t;
        const u = douce(t), dock = (10 + 0.45 * P.r) * CM, bombe = (14 + 0.25 * P.r) * CM * P.avant;
        _p0.copy(pos); _p2.copy(P.c).addScaledVector(P.a, dock); _p1.copy(_p0).lerp(_p2, 0.45).addScaledVector(B, bombe);
        const v = 1 - u;
        pos.set(0, 0, 0).addScaledVector(_p0, v * v * v).addScaledVector(_p1, 3 * v * v * u).addScaledVector(_p2, 3 * v * u * u).addScaledVector(P.c, u * u * u);
        _q.copy(quat); quat.slerpQuaternions(_q, ID, douce(borne(t / 0.8)));
        return t;
      }
      const contour = t => t <= 0.8 || t >= 1 ? 0 : t < 0.9 ? 0.62 * (t - 0.8) / 0.1 : 0.62 * (1 - (t - 0.9) / 0.1);
      function poser(p, opacite){
        PIECES.forEach(P => {
          const t = etat(P, p, _pos, _quat), repos = t >= 1;
          if (repos){ P.mesh.position.set(0, 0, 0); P.mesh.quaternion.identity(); }
          else { P.mesh.quaternion.copy(_quat); P.mesh.position.copy(P.c).applyQuaternion(_quat).negate().add(_pos); }
          if (P.dos) P.dos.visible = !repos;
          const o = contour(t) * opacite; P.km.opacity = o; P.ligne.visible = o > 0.01;
        });
      }
      // cadrage comme sur sa page : au départ toute la couronne est visible, puis on se rapproche
      // à mesure que les tôles s'assemblent (le zoom ne recule jamais)
      const NSC = 120, rayons = [];
      for (let k = 0; k <= NSC; k++){
        const p = k / NSC, horizon = Math.max(0.24, 1 - 8 * p); let rm = R;
        PIECES.forEach(P => { if (P.s > p + horizon) return; etat(P, p, _pos, _quat); rm = Math.max(rm, _pos.distanceTo(centre) + P.r * CM * 0.9); });
        rayons.push(rm);
      }
      for (let k = 1; k <= NSC; k++) rayons[k] = Math.min(rayons[k], rayons[k - 1]);
      const lisses = rayons.map((_, k) => { let s = 0, n = 0; for (let j = Math.max(0, k - 6); j <= Math.min(NSC, k + 6); j++){ s += rayons[j]; n++; } return s / n; });
      lisses[NSC] = R;
      function cadrage(p){
        const x = Math.max(0, Math.min(1, p / FIN_ASS)) * NSC, k = Math.min(NSC - 1, Math.floor(x)), t = x - k;
        return R / (lisses[k] + (lisses[k + 1] - lisses[k]) * t);
      }
      modele.position.copy(centre).multiplyScalar(-1);
      return { modele, R, mats: [], prog: [], pivots, metal, bas: (bb.min.y - centre.y) / R, poser, cadrage };
    }

    /* ---------- créations dessinées puis remplies : les traits se tracent pièce après pièce,
                  puis les volumes se remplissent à la fin du dessin ---------- */
    const FM = 1 / 1000, V3m = a => new THREE.Vector3(a[0] * FM, a[1] * FM, a[2] * FM);
    const _mm = new THREE.Matrix4(), _xx = new THREE.Vector3(), _yy = new THREE.Vector3(), _zz = new THREE.Vector3();
    function repere(A, Bp, up){
      _zz.subVectors(Bp, A).normalize();
      _xx.crossVectors(up, _zz); if (_xx.lengthSq() < 1e-9) _xx.set(1, 0, 0).cross(_zz); _xx.normalize();
      _yy.crossVectors(_zz, _xx);
      return [_xx.clone(), _yy.clone(), _zz.clone()];
    }
    function nonIndexe(g){ return g.index ? g.toNonIndexed() : g; }
    function fusionG(liste){
      let n = 0; liste.forEach(g => { n += g.attributes.position.count; });
      const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3); let o = 0;
      liste.forEach(g => {
        if (!g.attributes.normal) g.computeVertexNormals();
        pos.set(g.attributes.position.array, o); nor.set(g.attributes.normal.array, o); o += g.attributes.position.count * 3;
      });
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); return g;
    }
    // limon hélicoïdal débillardé : génératrices verticales, surfaces lisses (sans facettes)
    function limonHelice(f){
      const n = Math.max(8, Math.round(Math.abs(f.a1 - f.a0) / 1.0)), surf = [];
      const P = (r, a, y) => new THREE.Vector3(r * FM * Math.cos(a * Math.PI / 180), y * FM, r * FM * Math.sin(a * Math.PI / 180));
      const yTop = a => f.y0 + f.k * (a - f.a0), yBot = a => Math.max(f.ymin === undefined ? -1e9 : f.ymin, yTop(a) - f.h);
      const nappe = (fa, fb) => {                         // bande entre deux courbes paramétrées, lissée
        const pos = [], idx = [];
        for (let i = 0; i <= n; i++){ const a = f.a0 + (f.a1 - f.a0) * i / n; const A = fa(a), Bq = fb(a); pos.push(A.x, A.y, A.z, Bq.x, Bq.y, Bq.z); }
        for (let i = 0; i < n; i++){ const k = 2 * i; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
        surf.push(g.toNonIndexed());
      };
      const ri = f.r, re = f.r + f.ep;
      nappe(a => P(ri, a, yTop(a)), a => P(ri, a, yBot(a)));
      nappe(a => P(re, a, yBot(a)), a => P(re, a, yTop(a)));
      nappe(a => P(re, a, yTop(a)), a => P(ri, a, yTop(a)));
      nappe(a => P(ri, a, yBot(a)), a => P(re, a, yBot(a)));
      [f.a0, f.a1].forEach(a => {
        const q = [P(ri, a, yTop(a)), P(re, a, yTop(a)), P(re, a, yBot(a)), P(ri, a, yBot(a))];
        const g = new THREE.BufferGeometry().setFromPoints([q[0], q[1], q[2], q[0], q[2], q[3]]); g.computeVertexNormals(); surf.push(g);
      });
      return fusionG(surf);
    }
    function formeG(f){
      let g = null;
      if (f.t === 'b'){
        g = new THREE.BoxGeometry(f.s[0] * FM, f.s[1] * FM, f.s[2] * FM);
        if (f.q) g.applyQuaternion(new THREE.Quaternion(f.q[0], f.q[1], f.q[2], f.q[3]));
        g.translate(f.c[0] * FM, f.c[1] * FM, f.c[2] * FM);
      } else if (f.t === 'x'){
        const pt = a => { const r = []; for (let k = 0; k < a.length; k += 2) r.push(new THREE.Vector2(a[k] * FM, a[k + 1] * FM)); return r; };
        const sh = new THREE.Shape(pt(f.pts)); (f.h || []).forEach(h => sh.holes.push(new THREE.Path(pt(h))));
        g = new THREE.ExtrudeGeometry(sh, { depth: f.e * FM, bevelEnabled: false, curveSegments: 1 });
        g.translate(0, 0, -f.e * FM / 2);
        const u = new THREE.Vector3().fromArray(f.u).normalize(), v = new THREE.Vector3().fromArray(f.v).normalize(), n = new THREE.Vector3().crossVectors(u, v).normalize();
        _mm.makeBasis(u, v, n).setPosition(V3m(f.o)); g.applyMatrix4(_mm);
      } else if (f.t === 'c'){
        const A = V3m(f.a), Bp = V3m(f.b), L = A.distanceTo(Bp);
        g = new THREE.CylinderGeometry(f.r * FM, (f.r2 === undefined ? f.r : f.r2) * FM, L, f.n || 10, 1, false);
        g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), Bp.clone().sub(A).normalize()));
        g.translate((A.x + Bp.x) / 2, (A.y + Bp.y) / 2, (A.z + Bp.z) / 2);
      } else if (f.t === 's'){
        const up = new THREE.Vector3().fromArray(f.up || [0, 1, 0]).normalize(), parts = [];
        for (let k = 0; k + 5 < f.pts.length; k += 3){
          const A = V3m(f.pts.slice(k, k + 3)), Bp = V3m(f.pts.slice(k + 3, k + 6)), L = A.distanceTo(Bp); if (L < 1e-9) continue;
          const [x, y, z] = repere(A, Bp, up), q = new THREE.BoxGeometry(f.w * FM, f.h * FM, L + Math.min(f.w, f.h) * FM * 0.02);
          _mm.makeBasis(x, y, z).setPosition(A.clone().add(Bp).multiplyScalar(0.5)); parts.push(nonIndexe(q.applyMatrix4(_mm)));
        }
        g = parts.length ? fusionG(parts) : null;
      } else if (f.t === 'o'){
        g = new THREE.IcosahedronGeometry(f.r * FM, f.d === undefined ? 1 : f.d); g.translate(f.c[0] * FM, f.c[1] * FM, f.c[2] * FM);
      } else if (f.t === 'hl'){
        return limonHelice(f);
      } else if (f.t === 'tu'){
        const pts = []; for (let k = 0; k < f.pts.length; k += 3) pts.push(V3m(f.pts.slice(k, k + 3)));
        const courbe = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
        return new THREE.TubeGeometry(courbe, Math.max(24, pts.length * 3), f.r * FM, 12, false).toNonIndexed();
      } else if (f.t === 'm'){
        const pos = new Float32Array(f.v.length); for (let k = 0; k < f.v.length; k++) pos[k] = f.v[k] * FM;
        g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(f.i);
      } else if (f.t === 'tr'){
        const pos = new Float32Array(f.v.length); for (let k = 0; k < f.v.length; k++) pos[k] = f.v[k] * FM;
        g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      }
      return g ? nonIndexe(g) : null;
    }
    // arêtes à dessiner pour une forme (en mètres) : arêtes vives, axe des petits ronds, rives des balayages
    function aretesForme(f, g){
      if (f.t === 'hl'){
        const n = Math.max(8, Math.round(Math.abs(f.a1 - f.a0) / 1.0)), out = [];
        const P = (r, a, y) => [r * FM * Math.cos(a * Math.PI / 180), y * FM, r * FM * Math.sin(a * Math.PI / 180)];
        const yTop = a => f.y0 + f.k * (a - f.a0), yBot = a => Math.max(f.ymin === undefined ? -1e9 : f.ymin, yTop(a) - f.h);
        [[f.r, yTop], [f.r, yBot], [f.r + f.ep, yTop], [f.r + f.ep, yBot]].forEach(([r, Y]) => {
          for (let i = 0; i < n; i++){ const a = f.a0 + (f.a1 - f.a0) * i / n, b = f.a0 + (f.a1 - f.a0) * (i + 1) / n; out.push(...P(r, a, Y(a)), ...P(r, b, Y(b))); }
        });
        [f.a0, f.a1].forEach(a => [[f.r, yTop, f.r, yBot], [f.r + f.ep, yTop, f.r + f.ep, yBot], [f.r, yTop, f.r + f.ep, yTop], [f.r, yBot, f.r + f.ep, yBot]].forEach(([r1, Y1, r2, Y2]) => out.push(...P(r1, a, Y1(a)), ...P(r2, a, Y2(a)))));
        return out;
      }
      if (f.t === 'tu'){
        const pts = []; for (let k = 0; k < f.pts.length; k += 3) pts.push(V3m(f.pts.slice(k, k + 3)));
        const c = new THREE.CatmullRomCurve3(pts, false, 'centripetal').getPoints(Math.max(24, pts.length * 3)), out = [], r = f.r * FM;
        [r, -r].forEach(dy => { for (let i = 0; i + 1 < c.length; i++) out.push(c[i].x, c[i].y + dy, c[i].z, c[i + 1].x, c[i + 1].y + dy, c[i + 1].z); });
        return out;
      }
      if (f.t === 'c' && f.r <= 14){ const A = V3m(f.a), Bp = V3m(f.b); return [A.x, A.y, A.z, Bp.x, Bp.y, Bp.z]; }
      if (f.t === 's'){
        const up = new THREE.Vector3().fromArray(f.up || [0, 1, 0]).normalize(), P = [];
        for (let k = 0; k < f.pts.length; k += 3) P.push(V3m(f.pts.slice(k, k + 3)));
        const coins = [[-1, -1], [1, -1], [1, 1], [-1, 1]], rives = coins.map(() => []), out = [];
        P.forEach((p, i) => {
          const A = P[Math.max(0, i - 1)], Bp = P[Math.min(P.length - 1, i + 1)]; if (A.distanceTo(Bp) < 1e-9) return;
          const [x, y] = repere(A, Bp, up);
          coins.forEach((c, j) => rives[j].push(p.clone().addScaledVector(x, c[0] * f.w * FM / 2).addScaledVector(y, c[1] * f.h * FM / 2)));
        });
        rives.forEach(r => { for (let i = 0; i + 1 < r.length; i++) out.push(r[i].x, r[i].y, r[i].z, r[i + 1].x, r[i + 1].y, r[i + 1].z); });
        [0, rives[0].length - 1].forEach(i => { for (let j = 0; j < 4; j++){ const a = rives[j][i], b = rives[(j + 1) % 4][i]; if (a && b) out.push(a.x, a.y, a.z, b.x, b.y, b.z); } });
        return out;
      }
      const ar = Array.from(new THREE.EdgesGeometry(g, 30).attributes.position.array);
      if (f.t === 'c' && (f.n || 10) >= 12){                 // gros ronds (fût, platine) : quatre génératrices
        const A = V3m(f.a), Bp = V3m(f.b), [x, y] = repere(A, Bp, new THREE.Vector3(0, 1, 0.001)), r1 = f.r * FM, r2 = (f.r2 === undefined ? f.r : f.r2) * FM;
        [[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(([c, d]) => { const o = x.clone().multiplyScalar(c).addScaledVector(y, d); ar.push(A.x + o.x * r1, A.y + o.y * r1, A.z + o.z * r1, Bp.x + o.x * r2, Bp.y + o.y * r2, Bp.z + o.z * r2); });
      }
      return ar;
    }
    function materiauxPleins(){
      const base = { flatShading: true, envMap: envTex, side: THREE.DoubleSide };
      const M = {
        metal: new THREE.MeshStandardMaterial({ ...base, color: 0xCFB07C, metalness: 1.0, roughness: 0.38 }),
        lisse: new THREE.MeshStandardMaterial({ ...base, flatShading: false, color: 0xCFB07C, metalness: 1.0, roughness: 0.34 }),
        acier: new THREE.MeshStandardMaterial({ ...base, color: 0xa8957a, metalness: 1.0, roughness: 0.46 }),
        pneu:  new THREE.MeshStandardMaterial({ ...base, color: 0x1d1a16, metalness: 0.35, roughness: 0.78, envMapIntensity: 0.4 }),
        bois:  new THREE.MeshStandardMaterial({ ...base, color: 0x7d5734, metalness: 0.12, roughness: 0.62, envMapIntensity: 0.55 }),
        verre: new THREE.MeshStandardMaterial({ ...base, color: 0xc9dadc, metalness: 0.0, roughness: 0.06, transparent: true, opacity: 0.2, depthWrite: false, envMapIntensity: 1.3 })
      };
      for (const k in M){ M[k].userData.env0 = M[k].envMapIntensity; M[k].userData.op0 = M[k].opacity; M[k].userData.fill = 0; }
      return M;
    }
    function construireDessin(def){
      const M = materiauxPleins(), N = def.pieces.length, FIN_TRAIT = 0.84;
      const parts = {}, P = k => (parts[k] = parts[k] || { pos: [], tt: [], a: [], pleins: {} });
      def.pieces.forEach((d, k) => {
        const part = P(d.p || 0), s0 = FIN_TRAIT * k / (N + 1.5), s1 = s0 + FIN_TRAIT * 2.5 / (N + 1.5);
        const segs = [], alph = [];
        d.f.forEach(f => {
          const g = formeG(f); if (!g) return;
          const m = M[f.m] ? f.m : 'metal';
          (part.pleins[m] = part.pleins[m] || []).push(g);
          const ar = aretesForme(f, g); segs.push(...ar); for (let i = 0; i < ar.length / 6; i++) alph.push(m === 'verre' ? 0.45 : 1);
        });
        // temps de tracé : les arêtes de la pièce se dessinent l'une après l'autre dans sa fenêtre
        let tot = 0; const lg = [];
        for (let i = 0; i < segs.length; i += 6){ const l = Math.hypot(segs[i + 3] - segs[i], segs[i + 4] - segs[i + 1], segs[i + 5] - segs[i + 2]); lg.push(l); tot += l; }
        let cum = 0;
        lg.forEach((l, j) => {
          const ta = s0 + (s1 - s0) * (tot ? cum / tot : 0); cum += l; const tb = s0 + (s1 - s0) * (tot ? cum / tot : 1);
          for (let c = 0; c < 6; c++) part.pos.push(segs[j * 6 + c]);
          part.tt.push(ta, tb); part.a.push(alph[j], alph[j]);
          if (alph[j] > 0.5) (part.traces = part.traces || []).push([ta, tb, segs[j * 6], segs[j * 6 + 1], segs[j * 6 + 2], segs[j * 6 + 3], segs[j * 6 + 4], segs[j * 6 + 5]]);
        });
      });
      const bb = new THREE.Box3();
      Object.values(parts).forEach(p => { for (let k = 0; k < p.pos.length; k += 3) bb.expandByPoint(new THREE.Vector3(p.pos[k], p.pos[k + 1], p.pos[k + 2])); });
      const centre = bb.getCenter(new THREE.Vector3());
      let R = 0; Object.values(parts).forEach(p => { for (let k = 0; k < p.pos.length; k += 3) R = Math.max(R, Math.hypot(p.pos[k] - centre.x, p.pos[k + 1] - centre.y, p.pos[k + 2] - centre.z)); });
      const modele = new THREE.Group(); modele.position.copy(centre).multiplyScalar(-1);
      const mats = [], prog = [], pivots = {}, maillages = [], traces = [];
      Object.entries(parts).forEach(([k, p]) => {
        const pv = def.pivots && def.pivots[k];
        const g = new THREE.Group(), inner = new THREE.Group();
        if (pv){ g.position.set(pv.x * FM, 0, pv.z * FM); inner.position.set(-pv.x * FM, 0, -pv.z * FM); pivots[k] = { g, sens: pv.sens, max: pv.max }; }
        g.add(inner); modele.add(g);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(p.pos, 3));
        geo.setAttribute('a', new THREE.Float32BufferAttribute(p.a, 1));
        geo.setAttribute('tt', new THREE.Float32BufferAttribute(p.tt, 1));
        const lm = materiauTraits(R); lm.userData.dim = 1; mats.push(lm); prog.push(lm);
        (p.traces || []).forEach(t => traces.push({ t, g: inner }));
        const ls = new THREE.LineSegments(geo, lm); ls.renderOrder = 2; ls.frustumCulled = false; inner.add(ls);
        const noms = Object.keys(p.pleins), listes = noms.map(n => fusionG(p.pleins[n]));
        const pg = fusionG(listes), pm = []; let debut = 0;
        listes.forEach((l, i) => { const n = l.attributes.position.count; pg.addGroup(debut, n, i); pm.push(M[noms[i]]); debut += n; });
        const mesh = new THREE.Mesh(pg, pm); mesh.frustumCulled = false; mesh.visible = false; mesh.renderOrder = 1; inner.add(mesh); maillages.push(mesh);
      });
      const metal = Object.values(M);
      function poser(p){
        const x = Math.max(0, Math.min(1, (p - FIN_TRAIT) / (1 - FIN_TRAIT))), fill = x * x * (3 - 2 * x);
        metal.forEach(m => { m.userData.fill = fill; if (m !== M.verre) m.depthWrite = fill > 0.55; });
        maillages.forEach(me => { me.visible = fill > 0.004; });
        mats.forEach(m => { m.userData.dim = 1 - 0.5 * fill; });
      }
      // pointe du crayon : le trait le plus récent en cours de tracé à l'avancement p
      traces.sort((a, b) => a.t[0] - b.t[0]);
      const debuts = traces.map(x => x.t[0]), _v = new THREE.Vector3();
      function pointe(p){
        if (p <= 0.002 || p >= FIN_TRAIT || !traces.length) return null;
        let lo = 0, hi = debuts.length - 1;
        while (lo < hi){ const m = (lo + hi + 1) >> 1; if (debuts[m] <= p) lo = m; else hi = m - 1; }
        for (let i = lo; i >= Math.max(0, lo - 40); i--){
          const x = traces[i], t = x.t;
          if (t[0] <= p && p < t[1]){
            const u = (p - t[0]) / Math.max(1e-9, t[1] - t[0]);
            _v.set(t[2] + (t[5] - t[2]) * u, t[3] + (t[6] - t[3]) * u, t[4] + (t[7] - t[4]) * u);
            pointe.local = [(_v.x - bb.min.x) * 1000, (_v.y - bb.min.y) * 1000];      // cotes depuis l'angle bas du modèle (mm)
            return _v.applyMatrix4(x.g.matrixWorld);
          }
        }
        return null;
      }
      return { modele, R, mats, prog, pivots, metal, bas: (bb.min.y - centre.y) / R, poser, pointe };
    }

    function construireRepli(){                // si un modèle ne se charge pas : forme légère
      const geo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1, 1));
      const n = geo.attributes.position.count;
      geo.setAttribute('a', new THREE.BufferAttribute(new Float32Array(n).fill(0.55), 1));
      geo.setAttribute('tt', new THREE.BufferAttribute(new Float32Array(n).map((_, i) => (i >> 1) / (n / 2)), 1));
      const m = materiauTraits(1); const g = new THREE.Group(); g.add(new THREE.LineSegments(geo, m));
      return { modele: g, R: 1, mats: [m], prog: [m], pivots: {}, metal: [], poser: null };
    }
    function fabriquer(def){                  // dessin puis volumes ; tôles pliées (taureau) ; traits seuls
      return def.pieces ? (def.pieces[0] && def.pieces[0].f ? construireDessin(def) : construireOurs(def)) : construireTraits(def);
    }
    return { construireDessin, construireOurs, construireTraits, construireRepli, fabriquer, envTex, pmrem };
}

/* --------------------------------------------------------------------------
   Galerie 3D dans la page d'accueil (section « Mes créations en 3D »)
   Les neuf créations se dessinent puis se remplissent quand la section arrive
   à l'écran ; un clic ouvre la création en grand et la reconstruit.
   Rien n'est chargé tant que la section n'approche pas de l'écran.
   -------------------------------------------------------------------------- */
function galerie(){
  const grille = document.getElementById('tb-galerie3d');
  if (!grille || grille.dataset.pret) return;
  grille.dataset.pret = '1'; grille.classList.add('tbg-actif');
  const reduit = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cartes = [...grille.querySelectorAll('.tbg-carte')].map(el => ({ el, c: CREATIONS.find(c => c.id === el.dataset.id), scene: el.querySelector('.tbg-scene') })).filter(x => x.c);
  const canvas = document.createElement('canvas'); canvas.className = 'tbg-canvas'; canvas.setAttribute('aria-hidden', 'true');
  grille.appendChild(canvas);
  const defs = {};                                   // modèles déjà téléchargés (servent aussi à la vue en grand)
  let THREE = null, renderer = null, A = null, visible = false, raf = 0, dernier = 0, horloge = 0, lance = false;
  const lisse = (x, y, k, dt) => x + (y - x) * (1 - Math.exp(-k * dt));

  function lumieres(scene){
    const l1 = new THREE.DirectionalLight(0xfff0d8, 1.9); l1.position.set(3, 4, 6);
    const l2 = new THREE.DirectionalLight(0xffdca0, 1.2); l2.position.set(-5, 2, -3);
    scene.add(l1, l2, new THREE.HemisphereLight(0x4a3a24, 0x050505, 0.15));
  }
  // une création prête à afficher : racine > inclinaison > lacet > modèle (rayon ramené à 1)
  function monter(fab, def, c){
    const m = fab.fabriquer(def);
    const racine = new THREE.Group(), inclin = new THREE.Group(), lacet = new THREE.Group();
    racine.add(inclin); inclin.add(lacet); lacet.add(m.modele);
    const o = { c, m, racine, inclin, lacet, az: def.az || 0, el: Math.min(0.32, Math.max(0.08, def.el === undefined ? 0.2 : def.el)),
                p: -1, prog: 0, t: Math.random() * 20, porte: 0, porteCible: 0, yawMain: 0, pitchMain: 0 };
    return o;
  }
  // état d'une création à l'avancement p (0 → 1 : traits pièce par pièce, puis volumes)
  function poser(o, p, op, dt, hi){
    if (o.p !== p){ o.p = p; o.m.prog.forEach(x => { x.uniforms.uProg.value = p; }); if (o.m.poser) o.m.poser(p, 1); }
    const cycle = ((horloge + o.t) % 12) / 12;
    o.m.mats.forEach(x => { x.uniforms.uOp.value = op * (x.userData.dim === undefined ? 1 : x.userData.dim); x.uniforms.uHi.value = hi; x.uniforms.uSweep.value = -1.6 + cycle * 6; });
    (o.m.metal || []).forEach(x => {
      x.envMapIntensity = x.userData.env0 * (0.9 + 0.6 * hi);
      const op0 = x.userData.op0 === undefined ? 1 : x.userData.op0;
      x.opacity = op0 * (x.userData.fill === undefined ? 1 : x.userData.fill) * op; x.transparent = x.opacity < 0.999;
    });
    o.porte = reduit ? o.porteCible : lisse(o.porte, o.porteCible, 1.1, dt);
    Object.values(o.m.pivots || {}).forEach(pv => { pv.g.rotation.y = pv.sens * THREE.MathUtils.degToRad(pv.max) * o.porte; });
    const zoom = o.m.cadrage ? o.m.cadrage(p) : 1;
    o.racine.scale.setScalar(zoom / (o.m.R || 1));
    const plat = o.c.id === 'portail' || o.c.id === 'verriere';     // ouvrages plats : balancement doux, jamais vus par la tranche
    const w = o.t * (2 * Math.PI / (o.c.periode || 48));
    o.lacet.rotation.y = -o.az + o.yawMain + (reduit ? 0 : plat ? 0.6 * Math.sin(w) : w);
    o.inclin.rotation.x = o.el + o.pitchMain;
  }

  function demarrer3D(){
    if (lance) return; lance = true;
    import(URL_THREE).then(T => {
      THREE = T;
      try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
      catch (e) { grille.classList.add('tbg-sans3d'); return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0); renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.autoClear = false;
      A = atelier(THREE, renderer);
      cartes.forEach(k => {
        k.sc = new THREE.Scene(); lumieres(k.sc);
        k.cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50); k.cam.position.set(0, 0, 1.12 / Math.sin(THREE.MathUtils.degToRad(15)));
      });
      // téléchargement : trois fichiers à la fois, dans l'ordre de la grille
      const file = cartes.slice();
      const ouvrier = async () => {
        while (file.length){
          const k = file.shift();
          try {
            const def = defs[k.c.fichier] || (defs[k.c.fichier] = await chargerDef(k.c.fichier));
            k.o = monter(A, def, k.c); k.sc.add(k.o.racine); k.el.classList.add('tbg-chargee');
          } catch (e) { console.error('galerie', k.c.fichier, e); k.el.classList.add('tbg-erreur'); }
        }
      };
      ouvrier(); ouvrier(); ouvrier();
      relancer();
    }).catch(() => grille.classList.add('tbg-sans3d'));
  }

  function relancer(){ if (!raf && renderer && visible && !document.hidden){ dernier = performance.now(); raf = requestAnimationFrame(image); } }
  function image(now){
    raf = 0;
    const dt = Math.max(0, Math.min(0.05, (now - dernier) / 1000)); dernier = now; horloge += dt;
    if (document.getElementById('tb-entree') || vue.ouverte){ raf = requestAnimationFrame(image); return; }   // l'intro ou la vue en grand passe devant
    const g = grille.getBoundingClientRect(), H = Math.min(innerHeight, g.height), W = g.width;
    const ty = Math.max(0, Math.min(g.height - H, -g.top));          // la toile suit la partie visible de la grille
    if (canvas._w !== W || canvas._h !== H){ canvas._w = W; canvas._h = H; renderer.setSize(W, H, false); canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; }
    canvas.style.transform = `translateY(${ty}px)`;
    renderer.setScissorTest(false); renderer.clear();
    renderer.setScissorTest(true);
    cartes.forEach((k, i) => {
      if (!k.o) return;
      const r = k.scene.getBoundingClientRect();
      const x = r.left - g.left, y = r.top - g.top - ty;
      const vu = r.bottom > 0 && r.top < innerHeight;
      // le dessin démarre quand la carte arrive vraiment à l'écran, en léger décalé d'une carte à l'autre
      if (k.debut === undefined && r.top < innerHeight * 0.85 && r.bottom > innerHeight * 0.1) k.debut = horloge + (i % 3) * 0.25;
      if (k.debut !== undefined) k.o.prog = reduit ? 1 : Math.min(1, Math.max(0, (horloge - k.debut) / 6.5));
      if (!reduit) k.o.t += dt;
      k.survol = lisse(k.survol || 0, k.el.matches(':hover, :focus-visible') ? 1 : 0, 6, dt);
      if (!vu || y > H || y + r.height < 0) return;
      poser(k.o, k.o.prog, 1, dt, k.survol);
      const vy = H - y - r.height;
      renderer.setViewport(x, vy, r.width, r.height); renderer.setScissor(x, vy, r.width, r.height);
      k.cam.aspect = r.width / r.height; k.cam.updateProjectionMatrix();
      renderer.render(k.sc, k.cam);
    });
    raf = requestAnimationFrame(image);
  }

  /* ---------- vue en grand : la création se reconstruit ---------- */
  const vue = { ouverte: false };
  function creerVue(){
    const d = document.createElement('div');
    d.id = 'tbg-vue'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-label', 'Création en 3D');
    d.innerHTML = `<canvas class="tbg-vue-canvas"></canvas>
      <button type="button" class="tbg-vue-x" aria-label="Fermer">×</button>
      <div class="tbg-vue-panneau"><h3></h3><p>Glisser pour tourner</p>
        <div class="tbg-vue-actions">
          <button type="button" data-a="portes" hidden></button>
          <button type="button" data-a="rejouer">Reconstruire</button>
          <button type="button" data-a="reinit">Réinitialiser</button>
          <button type="button" data-a="fermer">Fermer</button>
        </div></div>`;
    document.body.appendChild(d);
    vue.d = d; vue.canvas = d.querySelector('canvas'); vue.titre = d.querySelector('h3'); vue.portes = d.querySelector('[data-a="portes"]');
    vue.r = new THREE.WebGLRenderer({ canvas: vue.canvas, antialias: true, alpha: true });
    vue.r.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); vue.r.setClearColor(0x000000, 0); vue.r.outputColorSpace = THREE.SRGBColorSpace;
    vue.A = atelier(THREE, vue.r);
    vue.sc = new THREE.Scene(); lumieres(vue.sc);
    vue.cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    d.querySelector('.tbg-vue-x').addEventListener('click', fermerVue);
    d.querySelector('.tbg-vue-actions').addEventListener('click', e => {
      const b = e.target.closest('[data-a]'); if (!b || !vue.o) return;
      const a = b.dataset.a;
      if (a === 'fermer') fermerVue();
      else if (a === 'rejouer'){ vue.o.prog = 0; vue.o.porteCible = 0; vue.o.porte = 0; }
      else if (a === 'reinit'){ vue.o.yawMain = 0; vue.o.pitchMain = 0; vue.o.porteCible = 0; }
      else if (a === 'portes') vue.o.porteCible = vue.o.porteCible > 0.05 ? 0 : 1;
    });
    let appui = null;
    vue.canvas.addEventListener('pointerdown', e => { appui = { x: e.clientX, y: e.clientY }; vue.canvas.setPointerCapture(e.pointerId); });
    vue.canvas.addEventListener('pointermove', e => {
      if (!appui || !vue.o) return;
      vue.o.yawMain += (e.clientX - appui.x) * 0.01; vue.o.pitchMain = Math.max(-0.35, Math.min(0.6, vue.o.pitchMain + (e.clientY - appui.y) * 0.006));
      appui.x = e.clientX; appui.y = e.clientY;
    });
    const fin = () => { appui = null; };
    vue.canvas.addEventListener('pointerup', fin); vue.canvas.addEventListener('pointercancel', fin);
    d.addEventListener('keydown', e => { if (e.key === 'Escape') fermerVue(); });
  }
  function ouvrirVue(k){
    if (!THREE || !defs[k.c.fichier]) return;
    if (!vue.d) creerVue();
    if (vue.o){ vue.sc.remove(vue.o.racine); jeter(vue.o.racine); }
    vue.o = monter(vue.A, defs[k.c.fichier], k.c); vue.o.prog = reduit ? 1 : 0; vue.o.t = 0;
    vue.sc.add(vue.o.racine);
    vue.titre.textContent = k.c.nom;
    const portes = k.c.id === 'portail' ? 'Ouvrir / fermer le portail' : k.c.id === 'verriere' ? 'Ouvrir / fermer les ouvrants' : '';
    vue.portes.hidden = !portes; vue.portes.textContent = portes;
    vue.ouverte = true; vue.retour = k.el; vue.debord = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    vue.d.classList.add('tbg-vue-ouverte');
    vue.d.querySelector('.tbg-vue-x').focus({ preventScroll: true });
    vue.dernier = performance.now(); requestAnimationFrame(imageVue);
  }
  function fermerVue(){
    if (!vue.ouverte) return;
    vue.ouverte = false; vue.d.classList.remove('tbg-vue-ouverte');
    document.body.style.overflow = vue.debord || '';
    if (vue.retour) vue.retour.focus({ preventScroll: true });
    relancer();
  }
  function jeter(g){ g.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material) (Array.isArray(x.material) ? x.material : [x.material]).forEach(m => m.dispose()); }); }
  function imageVue(now){
    if (!vue.ouverte) return;
    const dt = Math.max(0, Math.min(0.05, (now - vue.dernier) / 1000)); vue.dernier = now; horloge += dt;
    const W = innerWidth, H = innerHeight;
    if (vue.canvas._w !== W || vue.canvas._h !== H){ vue.canvas._w = W; vue.canvas._h = H; vue.r.setSize(W, H, false); vue.cam.aspect = W / H; vue.cam.updateProjectionMatrix(); }
    // la création occupe le centre de l'écran, au-dessus du panneau de commandes
    const taille = Math.min(W * 0.42, H * 0.34), dist = 20;
    vue.cam.position.set(0, -H * 0.045 * (2 * dist * Math.tan(THREE.MathUtils.degToRad(15)) / H), dist);
    const o = vue.o;
    if (!reduit){ o.prog = Math.min(1, o.prog + dt / 9); o.t += dt * 0.5; }
    poser(o, o.prog, 1, dt, 1);
    o.racine.scale.multiplyScalar(taille * (2 * dist * Math.tan(THREE.MathUtils.degToRad(15)) / H));
    vue.r.render(vue.sc, vue.cam);
    requestAnimationFrame(imageVue);
  }

  cartes.forEach(k => k.el.addEventListener('click', () => { if (k.o) ouvrirVue(k); }));
  // la 3D ne se charge qu'à l'approche de la section
  if ('IntersectionObserver' in window){
    new IntersectionObserver(es => {
      es.forEach(e => { visible = e.isIntersecting; if (visible){ demarrer3D(); relancer(); } });
    }, { rootMargin: '400px 0px' }).observe(grille);
  } else { visible = true; demarrer3D(); }
  document.addEventListener('visibilitychange', relancer);
}

// « Revoir l'introduction 3D » : relance l'écran d'entrée sans recharger la page
window.tbRevoirIntro = function(){
  if (document.getElementById('tb-entree')) return;
  RACINE.classList.add('tb-intro'); demarrer();
};
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('[data-tb-revoir]');
  if (!a) return;
  e.preventDefault(); window.tbRevoirIntro();
});

if (RACINE.classList.contains('tb-intro')) demarrer();
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', galerie); else galerie();
