// api/teleport.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'xd' });
  }

  try {
    // Extraer datos del cuerpo de la solicitud
    const { placeId, gameInstanceId, animalData, timestamp, source } = req.body;

    // Verificar que los datos necesarios estén presentes
    if (!placeId || !gameInstanceId || !animalData || !timestamp || !source) {
      return res.status(400).json({ message: 'Bad Request: Missing required data' });
    }

    // Lógica para procesar la solicitud (si es necesario)
    console.log('Received data:', { placeId, gameInstanceId, animalData, timestamp, source });

    // Responder con éxito
    return res.status(200).json({ message: 'Data received successfully!' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
