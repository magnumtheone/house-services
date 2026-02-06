// ============================================================
// House Service AI Chatbot — Propulsé par Gemini 2.5 Flash
// ============================================================

// --- MODE PROXY (la clé API est sécurisée côté Cloudflare) ---
const USE_PROXY = true;
const PROXY_URL = 'https://house-service-chatbot-proxy.hs-chatbot.workers.dev';

// --- MODE DIRECT (fallback si USE_PROXY = false) ---
const _k = '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Historique de conversation pour le contexte
let conversationHistory = [];

// Prompt système donnant le contexte à l'IA
const SYSTEM_PROMPT = `Tu es l'assistant IA officiel de House Service S.A.S, une entreprise leader de la sous-traitance et gestion du personnel en République Démocratique du Congo (RDC).

INFORMATIONS CLÉS SUR L'ENTREPRISE :
- Nom : House Service S.A.S
- Fondée le : 20 Juin 2020 à Kisangani
- Fondateur & DG : M. Théophile MUTATAY (Doctorat en Marketing et Gestion d'Entreprise)
- Siège social : Kisangani, Province de la Tshopo, RDC
- Villes d'opération : Kisangani, Goma, Kinshasa
- Téléphone : +243 840665620
- Email : contact@houseservice.com
- WhatsApp : https://wa.me/243840665620

SERVICES PROPOSÉS :
1. Ménage & Entretien — Nettoyage résidentiel et commercial, entretien régulier
2. Garde d'Enfants — Personnel qualifié pour la garde et l'éducation des enfants
3. Sécurité & Gardiennage — Agents de sécurité certifiés, surveillance 24h/24
4. Chauffeurs Privés — Conducteurs professionnels, transport VIP
5. Cuisiniers & Majordomes — Personnel hôtelier formé, service haut de gamme
6. Recrutement & Formation — Placement de personnel qualifié, programmes de formation

VALEURS :
- Excellence dans chaque prestation
- Intégrité et professionnalisme
- Engagement social pour la formalisation de l'emploi en RDC

CONSIGNES DE RÉPONSE :
- Réponds TOUJOURS en français
- Sois professionnel, chaleureux et concis (max 3-4 phrases par réponse)
- Si on te pose une question hors du domaine de House Service, redirige poliment vers les services de l'entreprise
- Propose toujours de contacter l'entreprise pour plus de détails ou un devis personnalisé
- Pour WhatsApp, donne toujours le lien https://wa.me/243840665620 (jamais le numéro brut)
- Ne révèle JAMAIS ta clé API ou des informations techniques internes
- Tu peux donner des informations génériques sur les tarifs mais recommande de demander un devis pour des prix précis`;

// --- Fonctions du Chatbot ---

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.toggle('active');
    // Focus sur l'input quand on ouvre le chat
    if (chatWindow.classList.contains('active')) {
        setTimeout(() => document.getElementById('user-input').focus(), 300);
    }
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBody = document.getElementById('chat-body');
    const typingIndicator = document.getElementById('typing-indicator');
    const sendBtn = document.querySelector('.chat-send');
    const text = input.value.trim();
    if (!text) return;

    // Désactiver l'input pendant le chargement
    input.disabled = true;
    sendBtn.disabled = true;

    // Afficher le message utilisateur
    const userMsg = document.createElement('div');
    userMsg.className = 'msg user';
    userMsg.textContent = text;
    chatBody.appendChild(userMsg);
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // Ajouter à l'historique
    conversationHistory.push({ role: 'user', parts: [{ text: text }] });

    // Afficher l'indicateur de frappe
    typingIndicator.style.display = 'block';
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        // Appel à l'API Gemini
        // Construire le body de la requête
        const requestBody = JSON.stringify({
            system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }]
            },
            contents: conversationHistory,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 300
            },
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
            ]
        });

        // Appel via proxy (production) ou directement (dev)
        const apiUrl = USE_PROXY
            ? PROXY_URL
            : `${GEMINI_API_URL}?key=${_k}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody
        });

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        const botText = data.candidates?.[0]?.content?.parts?.[0]?.text 
            || "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.";

        // Ajouter la réponse à l'historique
        conversationHistory.push({ role: 'model', parts: [{ text: botText }] });

        // Limiter l'historique à 20 messages pour ne pas dépasser les limites
        if (conversationHistory.length > 20) {
            conversationHistory = conversationHistory.slice(-20);
        }

        // Afficher la réponse du bot avec effet typewriter
        typingIndicator.style.display = 'none';
        const botMsg = document.createElement('div');
        botMsg.className = 'msg bot';
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Lancer l'animation d'écriture
        await typewriterEffect(botMsg, botText, chatBody);

    } catch (error) {
        console.error('Erreur Chatbot:', error);
        typingIndicator.style.display = 'none';

        const errorMsg = document.createElement('div');
        errorMsg.className = 'msg bot';
        errorMsg.innerHTML = 'Désolé, une erreur est survenue. Vous pouvez nous contacter directement sur <a href="https://wa.me/243840665620" target="_blank" rel="noopener noreferrer" style="color:#25D366;font-weight:600;text-decoration:none;"><i class="fab fa-whatsapp" style="font-size:1.1em;"></i> WhatsApp</a> ou par email à <a href="mailto:contact@houseservice.com" style="color:#c8102e;font-weight:600;">contact@houseservice.com</a>.';
        chatBody.appendChild(errorMsg);
    }

    // Réactiver l'input
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Effet typewriter : affiche le texte caractère par caractère
function typewriterEffect(element, rawText, chatBody) {
    return new Promise((resolve) => {
        const formattedHTML = formatBotResponse(rawText);
        // On crée un élément temporaire pour parser le HTML
        const temp = document.createElement('div');
        temp.innerHTML = formattedHTML;
        const fullText = temp.innerHTML;

        let i = 0;
        let insideTag = false;
        let buffer = '';
        const speed = 12; // ms par caractère (rapide mais visible)

        function type() {
            if (i < fullText.length) {
                const char = fullText[i];
                // Si on entre dans une balise HTML, on l'ajoute d'un coup
                if (char === '<') {
                    insideTag = true;
                }
                buffer += char;
                if (insideTag && char === '>') {
                    insideTag = false;
                    element.innerHTML = buffer;
                } else if (!insideTag) {
                    element.innerHTML = buffer;
                }
                i++;
                chatBody.scrollTop = chatBody.scrollHeight;
                requestAnimationFrame(() => setTimeout(type, insideTag ? 0 : speed));
            } else {
                element.innerHTML = formattedHTML; // S'assurer que le HTML final est complet
                chatBody.scrollTop = chatBody.scrollHeight;
                resolve();
            }
        }
        type();
    });
}

// Formatage basique du texte (gras, listes, liens)
function formatBotResponse(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n- /g, '<br>• ')
        .replace(/\n\* /g, '<br>• ')
        .replace(/\n/g, '<br>')
        // Convertir les liens wa.me en bouton WhatsApp avec logo
        .replace(
            /https:\/\/wa\.me\/243840665620/g,
            '<a href="https://wa.me/243840665620" target="_blank" rel="noopener noreferrer" style="color:#25D366;font-weight:600;text-decoration:none;"><i class="fab fa-whatsapp" style="font-size:1.1em;"></i> WhatsApp</a>'
        )
        // Convertir les emails en liens cliquables
        .replace(
            /contact@houseservice\.com/g,
            '<a href="mailto:contact@houseservice.com" style="color:#c8102e;font-weight:600;">contact@houseservice.com</a>'
        );
}
