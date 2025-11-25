module.exports = async (req, res) => {
    // Verificar si el método es POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido, se requiere POST' });
    }

    // Obtener los datos de la solicitud
    const { placeId, gameInstanceId, animalData, timestamp, source } = req.body;

    // Validar los datos
    if (!placeId || !gameInstanceId || !animalData) {
        return res.status(400).json({ error: 'Faltan datos esenciales en el cuerpo de la solicitud' });
    }

    // Extraer los datos del animal
    const { displayName, value, generation, rarity } = animalData;

    // Formatear el valor de dinero por segundo
    let moneyPerSecFormatted = '';
    if (value >= 1000000000) {
        moneyPerSecFormatted = `${(value / 1000000000).toFixed(1)}B/s`;
    } else if (value >= 1000000) {
        moneyPerSecFormatted = `${(value / 1000000).toFixed(1)}M/s`;
    } else if (value >= 1000) {
        moneyPerSecFormatted = `${(value / 1000).toFixed(1)}K/s`;
    } else {
        moneyPerSecFormatted = `${value}s`;
    }

    // Mostrar los datos en formato HTML
    const htmlContent = `
        <html>
            <head><title>Detalles del Animal</title></head>
            <body>
                <h1>Detalles del Animal</h1>
                <p><strong>Nombre:</strong> ${displayName}</p>
                <p><strong>Money per second:</strong> ${moneyPerSecFormatted}</p>
                <p><strong>Generación:</strong> ${generation}</p>
                <p><strong>Rareza:</strong> ${rarity}</p>
                <p><strong>Job ID:</strong> <code>${gameInstanceId}</code></p>
                <p><strong>Place ID:</strong> <code>${placeId}</code></p>
                <h3>Unirse al juego</h3>
                <p><strong>Link de Unirse:</strong> 
                    <a href="https://chillihub1.github.io/chillihub-joiner/?placeId=${placeId}&gameInstanceId=${gameInstanceId}" target="_blank">
                        Haz clic para unirte
                    </a>
                </p>
                <p><strong>Script de Teletransportación (PC):</strong></p>
                <pre>
game:GetService("TeleportService"):TeleportToPlaceInstance(${placeId}, "${gameInstanceId}", game.Players.LocalPlayer)
                </pre>
            </body>
        </html>
    `;

    // Responder con el contenido HTML
    res.status(200).send(htmlContent);
};
