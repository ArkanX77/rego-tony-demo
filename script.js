/* REGO Tony Père & Fils : JavaScript natif, sans dépendance */
(function () {
  'use strict';

  var EMAIL = 'regotony@orange.fr';

  /* ---------- Galerie ----------
     Déposez vos vraies photos dans images/realisations/ avec ces noms.
     Les fichiers absents sont simplement masqués (ajoutez ?apercu=1 à l'adresse
     du site pour voir l'emplacement de chaque photo manquante).
     Pensez à adapter les textes "alt" pour décrire chaque photo. */
  var GALLERY = [
    { file: 'couverture-01', cat: 'toiture',    label: 'Couverture',   alt: 'Chantier de couverture réalisé par REGO Tony' },
    { file: 'couverture-02', cat: 'toiture',    label: 'Couverture',   alt: 'Toiture rénovée par REGO Tony' },
    { file: 'couverture-03', cat: 'toiture',    label: 'Charpente',    alt: 'Charpente et toiture, chantier REGO Tony' },
    { file: 'maconnerie-01', cat: 'maconnerie', label: 'Maçonnerie',   alt: 'Travaux de maçonnerie réalisés par REGO Tony' },
    { file: 'maconnerie-02', cat: 'maconnerie', label: 'Maçonnerie',   alt: 'Ouvrage en maçonnerie, REGO Tony' },
    { file: 'maconnerie-03', cat: 'maconnerie', label: 'Maçonnerie',   alt: 'Mur et aménagement extérieur, REGO Tony' },
    { file: 'carrelage-01',  cat: 'carrelage',  label: 'Carrelage',    alt: 'Pose de carrelage par REGO Tony' },
    { file: 'carrelage-02',  cat: 'carrelage',  label: 'Faïence',      alt: 'Faïence posée par REGO Tony' },
    { file: 'carrelage-03',  cat: 'carrelage',  label: 'Carrelage',    alt: 'Sol carrelé, réalisation REGO Tony' },
    { file: 'renovation-01', cat: 'renovation', label: 'Façade',       alt: 'Rénovation de façade par REGO Tony' },
    { file: 'renovation-02', cat: 'renovation', label: 'Escalier',     alt: 'Escalier réalisé par REGO Tony' },
    { file: 'renovation-03', cat: 'renovation', label: 'Rénovation',   alt: 'Rénovation de maison, REGO Tony' }
  ];

  var preview = /[?&]apercu=1/.test(location.search);
  var gallery = document.getElementById('gallery');
  var empty = document.getElementById('gallery-empty');
  var filters = document.getElementById('filters');
  var shots = [];
  var loaded = 0, settled = 0;

  function settle() {
    settled++;
    if (settled === GALLERY.length) {
      if (loaded === 0 && !preview) { empty.hidden = false; filters.hidden = true; }
    }
  }

  GALLERY.forEach(function (g) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'shot';
    btn.dataset.cat = g.cat;
    btn.hidden = true;
    var img = new Image();
    img.alt = g.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    var tag = document.createElement('span');
    tag.textContent = g.label;
    btn.appendChild(img);
    btn.appendChild(tag);
    gallery.appendChild(btn);

    img.onload = function () {
      loaded++; btn.hidden = false; btn._ok = true; shots.push(btn); settle();
    };
    img.onerror = function () {
      if (preview) {
        img.onerror = null;
        img.src = 'images/placeholder.svg';
        img.alt = 'Emplacement de photo : ' + g.file + '.jpg';
        btn.classList.add('is-placeholder');
        btn.hidden = false; btn._ok = false; shots.push(btn);
      } else { btn.remove(); }
      settle();
    };
    img.src = 'images/realisations/' + g.file + '.jpg';
    btn.addEventListener('click', function () { if (btn._ok) openBox(btn); });
  });

  /* Filtres */
  filters.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    var f = chip.dataset.filter;
    filters.querySelectorAll('.chip').forEach(function (c) {
      var on = c === chip;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', on);
    });
    gallery.querySelectorAll('.shot').forEach(function (s) {
      var show = (f === 'all' || s.dataset.cat === f);
      s.style.display = show ? '' : 'none';
    });
  });

  /* Lightbox */
  var box = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var current = null;

  function visibleShots() {
    return Array.prototype.filter.call(gallery.querySelectorAll('.shot'), function (s) {
      return s._ok && s.style.display !== 'none';
    });
  }
  function openBox(btn) {
    current = btn;
    var img = btn.querySelector('img');
    lbImg.src = img.src; lbImg.alt = img.alt;
    lbCap.textContent = img.alt;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    box.querySelector('.lb-close').focus();
  }
  function closeBox() { box.hidden = true; document.body.style.overflow = ''; if (current) current.focus(); }
  function step(d) {
    var list = visibleShots();
    if (!list.length) return;
    var i = (list.indexOf(current) + d + list.length) % list.length;
    openBox(list[i]);
  }
  box.querySelector('.lb-close').addEventListener('click', closeBox);
  box.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
  box.querySelector('.lb-next').addEventListener('click', function () { step(1); });
  box.addEventListener('click', function (e) { if (e.target === box) closeBox(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') closeBox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  var tx = null;
  box.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    tx = null;
  });

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('menu');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  /* Les cartes de métiers préremplissent le formulaire */
  document.querySelectorAll('[data-sujet]').forEach(function (a) {
    a.addEventListener('click', function () {
      document.getElementById('sujet').value = a.dataset.sujet;
    });
  });

  document.getElementById('annee').textContent = new Date().getFullYear();

  /* ---------- Formulaire ----------
     Envoi par FormSubmit (gratuit, sans compte) vers l'adresse de l'entreprise.
     Au tout premier envoi, FormSubmit envoie un e-mail d'activation à
     regotony@orange.fr : il faut cliquer dessus une fois.
     Si l'envoi échoue, un lien "mailto:" prérempli est proposé en secours. */
  var form = document.getElementById('form');
  var status = document.getElementById('form-status');

  function setStatus(msg, cls, html) {
    status.className = 'form-status ' + (cls || '');
    if (html) status.innerHTML = msg; else status.textContent = msg;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      var bad = !f.value.trim();
      f.classList.toggle('is-bad', bad);
      if (bad) ok = false;
    });
    if (!ok) { setStatus('Merci de remplir les champs obligatoires (*).', 'err'); return; }

    var data = new FormData(form);
    if (data.get('_honey')) return; /* anti-robot */
    data.append('_subject', 'Demande de devis (site web) : ' + data.get('sujet'));
    data.append('_captcha', 'false');
    data.append('_template', 'table');

    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true; setStatus('Envoi en cours…', '');

    fetch('https://formsubmit.co/ajax/' + EMAIL, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function () {
        form.reset();
        setStatus('Merci ! Votre demande a bien été envoyée. Nous vous recontactons rapidement.', 'ok');
      })
      .catch(function () {
        var body = 'Nom : ' + data.get('nom') + '\nTéléphone : ' + data.get('telephone') +
          '\nE-mail : ' + (data.get('email') || '') + '\nTravaux : ' + data.get('sujet') + '\n\n' + data.get('message');
        var href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Demande de devis : ' + data.get('sujet')) +
          '&body=' + encodeURIComponent(body);
        setStatus('L\'envoi automatique a échoué. <a href="' + href + '">Envoyer par e-mail</a> ou appelez le 06 76 34 26 94.', 'err', true);
      })
      .finally(function () { btn.disabled = false; });
  });
})();
