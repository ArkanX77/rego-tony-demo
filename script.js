const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
  }));
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
const form = document.querySelector('#quote-form');
if (form) form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent('Demande de devis depuis le site REGO Tony');
  const body = encodeURIComponent(
    `Bonjour,\n\nJe souhaite être recontacté(e) au sujet d'un projet.\n\nNom : ${data.get('name')}\nTéléphone : ${data.get('phone')}\nType de travaux : ${data.get('service')}\n\nDescription du projet :\n${data.get('message')}\n\nCordialement.`
  );
  const status = form.querySelector('.form-status');
  if (status) status.textContent = 'Ouverture de votre messagerie…';
  window.location.href = `mailto:regotony@orange.fr?subject=${subject}&body=${body}`;
});
