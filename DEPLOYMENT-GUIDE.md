# 🚀 DEPLOYMENT CHECKLIST

## Avant de déployer

- [ ] Backup complet du site actuel
- [ ] Tester localement tous les liens
- [ ] Vérifier que les domaines sont propriétaires
- [ ] Avertir l'équipe de la migration

---

## OPTION 1: Apache Hosting (RECOMMANDÉ) ⭐

### Hébergeurs compatibles:
- SiteGround, Bluehost, Godaddy, OVH, etc.

### Étapes:

1. **Téléchargez `.htaccess`** depuis ce projet
2. **Via FTP/SFTP:**
   ```
   Connectez-vous → Répertoire public_html (ou www)
   → Upload .htaccess à la racine
   → Chmod 644 (permissions)
   ```

3. **Via cPanel** (si disponible):
   ```
   File Manager → Public HTML → Upload .htaccess
   ```

4. **Vérifiez mod_rewrite:**
   ```
   Allez dans: Settings → Apache Modules
   → Cherchez "mod_rewrite" (doit être coché)
   ```

5. **Testez:**
   ```bash
   curl -I https://www.houseservice.com/
   # Output doit contenir: HTTP/1.1 301
   ```

6. **Vérifiez avec outils en ligne:**
   - https://www.seobility.net/en/tools/check-redirect/

---

## OPTION 2: Cloudflare Worker (MODERNE) ⭐

### Prérequis:
- Compte Cloudflare (gratuit)
- Domaine pointant vers Cloudflare

### Étapes:

1. **Installez Wrangler:**
   ```bash
   npm install -g wrangler
   # ou
   npm install -g @cloudflare/wrangler
   ```

2. **Authentifiez-vous:**
   ```bash
   wrangler login
   # Naviguez vers Cloudflare pour autoriser
   ```

3. **Configurez votre compte:**
   ```bash
   cd cloudflare-worker
   ```

4. **Définissez la clé API Gemini:**
   ```bash
   wrangler secret put GEMINI_API_KEY
   # Collez votre clé API quand demandé
   ```

5. **Déployez:**
   ```bash
   wrangler deploy
   # Output: "Published to https://house-service-chatbot-proxy.workers.dev"
   ```

6. **Vérifiez wrangler.toml:**
   ```toml
   ALLOWED_ORIGINS = "https://house-servicerdc.com,..."
   ```

7. **Testez:**
   ```bash
   curl -I https://www.houseservice.com/
   # Output: HTTP/1.1 301 Moved Permanently
   ```

---

## OPTION 3: Netlify (_redirects)

### Prérequis:
- Site hébergé sur Netlify

### Étapes:

1. **Copiez `_redirects`** depuis ce projet

2. **Uploadez-le:**
   - Placez le fichier à la **racine statique** (public/ ou dist/)
   - Assurez-vous qu'il s'appelle exactement: `_redirects`

3. **Redéployez:**
   ```bash
   netlify deploy --prod
   # ou via Netlify UI: Site Settings → Deploys
   ```

4. **Vérifiez:**
   ```bash
   curl -I https://www.houseservice.com/
   ```

---

## OPTION 4: Vercel (_redirects)

### Même processus que Netlify, mais:

1. **Fichier `_redirects`** à la racine du public/

2. **Ou via `vercel.json`:**
   ```json
   {
     "redirects": [
       {
         "source": "/(.*)",
         "destination": "https://house-servicerdc.com/:1",
         "statusCode": 301
       }
     ]
   }
   ```

3. **Déployez:**
   ```bash
   vercel deploy --prod
   ```

---

## OPTION 5: Nginx

### Prérequis:
- Accès SSH au serveur

### Étapes:

1. **Éditez la config Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/default
   # ou /etc/nginx/nginx.conf
   ```

2. **Ajoutez ce bloc:**
   ```nginx
   server {
       listen 80;
       listen 443 ssl;
       server_name houseservice.com www.houseservice.com 
                   houseservice.cd www.houseservice.cd 
                   house-service.cd www.house-service.cd;
       
       ssl_certificate /etc/ssl/certs/cert.pem;
       ssl_certificate_key /etc/ssl/private/key.pem;
       
       return 301 https://house-servicerdc.com$request_uri;
   }
   ```

3. **Validez la syntaxe:**
   ```bash
   sudo nginx -t
   # Output: "syntax is ok", "test is successful"
   ```

4. **Redémarrez Nginx:**
   ```bash
   sudo systemctl reload nginx
   # ou: sudo service nginx reload
   ```

5. **Testez:**
   ```bash
   curl -I https://www.houseservice.com/
   ```

---

## OPTION 6: IIS (Windows Hosting)

### Via Web.config:

1. **Créez/Modifiez `web.config`:**
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <configuration>
       <system.webServer>
           <rewrite>
               <rules>
                   <rule name="Redirect Old Domain" stopProcessing="true">
                       <match url="(.*)" />
                       <conditions>
                           <add input="{HTTP_HOST}" pattern="^houseservice\.com$" />
                       </conditions>
                       <action type="Redirect" url="https://house-servicerdc.com/{R:1}" redirectType="Permanent" />
                   </rule>
               </rules>
           </rewrite>
       </system.webServer>
   </configuration>
   ```

