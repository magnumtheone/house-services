---
name: creation-article
description: "Créer et publier un article de blog pour House Service S.A.S. Utiliser pour rédiger un article en français, produire une page HTML SEO, ajouter un article au blog, mettre à jour l'accueil ou le sitemap, et vérifier les liens, images et métadonnées avant publication."
argument-hint: "Sujet, public cible, mots-clés et objectif de l'article"
user-invocable: true
disable-model-invocation: false
---

# Création d'article House Service

## Objectif

Créer un article de blog complet, utile et publiable dans le site statique House Service S.A.S. Le résultat doit respecter le ton professionnel du site, ses conventions HTML et son arborescence.

## Quand utiliser cette skill

- L'utilisateur demande de créer, rédiger ou publier un article de blog.
- L'utilisateur demande un article SEO en français pour House Service S.A.S.
- L'utilisateur veut ajouter une nouvelle publication dans `pages/blog/`.
- L'utilisateur veut transformer un sujet, un brouillon ou des notes en page HTML.

## Informations à obtenir

Si elles ne sont pas fournies, demander uniquement les informations indispensables :

- sujet et angle éditorial ;
- public cible ;
- objectif principal et appel à l'action ;
- mots-clés principaux et secondaires ;
- ville ou zone géographique concernée, si pertinent ;
- date de publication et catégorie ;
- image disponible ou besoin d'en sélectionner une dans `images/`.

Si le contexte permet de déduire une valeur raisonnable, la déduire et la signaler brièvement plutôt que bloquer la création.

## Procédure

1. Lire `pages/blog/article-template.html` et au moins un article publié proche du sujet avant toute modification.
2. Rechercher le nom de fichier, le slug, les mots-clés et les images déjà utilisés pour éviter les doublons.
3. Définir un slug ASCII en minuscules avec des tirets, sans accents ni caractères spéciaux.
4. Rédiger un titre précis et naturel, une introduction utile, des sections hiérarchisées avec `h2` et `h3`, des paragraphes courts, des listes lorsque cela facilite la lecture, une conclusion et un CTA cohérent avec House Service.
5. Préparer les métadonnées :
   - `<title>` clair, idéalement inférieur à environ 60 caractères avant la marque ;
   - `meta description` unique, descriptive et proche de 150 à 160 caractères ;
   - mots-clés réellement présents dans le contenu ;
   - `canonical` correspondant à l'URL publique réelle ;
   - titre visible et attribut `alt` descriptif pour l'image principale.
6. Créer `pages/blog/<slug>.html` à partir du template. Conserver les liens CDN, les classes existantes, le header, le footer et le comportement du menu, sauf nécessité explicite.
7. Adapter les chemins relatifs au fait que la page est dans `pages/blog/` : les liens vers la racine utilisent `../../`, les liens vers `pages/` utilisent `../`, et les images utilisent `../../images/`.
8. Utiliser seulement les composants éditoriaux existants, notamment `.highlight-box`, `.tip-box`, `.article-footer` et `.article-nav`. Ne pas introduire de nouvelle dépendance ou de style global sans nécessité.
9. Mettre à jour la section Blog de `index.html` si l'article doit apparaître sur l'accueil. Vérifier simultanément le lien, le titre, la catégorie, l'image, l'attribut `alt` et les dimensions de l'image.
10. Ajouter l'URL dans `sitemap.xml` si les autres articles y sont référencés, en respectant son format et la date disponible.
11. Vérifier toutes les références avec une recherche ciblée : placeholders restants (`[TITRE`, `[IMAGE`, `[CATÉGORIE`, etc.), liens cassés évidents, image inexistante, canonical incohérent, doublon de slug et erreurs HTML manifestes.
12. Exécuter le contrôle disponible dans le projet. Pour un site statique, utiliser au minimum une recherche des placeholders et des chemins, puis vérifier les diagnostics du fichier modifié. Ne pas signaler une validation comme réussie si aucun contrôle n'a pu être exécuté.

## Règles éditoriales

- Écrire en français correct, accessible et professionnel.
- Adapter le contenu à la RDC et aux réalités locales lorsqu'elles sont pertinentes ; ne pas inventer de chiffres, partenaires, certifications ou résultats.
- Apporter des conseils concrets avant de présenter House Service.
- Employer un ton fiable, humain et orienté service, sans promesse absolue ni formulation trompeuse.
- Prévoir un CTA final vers une page existante, généralement `../devis.html` ou l'accueil, selon le sujet.
- Ne pas bourrer le texte de mots-clés. Le mot-clé principal doit apparaître naturellement dans le titre, l'introduction, au moins un intertitre et la conclusion lorsque cela reste pertinent.
- Utiliser des entités HTML uniquement lorsque nécessaire et conserver l'encodage UTF-8 du document.

## Contrôle avant livraison

Confirmer que :

- le fichier est bien dans `pages/blog/` et son slug est unique ;
- le titre, la description, le canonical, la catégorie et la date sont cohérents ;
- l'image et son `alt` existent et correspondent au sujet ;
- aucun placeholder du template ne subsiste ;
- les liens relatifs fonctionnent depuis `pages/blog/` ;
- l'accueil et le sitemap sont synchronisés lorsque requis ;
- le rendu mobile reste couvert par les styles existants ;
- le contrôle exécuté ne révèle pas de nouvelle erreur pertinente.

## Sortie attendue

Résumer brièvement :

- le fichier d'article créé ou modifié ;
- les fichiers d'intégration mis à jour ;
- le slug, la catégorie et l'image retenus ;
- les validations exécutées et leurs résultats ;
- les informations qui restent à fournir, le cas échéant.
