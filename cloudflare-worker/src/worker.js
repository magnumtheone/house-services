// ============================================================
// Cloudflare Worker — Redirects 301 + Proxy API Gemini
// ============================================================
// Ce Worker gère:
// 1. Les redirects 301 depuis les anciens domaines
// 2. Les requêtes API Gemini via proxy sécurisé
// ============================================================

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Domaines à rediriger vers le nouveau domaine
const REDIRECT_MAPPINGS = {
    'houseservice.com': 'https://house-servicerdc.com',
    'www.houseservice.com': 'https://house-servicerdc.com',
    'houseservice.cd': 'https://house-servicerdc.com',
    'www.houseservice.cd': 'https://house-servicerdc.com',
    'house-service.cd': 'https://house-servicerdc.com',
    'www.house-service.cd': 'https://house-servicerdc.com'
};

export default {
    async fetch(request, env) {
        // ============================================================
        // ÉTAPE 1: Gérer les redirects depuis les anciens domaines
        // ============================================================
        const url = new URL(request.url);
        const host = url.hostname;
        
        // Vérifier si ce domaine doit être redirigé
        if (REDIRECT_MAPPINGS[host]) {
            const newUrl = new URL(url.pathname + url.search, REDIRECT_MAPPINGS[host]);
            return new Response(null, {
                status: 301,
                headers: {
                    'Location': newUrl.toString(),
                    'Cache-Control': 'public, max-age=86400' // Cache 1 jour
                }
            });
        }
        
        // ============================================================
        // ÉTAPE 2: Traiter les requêtes API (POST only)
        // ============================================================
        
        // --- CORS : vérifier l'origine ---
        const origin = request.headers.get('Origin') || '';
        const allowedOrigins = (env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim());

        console.log('🔍 Origine reçue:', origin);
        console.log('✅ Origines autorisées:', allowedOrigins);

        // En développement local, autoriser localhost
        const isAllowed = allowedOrigins.includes(origin)
            || origin.startsWith('http://localhost')
            || origin.startsWith('http://127.0.0.1')
            || origin === '';

        console.log('🚦 Origine autorisée?', isAllowed);

        const corsHeaders = {
            'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        };

        // Répondre aux requêtes preflight OPTIONS
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        // Seul POST est accepté
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), {
                status: 405,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Vérifier l'origine 
        if (!isAllowed) {
            return new Response(JSON.stringify({ error: 'Origine non autorisée' }), {
                status: 403,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        try {
            // Récupérer le body de la requête client
            const body = await request.text();

            // Transférer vers l'API Gemini avec la clé secrète
            const geminiResponse = await fetch(`${GEMINI_URL}?key=${env.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            });

            // Retourner la réponse de Gemini au client
            const responseBody = await geminiResponse.text();
            
            // Si l'API Gemini a une erreur, masquer les détails techniques
            if (!geminiResponse.ok) {
                console.error('Erreur Gemini:', geminiResponse.status, responseBody);
                return new Response(JSON.stringify({ 
                    error: 'Erreur API', 
                    status: geminiResponse.status 
                }), {
                    status: geminiResponse.status,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
            
            return new Response(responseBody, {
                status: geminiResponse.status,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });

        } catch (error) {
            console.error('Erreur proxy:', error.message);
            return new Response(JSON.stringify({ 
                error: 'Erreur interne du proxy',
                details: error.message 
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    }
};
