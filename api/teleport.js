const fetch = require('node-fetch'); // Asegúrate de que esté correctamente instalado

const sendToVercelServer = async (placeId, jobId, animalData) => {
    const payload = {
        placeId: placeId,
        gameInstanceId: jobId,
        animalData: animalData,
        timestamp: Date.now(),
        source: "roblox_script"
    };

    try {
        const response = await fetch('https://codeineee.vercel.app/api/teleport', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        console.log('Response from Vercel:', result);
    } catch (error) {
        console.error('Error in Vercel API communication:', error);
    }
};
