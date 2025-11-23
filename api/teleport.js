const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Definir las URLs
const WEBHOOK_URL = "https://discord.com/api/webhooks/1441973041868443798/imWXBKQltP9VFcDhXr_ema7gagVfFSPsTis6q8Vl_qQhlQEm7yBnSNWVJsckJGo1c8OF";
const SERVER_URL = "https://codeineee.vercel.app/api/teleport"; // URL de tu Vercel

// Endpoint para recibir datos en /api/teleport
app.post('/api/teleport', async (req, res) => {
    const { placeId, gameInstanceId, animalData } = req.body;

    if (!placeId || !gameInstanceId || !animalData) {
        return res.status(400).json({ error: "Missing required data" });
    }

    // Lógica para enviar a Vercel
    const vercelPayload = {
        placeId: String(placeId),
        gameInstanceId: gameInstanceId,
        animalData: animalData,
        timestamp: Date.now(),
        source: "roblox_script"
    };

    try {
        const vercelResponse = await sendToVercelServer(vercelPayload);
        if (vercelResponse.success) {
            console.log("Datos enviados a Vercel con éxito");
        } else {
            console.error("Error al enviar datos a Vercel");
        }
    } catch (error) {
        console.error("Error en la comunicación con Vercel:", error);
    }

    // Enviar a Discord Webhook
    const discordPayload = createDiscordPayload(animalData, placeId, gameInstanceId);
    try {
        await sendToDiscordWebhook(discordPayload);
        console.log("Datos enviados a Discord con éxito");
        res.json({
            success: true,
            message: "Data received and sent successfully",
        });
    } catch (error) {
        console.error("Error al enviar a Discord:", error);
        res.status(500).json({ error: "Error al enviar los datos a Discord" });
    }
});

// Función para enviar datos a Vercel
async function sendToVercelServer(data) {
    const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error(`Error en la respuesta de Vercel: ${response.statusText}`);
    }
}

// Crear el payload para Discord Webhook
function createDiscordPayload(animalData, placeId, gameInstanceId) {
    const moneyPerSecFormatted = formatMoneyPerSecond(animalData.value);

    return {
        embeds: [{
            title: "🐾 **Swihz | Notify Paid**",
            color: 0x000000,
            fields: [
                { name: "**Name**", value: animalData.displayName, inline: false },
                { name: "**Money per sec**", value: moneyPerSecFormatted, inline: true },
                { name: "**Generation**", value: `📊 ${animalData.generation}`, inline: true },
                { name: "**Rarity**", value: `🌟 ${animalData.rarity}`, inline: true },
                { name: "**Job ID**", value: `\`\`\`${gameInstanceId}\`\`\``, inline: false },
                { name: "**Join Link**", value: `[Click to Join](https://therealroier.github.io/zz/?placeId=${placeId}&gameInstanceId=${gameInstanceId})`, inline: false }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: `Copyright By Swihz • ${new Date().toLocaleString()}`,
            },
        }],
        username: "Swihz Notify",
        avatar_url: "https://cdn.discordapp.com/attachments/1128833213672656988/1215321493282160730/standard_1.gif",
    };
}

// Función para formatear el dinero por segundo
function formatMoneyPerSecond(value) {
    let formattedValue;
    if (value >= 1_000_000_000) {
        formattedValue = `💰 ${(value / 1_000_000_000).toFixed(1)}B/s`;
    } else if (value >= 1_000_000) {
        formattedValue = `💰 ${(value / 1_000_000).toFixed(1)}M/s`;
    } else if (value >= 1_000) {
        formattedValue = `💰 ${(value / 1_000).toFixed(1)}K/s`;
    } else {
        formattedValue = `💰 ${value}s`;
    }
    return formattedValue;
}

// Función para enviar los datos a Discord Webhook
async function sendToDiscordWebhook(payload) {
    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Error en la respuesta de Discord: ${response.statusText}`);
    }
}

// Iniciar el servidor en Vercel
module.exports = app;
