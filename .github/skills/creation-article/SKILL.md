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

## Direction artistique de référence

S'inspirer de `pages/blog/visibilite-en-ligne-rdc.html` pour produire une page éditoriale moderne, aérée et cohérente avec House Service :

- construire un hero éditorial en haut de page, avec un fond clair discret, un badge de catégorie, un titre centré, un sous-titre facultatif, les informations d'auteur et la durée de lecture ;
- afficher une image principale large sous le hero, avec un `alt` descriptif, un recadrage maîtrisé, des coins fortement arrondis et une ombre légère ;
- conserver une colonne de lecture étroite et centrée, avec des paragraphes espacés, des intertitres `h2` visibles et des listes faciles à parcourir ;
- mettre en valeur l'introduction ou les messages importants avec une bordure latérale ou un encadré gris très clair, sans multiplier les cartes décoratives ;
- terminer par un appel à l'action clair, puis un bloc d'inscription ou de contact et un footer sobre, lorsque ces éléments sont présents dans le template ;
- privilégier la palette existante rouge House Service, gris neutre et blanc, les typographies `Inter` pour le texte et `Poppins` pour les titres, sans créer de nouvelle direction visuelle ;
- conserver les dépendances déjà utilisées par la page de référence (`styles.css`, Tailwind CDN, Font Awesome et AOS) et leurs comportements responsives ; ne pas ajouter de dépendance sans nécessité.

Le design doit servir la lecture : le titre reste dominant sans être interminable, les informations ne se chevauchent pas sur mobile et l'image, les encadrés et les formulaires restent fluides sur petits écrans.

### Règles de mise en œuvre à respecter

- examiner les dimensions et l'orientation de l'image choisie avant de définir son affichage ; pour une affiche ou une image verticale contenant du texte, conserver toute l'image avec `height: auto` et `object-fit: contain`, sans hauteur fixe qui provoquerait un recadrage ;
- utiliser `width` et `height` correspondant au ratio réel de l'image, puis prévoir uniquement une `max-height` raisonnable sur grand écran ; laisser la hauteur redevenir automatique sur mobile ;
- ne pas dupliquer l'image principale dans le contenu et ne pas répéter mot pour mot l'introduction dans le premier paragraphe ;
- si AOS est utilisé, charger `https://unpkg.com/aos@2.3.1/dist/aos.js` avant tout appel à `AOS.init()` ; vérifier également que chaque élément animé possède bien l'attribut `data-aos` attendu ;
- conserver les chemins relatifs adaptés à `pages/blog/` pour toutes les images, y compris l'image de l'auteur, et vérifier que chaque fichier référencé existe réellement ;
- lorsqu'une image principale est ajoutée ou remplacée, rechercher l'ancienne référence dans la carte correspondante de `index.html` et la remplacer par exactement la même image que dans l'article, avec un chemin, un `alt`, un titre et des dimensions cohérents ;
- pour une image verticale ou une affiche, vérifier également que le style de la carte d'accueil ne la recadre pas de façon destructive ; conserver le contenu complet ou utiliser un cadrage maîtrisé adapté à la grille.

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

1. Lire `pages/blog/article-template.html`, `pages/blog/visibilite-en-ligne-rdc.html` et au moins un article publié proche du sujet avant toute modification. Utiliser la page de référence pour la composition visuelle et le template pour les composants officiellement réutilisables.
2. Rechercher le nom de fichier, le slug, les mots-clés et les images déjà utilisés pour éviter les doublons.
3. Définir un slug ASCII en minuscules avec des tirets, sans accents ni caractères spéciaux.
4. Rédiger un titre précis et naturel, une introduction utile, des sections hiérarchisées avec `h2` et `h3`, des paragraphes courts, des listes lorsque cela facilite la lecture, une conclusion et un CTA cohérent avec House Service.
5. Préparer les métadonnées :
   - `<title>` clair, idéalement inférieur à environ 60 caractères avant la marque ;
   - `meta description` unique, descriptive et proche de 150 à 160 caractères ;
   - mots-clés réellement présents dans le contenu ;
   - `canonical` correspondant à l'URL publique réelle ;
   - titre visible et attribut `alt` descriptif pour l'image principale.
6. Créer `pages/blog/<slug>.html` à partir du template. Reproduire la composition de la page de référence : hero centré, badge, titre, sous-titre si utile, auteur, durée de lecture, image principale, colonne de contenu, encadrés, CTA et footer. Conserver les liens CDN, les classes existantes et le comportement du menu, sauf nécessité explicite. Appliquer les règles de cadrage et de chargement JavaScript ci-dessus.
7. Adapter les chemins relatifs au fait que la page est dans `pages/blog/` : les liens vers la racine utilisent `../../`, les liens vers `pages/` utilisent `../`, et les images utilisent `../../images/`.
8. Utiliser seulement les composants éditoriaux existants, notamment `.highlight-box`, `.tip-box`, `.article-footer` et `.article-nav`. Pour les pages qui suivent la référence, conserver aussi les conventions `prose`, `glass`, `text-gradient`, les encadrés gris sobres et les animations AOS déjà utilisées. Ne pas introduire de nouvelle dépendance ou de style global sans nécessité.
9. Mettre à jour la section Blog de `index.html` si l'article doit apparaître sur l'accueil. Cette synchronisation est obligatoire dès que l'image principale est ajoutée ou modifiée : reprendre exactement le même fichier image, puis vérifier le lien, le titre, la catégorie, l'attribut `alt` et les dimensions dans l'article et dans sa carte d'accueil.
10. Ajouter l'URL dans `sitemap.xml` si les autres articles y sont référencés, en respectant son format et la date disponible.
11. Vérifier toutes les références avec une recherche ciblée : placeholders restants (`[TITRE`, `[IMAGE`, `[CATÉGORIE`, etc.), liens cassés évidents, image inexistante, canonical incohérent, doublon de slug, image principale recadrée ou répétée, introduction dupliquée, ordre de chargement d'AOS et erreurs HTML manifestes.
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
- si l'image de l'article a été ajoutée ou modifiée, la carte correspondante de `index.html` utilise exactement la même image, le même `alt` et des dimensions cohérentes ;
- le hero, l'image, les métadonnées auteur, les encadrés, le formulaire et le footer restent lisibles et non chevauchants sur mobile ;
- l'image principale conserve son ratio réel, son contenu complet et des attributs `width`/`height` cohérents avec ses dimensions ;
- AOS est chargé avant `AOS.init()` lorsque les animations sont utilisées ;
- l'image principale et l'introduction ne sont pas dupliquées inutilement ;
- les classes et dépendances de la direction artistique restent cohérentes avec `visibilite-en-ligne-rdc.html` ;
- le contrôle exécuté ne révèle pas de nouvelle erreur pertinente.

## Sortie attendue

Résumer brièvement :

- le fichier d'article créé ou modifié ;
- les fichiers d'intégration mis à jour ;
- le slug, la catégorie et l'image retenus ;
- les validations exécutées et leurs résultats ;
- les informations qui restent à fournir, le cas échéant.
