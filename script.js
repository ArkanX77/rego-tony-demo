const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? '✕' : '☰';
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
  if (toggle) toggle.textContent = '☰';
}));
document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelector('#quote-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = form.get('name')?.toString().trim() || '';
  const phone = form.get('phone')?.toString().trim() || '';
  const work = form.get('work')?.toString().trim() || '';
  const message = form.get('message')?.toString().trim() || '';
  const body = `Bonjour,\\n\\nJe souhaite vous contacter pour : ${work}.\\n\\nNom : ${name}\\nTéléphone : ${phone}\\nProjet : ${message || 'À préciser'}\\n\\nCordialement.`;
  document.querySelector('#form-status').textContent = 'Votre application de messagerie va s’ouvrir avec le message préparé. Rien n’a été envoyé automatiquement.';
  // Adresse volontairement non inventée : l'utilisateur pourra la configurer après accord de l'artisan.
  const email = prompt('Pour terminer le formulaire, saisissez l’adresse e-mail professionnelle confirmée de l’entreprise :');
  if (email && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent('Demande de devis - ' + work)}&body=${encodeURIComponent(body)}`;
  } else {
    document.querySelector('#form-status').textContent = 'Aucune adresse e-mail configurée. Appelez directement l’entreprise ou ajoutez son adresse professionnelle après validation.';
  }
});
