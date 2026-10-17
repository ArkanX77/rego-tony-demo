#!/usr/bin/env python3
"""Prépare les vraies photos de chantier pour le site (redimensionne, compresse, renomme).

Utilisation (à lancer sur votre ordinateur, nécessite Python et Pillow : pip install pillow) :

    python3 outils/preparer_photos.py MON_DOSSIER_DE_PHOTOS

Les photos sont triées par nom de fichier. Pour choisir la catégorie, préfixez le nom :
    couverture_xxx.jpg, maconnerie_xxx.jpg, carrelage_xxx.jpg, renovation_xxx.jpg
La première photo "couverture" (ou n'importe laquelle avec le préfixe hero_) sert d'image d'en-tête.
Résultat : images/realisations/couverture-01.jpg ... et images/hero.jpg
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

CATS = ("couverture", "maconnerie", "carrelage", "renovation")
RACINE = Path(__file__).resolve().parent.parent


def sauver(src, dest, largeur, hauteur=None, qualite=80):
    img = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    if hauteur:
        img = ImageOps.fit(img, (largeur, hauteur), Image.LANCZOS)
    else:
        img.thumbnail((largeur, largeur * 2), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "JPEG", quality=qualite, optimize=True, progressive=True)
    print(f"  {dest.relative_to(RACINE)}  ({dest.stat().st_size // 1024} Ko)")


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    dossier = Path(sys.argv[1])
    fichiers = sorted(p for p in dossier.iterdir() if p.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"))
    compteurs = {c: 0 for c in CATS}
    for p in fichiers:
        nom = p.stem.lower()
        if nom.startswith("hero"):
            sauver(p, RACINE / "images" / "hero.jpg", 1920, 1080, 78)
            continue
        cat = next((c for c in CATS if nom.startswith(c)), None)
        if not cat:
            print(f"  ignorée (préfixe inconnu) : {p.name}")
            continue
        compteurs[cat] += 1
        n = compteurs[cat]
        if n > 3:
            print(f"  ignorée (3 photos max par catégorie dans la galerie) : {p.name}")
            continue
        sauver(p, RACINE / "images" / "realisations" / f"{cat}-{n:02d}.jpg", 1200, 900, 80)
        if cat == "couverture" and n == 1 and not (RACINE / "images" / "hero.jpg").exists():
            sauver(p, RACINE / "images" / "hero.jpg", 1920, 1080, 78)


if __name__ == "__main__":
    main()
