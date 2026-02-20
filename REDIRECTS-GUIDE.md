# 🔄 Guide des Redirects 301 - House Service S.A.S

## Résumé des Redirects
Tous les anciens domaines redirigent vers le nouveau:
```
https://www.houseservice.com → https://house-servicerdc.com
https://houseservice.cd → https://house-servicerdc.com
https://house-service.cd → https://house-servicerdc.com
```

---

## Option 1: Apache (.htaccess) ⭐ RECOMMANDÉ

**Fichier:** `.htaccess` (à la racine du site)

### Avantages:
✅ Fonctionne sur tous les serveurs Apache
✅ Configuration directe sur le serveur
✅ Supporte aussi la compression GZIP et le caching

### Configuration:
```apache
RewriteCond %{HTTP_HOST} ^(www\.)?houseservice\.com$ [NC]
RewriteRule ^(.*)$ https://house-servicerdc.com/$1 [L,R=301]

RewriteCond %{HTTP_HOST} ^(www\.)?houseservice\.cd$ [NC]
RewriteRule ^(.*)$ https://house-servicerdc.com/$1 [L,R=301]
```

### Installation:
1. Téléchargez le fichier `.htaccess` depuis le root du projet
2. Uploadez-le sur le serveur via FTP/SFTP dans le répertoire racine
3. Assurez-vous que `mod_rewrite` est activé (contact host si problème)
4. Testez avec: `curl -I https://www.houseservice.com/`
   → Devrait retourner `301 Moved Permanently`

---

## Option 2: Cloudflare Worker ⭐ MODERNE

**Fichier:** `cloudflare-worker/src/worker.js`

### Avantages:
✅ Sans serveur (serverless)
✅ Très rapide (edge computing)
✅ Gère aussi l'API Gemini du chatbot
✅ Gratuit avec Cloudflare Free Plan

### Configuration:
```javascript
const REDIRECT_MAPPINGS = {
    'houseservice.com': 'https://house-servicerdc.com',
    'www.houseservice.com': 'https://house-servicerdc.com',
    'houseservice.cd': 'https://house-servicerdc.com',
    'www.houseservice.cd': 'https://house-servicerdc.com',
    'house-service.cd': 'https://house-servicerdc.com',
    'www.house-service.cd': 'https://house-servicerdc.com'
};
```

### Installation:
1. Installez Wrangler: `npm install -g wrangler`
2. Authentifiez-vous: `wrangler login`
3. Déployez: `cd cloudflare-worker && wrangler deploy`
4. Testez: `curl -I https://www.houseservice.com/`

### Mise à jour des variables d'environnement:
```bash
wrangler secret put GEMINI_API_KEY
# Entrez votre clé API Gemini
```

---

## Option 3: Netlify / Vercel

**Fichier:** `_redirects` (Netlify)

### Configuration:
```
https://houseservice.com/*  https://house-servicerdc.com/:splat  301!
https://www.houseservice.com/*  https://house-servicerdc.com/:splat  301!
https://houseservice.cd/*  https://house-servicerdc.com/:splat  301!
https://www.houseservice.cd/*  https://house-servicerdc.com/:splat  301!
```

### Installation (Netlify):
1. Uploadez le fichier `_redirects` à la racine statique
2. Redéployez le site
3. Les redirects s'appliquent automatiquement

---

## Option 4: Nginx

**Fichier:** Configuration Nginx

```nginx
# Redirection depuis ancien domaine
server {
    listen 80;
    listen 443 ssl;
    server_name houseservice.com www.houseservice.com 
                houseservice.cd www.houseservice.cd
                house-service.cd www.house-service.cd;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    return 301 https://house-servicerdc.com$request_uri;
}
```

### Installation:
1. Editez votre config Nginx
2. Rechargez: `sudo systemctl reload nginx`
3. Testez: `curl -I https://www.houseservice.com/`

---

## 🧪 Tester les Redirects

### Via cURL (Linux/Mac):
```bash
# Test simple
curl -I https://www.houseservice.com/

# Doit retourner:
# HTTP/1.1 301 Moved Permanently
# Location: https://house-servicerdc.com/
```

### Via PowerShell (Windows):
```powershell
# Test simple
(Invoke-WebRequest https://www.houseservice.com -MaximumRedirection 0).StatusCode

# Doit retourner: 301
```

### Outils en ligne:
- **HTTP Status Code Checker:** https://www.seobility.net/en/tools/check-redirect/
- **Redirect Checker:** https://www.whatsmydns.net/
- **Google Search Console:** Tester la couverture d'URL

---

## ✅ Checklist de Déploiement

- [ ] Mettre en place une des options ci-dessus (Apache, Cloudflare, Netlify, Nginx)
- [ ] Tester les redirects avec cURL ou outils en ligne
- [ ] Vérifier que `301` est retourné (pas `302` ou `307`)
- [ ] Ajouter les anciens domaines dans Google Search Console
- [ ] Signaler le changement d'adresse dans GSC
- [ ] Mettre à jour les backlinks pointant vers l'ancien domaine (CMS, annuaires, etc.)
- [ ] Notifier Google Analytics du changement
- [ ] Surveiller les erreurs 404 dans GSC pendant 1-2 mois
- [ ] Mettre à jour les mentions de domaine sur les réseaux sociaux

---

## 📊 Timeline Attendue

| Période | Événement |
|---------|-----------|
| **Jour 0** | Deploy des redirects 301 |
| **Jour 1-7** | Google crawle les redirects |
| **Jour 7-30** | URL anciennes disparaissent progressivement des SERPs |
| **Mois 2-6** | Migration complète de l'autorité de domaine |

---

## ⚠️ Erreurs Courantes à Éviter

❌ **Ne PAS utiliser 302 (redirection temporaire)**
→ Cela ne passe pas l'autorité SEO et confond Google

❌ **Ne PAS rediriger vers une page d'accueil générique**
→ Rediriger `/pages/services.html` → `/pages/services.html` sur le nouveau domaine

❌ **Ne PAS oublier le HTTPS**
→ Toujours utiliser `https://` pour les redirects

❌ **Ne PAS créer une boucle de redirection**
→ `A → B → A` confond les moteurs de recherche

---

## 📝 Notes Importantes

1. **Timing:** Deployez les redirects AVANT de supprimer les anciens domaines
2. **Maintenance:** Gardez les redirects en place pendant au moins 6-12 mois
3. **Analytics:** Les anciennes URLs peuvent continuer à apparaître dans GA pendant un temps
4. **Backlinks:** Chaque ancien lien garde son autorité via la redirection 301

---

## 🆘 Besoin d'Aide?

- **Erreur 404 au lieu de redirection?** → Vérifier que mod_rewrite est activé
- **Redirection vers mauvaise URL?** → Vérifier la variable %{REQUEST_URI}
- **Cloudflare ne redirige pas?** → Vérifier que le Worker est en zone)
- **Google ne reconnaît pas la redirection?** → Attendre 1-2 semaines ou forcer l'indexation via GSC

---

**Mise à jour:** 20 février 2026
**Status:** ✅ Redirects configurés et prêts à déployer
