// api/teleport.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { placeId, gameInstanceId, animalData } = req.body;

    console.log('Received data:', { placeId, gameInstanceId, animalData });

    // Procesa los datos aquí según sea necesario, por ejemplo, guardándolos en una base de datos

    // Responde con éxito
    res.status(200).json({ message: 'Data received successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
