# Site vitrine : Entreprise REGO Tony Père & Fils

HTML, CSS et JavaScript natifs. Compatible GitHub Pages. Aucun service payant.

## Mise en ligne (sans toucher à l'existant avant votre accord)
1. Dans le dépôt GitHub, remplacer `index.html`, `style.css`, `script.js` et ajouter le dossier `images/` (et `outils/`, facultatif).
2. Valider (Commit changes) : GitHub Pages publie automatiquement.

## Ajouter les vraies photos (étape indispensable)
Aucune photo n'est fournie : celles de l'entreprise n'étaient pas accessibles automatiquement.
La galerie masque les emplacements vides ; sans photo, elle affiche un message d'attente.

- Image d'en-tête : `images/hero.jpg` (paysage, idéalement 1920 × 1080).
- Galerie : `images/realisations/` avec les noms `couverture-01.jpg` … `renovation-03.jpg`
  (liste complète dans `script.js`, tableau `GALLERY`). Adaptez les textes `alt` à chaque photo.
- Voir les emplacements vides : ajouter `?apercu=1` à l'adresse du site.
- Raccourci : `python3 outils/preparer_photos.py MON_DOSSIER` redimensionne et renomme vos photos
  (préfixes `couverture_`, `maconnerie_`, `carrelage_`, `renovation_`, `hero_`). Nécessite Pillow.

Utilisez uniquement des photos de l'entreprise ou autorisées par elle.

## Formulaire
Envoi via FormSubmit (gratuit, sans compte) vers regotony@orange.fr.
**Au premier envoi**, FormSubmit envoie un e-mail d'activation à cette adresse : cliquer sur le lien une fois.
En cas d'échec, le site propose un lien `mailto:` prérempli (qui ouvre la messagerie, sans envoi direct).

## À valider avec l'entreprise
- « 35 ans d'expérience » (annoncé publiquement, non confirmé ici).
- Adresse : 3 allée des Peupliers (certains annuaires indiquent aussi 43 bis rue Grande).
- Liens Google (avis, carte) et Facebook ; logo officiel à intégrer si souhaité.
