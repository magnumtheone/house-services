# Proxy Cloudflare Worker — House Service Chatbot

Ce Worker Cloudflare sert de proxy entre votre site et l'API Gemini.  
La clé API reste **côté serveur**, invisible pour les visiteurs.

## Déploiement (5 minutes)

### 1. Prérequis
- Un compte Cloudflare gratuit → [dash.cloudflare.com](https://dash.cloudflare.com)
- Node.js installé sur votre machine

### 2. Installer Wrangler (CLI Cloudflare)
```bash
npm install -g wrangler
```

### 3. Se connecter
```bash
wrangler login
```

### 4. Ajouter votre clé API en secret
```bash
cd cloudflare-worker
npx wrangler secret put GEMINI_API_KEY
```
Collez votre clé quand demandé. Elle sera chiffrée et stockée en sécurité.

### 5. Déployer
```bash
npx wrangler deploy
```

Vous obtiendrez une URL du type :  
`https://house-service-chatbot-proxy.<votre-compte>.workers.dev`

### 6. Mettre à jour le site
Dans `js/chatbot.js`, remplacez :
```javascript
const USE_PROXY = false;
const PROXY_URL = 'https://house-service-chatbot-proxy.VOTRE-COMPTE.workers.dev';
```
par :
```javascript
const USE_PROXY = true;
const PROXY_URL = 'https://house-service-chatbot-proxy.votre-compte.workers.dev';
```

### 7. Restreindre les origines
Dans `wrangler.toml`, mettez vos vrais domaines :
```toml
ALLOWED_ORIGINS = "https://houseservice.cd,https://www.houseservice.cd"
```

## Coût
Cloudflare Workers : **gratuit** jusqu'à 100 000 requêtes/jour.
