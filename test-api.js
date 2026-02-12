// Test simple pour l'API Gemini via le proxy
const PROXY_URL = 'https://house-service-chatbot-proxy.hs-chatbot.workers.dev';

async function testAPI() {
    const testPayload = {
        system_instruction: {
            parts: [{ text: "Tu es un assistant test" }]
        },
        contents: [
            {
                role: 'user',
                parts: [{ text: 'Bonjour, test simple' }]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300
        }
    };

    try {
        console.log('📤 Envoi de la requête au proxy...');
        console.log('Payload:', JSON.stringify(testPayload, null, 2));

        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPayload)
        });

        console.log('📨 Réponse reçue - Status:', response.status);

        const responseText = await response.text();
        console.log('📄 Corps de la réponse:');
        console.log(responseText);

        if (response.ok) {
            const data = JSON.parse(responseText);
            console.log('✅ Succès! Réponse:', data.candidates?.[0]?.content?.parts?.[0]?.text);
        } else {
            console.error('❌ Erreur API:', responseText);
        }

    } catch (error) {
        console.error('❌ Erreur lors de la requête:', error.message);
    }
}

testAPI();
