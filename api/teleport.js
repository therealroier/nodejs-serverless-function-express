export default async function handler(req, res) {
  // Si el método no es POST, devolvemos un error 405 y mostramos los datos recibidos
  if (req.method !== 'POST') {
    const { placeId, gameInstanceId, animalData, timestamp, source } = req.body;
    
    return res.status(405).json({
      message: 'Method Not Allowed',
      receivedData: { placeId, gameInstanceId, animalData, timestamp, source }
    });
  }

  try {
    // Extraemos los datos del cuerpo de la solicitud
    const { placeId, gameInstanceId, animalData, timestamp, source } = req.body;

    // Lógica para procesar los datos (puedes agregar más lógica aquí)
    console.log('Received data:', { placeId, gameInstanceId, animalData, timestamp, source });

    // Responder con éxito
    return res.status(200).json({ message: 'Data received successfully!' });
  } catch (error) {
    console.error('Error:', error);

    // Si ocurre un error, responder con un error 500 y mostrar los datos
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
      receivedData: { placeId, gameInstanceId, animalData, timestamp, source }
    });
  }
}
