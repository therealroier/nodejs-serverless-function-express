const fetch = require('node-fetch'); // Asegúrate de tener este paquete instalado

const WEBHOOK_URL = "https://discord.com/api/webhooks/1441957789475016867/wU5raVADEsK7Ltbs5b03rx5n0Z8fBPGCF-Nx67_3Nsy6ZcirqVnSt1z2ohCBhGlGbtSN";

// Función para manejar las solicitudes POST desde el script de Roblox
module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const data = req.body; // Recibe los datos del cuerpo de la solicitud (desde el script de Roblox)

    // Verificar que los datos necesarios estén presentes
    if (!data.displayName || !data.value || !data.generation || !data.rarity || !data.placeId || !data.gameInstanceId) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Construir el mensaje para Discord
    const embed = {
        title: "🐾 **Brainrot Notify | ZL Hub**",
        color: 65280,  // Verde en hexadecimal
        fields: [
            {
                name: "**Name**",
                value: data.displayName,
                inline: false,
            },
            {
                name: "**Money per sec**",
                value: `💰 ${data.value / 1000000}M/s`, // Formateo de dinero por segundo
                inline: true,
            },
            {
                name: "**Generation**",
                value: `📊 ${data.generation}`,
                inline: true,
            },
            {
                name: "**Rarity**",
                value: `🌟 ${data.rarity}`,
                inline: true,
            },
            {
                name: "**Place ID**",
                value: `\`\`\`${data.placeId}\`\`\``,
                inline: false,
            },
            {
                name: "**Game Instance ID**",
                value: `\`\`\`${data.gameInstanceId}\`\`\``,
                inline: false,
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: `Made by ZL Hub • ${new Date().toLocaleString()}`,
        },
    };

    const discordPayload = {
        embeds: [embed],
        username: "ZL Hub Notifier",
        avatar_url: "https://cdn.discordapp.com/attachments/1128833213672656988/1215321493282160730/standard_1.gif",
    };

    // Enviar los datos al webhook de Discord
    try {
        const discordResponse = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(discordPayload),
        });

        if (!discordResponse.ok) {
            throw new Error(`Discord request failed with status ${discordResponse.status}`);
        }

        // Formato de respuesta similar al ejemplo proporcionado
        const responsePayload = {
            success: true,
            message: "✅ API con sistema de cola - DATOS COMPLETOS",
            queueLength: 2,  // Este valor puede variar dependiendo de la implementación real
            activeServers: [
                {
                    placeId: data.placeId,
                    gameInstanceId: data.gameInstanceId,
                    animalData: {
                        value: data.value,
                        generation: data.generation,
                        rarity: data.rarity,
                        displayName: data.displayName,
                    },
                    expiresIn: "14957ms", // Este valor se puede calcular dinámicamente si es necesario
                    timestamp: Date.now(),
                },
            ],
            timestamp: new Date().toISOString(),
        };

        res.status(200).json(responsePayload); // Devuelve los datos en formato JSON
    } catch (error) {
        console.error("Error sending to Discord webhook:", error);
        res.status(500).json({ message: "Failed to send to Discord webhook" });
    }
};
