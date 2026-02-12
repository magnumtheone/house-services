// ============================================================
// Cloudflare Worker — Proxy API Gemini pour House Service
// ============================================================
// Ce Worker sert d'intermédiaire entre le site et l'API Gemini.
// La clé API est stockée côté serveur (secret Cloudflare), 
// jamais exposée au navigateur.
// ============================================================

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export default {
    async fetch(request, env) {
        // --- CORS : vérifier l'origine ---
        const origin = request.headers.get('Origin') || '';
        const allowedOrigins = (env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim());

        // En développement local, autoriser localhost
        const isAllowed = allowedOrigins.includes(origin)
            || origin.startsWith('http://localhost')
            || origin.startsWith('http://127.0.0.1')
            || origin === '';

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
