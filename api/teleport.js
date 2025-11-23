import express from 'express';
import bodyParser from 'body-parser';

const app = express();

// Usar bodyParser para asegurarse de que el cuerpo de la solicitud se interprete correctamente como JSON
app.use(express.json()); // Esto es importante para analizar los datos en formato JSON

// Función de manejo de la API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    const { placeId, gameInstanceId, animalData, timestamp, source } = req.body || {}; // Asegúrate de que no sea undefined

    return res.status(405).json({
      message: 'Method Not Allowed',
      receivedData: { placeId, gameInstanceId, animalData, timestamp, source }
    });
  }

  try {
    const { placeId, gameInstanceId, animalData, timestamp, source } = req.body || {}; // Asegúrate de que no sea undefined

    if (!placeId || !gameInstanceId || !animalData) {
      return res.status(400).json({
        message: "Missing required data",
        receivedData: { placeId, gameInstanceId, animalData, timestamp, source }
      });
    }

    // Lógica para procesar los datos (puedes agregar más lógica aquí)
    console.log('Received data:', { placeId, gameInstanceId, animalData, timestamp, source });

    // Responder con éxito
    return res.status(200).json({ message: 'Data received successfully!' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
      receivedData: { placeId, gameInstanceId, animalData, timestamp, source }
    });
  }
}