2. **Uploadez via FTP** à la racine du site

3. **Testez:**
   ```powershell
   (Invoke-WebRequest https://www.houseservice.com -MaximumRedirection 0).StatusCode
   # Doit retourner: 301
   ```

---

## ✅ TESTS DE VALIDATION

### Test 1: Status Code
```bash
curl -I https://www.houseservice.com/

# ✅ BON:
# HTTP/1.1 301 Moved Permanently
# Location: https://house-servicerdc.com/

# ❌ MAUVAIS:
# HTTP/1.1 302 Found (temporaire, pas SEO-friendly)
# HTTP/1.1 404 Not Found (URL cassée)
```

### Test 2: URL Complète
```bash
curl -I https://www.houseservice.com/pages/devis.html

# Doit rediriger vers:
# https://house-servicerdc.com/pages/devis.html
```

### Test 3: Tous les anciens domaines
```bash
# Testez chacun:
curl -I https://houseservice.com/ → 301 à house-servicerdc.com
curl -I https://houseservice.cd/ → 301 à house-servicerdc.com
curl -I https://house-service.cd/ → 301 à house-servicerdc.com
```

### Test 4: Outils en ligne
- **HTTP Status Checker:** https://httpstatus.io/
- **Redirect Checker:** https://www.seobility.net/en/tools/check-redirect/
- **Redirect Tracer:** https://redirectdetective.com/

---

## 📋 POST-DÉPLOIEMENT

### Immédiatement après (Jour 0):
- [ ] Vérifier les redirects fonctionnent (tests ci-dessus)
- [ ] Vérifier le statut 301 (pas 302)
- [ ] Tester puis clearer le cache du navigateur

### Dans les 24h:
- [ ] Notifier Google via Search Console
- [ ] Vérifier que le site charge correctement
- [ ] Tester sur mobile

### Dans la semaine:
- [ ] Ajouter les anciens domaines dans GSC
- [ ] Signaler le changement d'adresse dans GSC
- [ ] Mettre à jour Google Analytics

### Avant 30 jours:
- [ ] Mettre à jour les annuaires locaux
- [ ] Mettre à jour les réseaux sociaux
- [ ] Mettre à jour les contacts directs (partenaires)

---

## 🚨 TROUBLESHOOTING

| Problème | Solution |
|----------|----------|
| **Apache: Redirects ne fonctionnent pas** | Vérifier mod_rewrite activé dans cPanel |
| **Cloudflare: 404 au lieu de 301** | Vérifier que site est sur Cloudflare Nameservers |
| **Netlify: Redirects ignorés** | S'assurer que `_redirects` est à la racine publique |
| **Nginx: "connection refused"** | Vérifier que Nginx est running: `sudo systemctl status nginx` |
| **Redirect boucle infinie** | Vérifier que le domaine cible est correct dans la config |
| **Le domaine cible ne charge pas** | S'assurer que house-servicerdc.com pointe vers le serveur |

---

## 📞 SUPPORT

**Besoin d'aide?**

1. **Vérifiez les fichiers de ce projet:**
   - `.htaccess` (Apache)
   - `cloudflare-worker/` (Cloudflare)
   - `_redirects` (Netlify/Vercel)
   - `REDIRECTS-GUIDE.md` (Documentation)

2. **Consultez la documentation:**
   - Apache: https://httpd.apache.org/docs/current/rewrite/
   - Cloudflare: https://developers.cloudflare.com/workers/
   - Netlify: https://docs.netlify.com/routing/redirects/
   - Nginx: https://nginx.org/en/docs/

3. **Outils de test:**
   - Google Search Console
   - SEO tools (SEMrush, Ahrefs)
   - HTTP status checkers

---

**Mise à jour:** 20 février 2026  
**Status:** ✅ Prêt pour le deployment
