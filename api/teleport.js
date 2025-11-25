// /api/teleport.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes JSON

// Ruta para recibir los datos de la mascota
app.post("/api/teleport", (req, res) => {
    const { placeId, gameInstanceId, animalData, timestamp, source } = req.body;

    // Validar los datos recibidos
    if (!placeId || !gameInstanceId || !animalData) {
        return res.status(400).json({ error: "Missing required data" });
    }

    // Estructura de datos
    const logData = {
        placeId,
        gameInstanceId,
        animalData,
        timestamp,
        source,
    };

    // Guardar los datos en un archivo JSON (puedes cambiarlo por una base de datos si es necesario)
    const logFilePath = path.join(__dirname, "../data", "teleport_logs.json");
    
    // Verificar si el archivo existe, si no, crearlo
    if (!fs.existsSync(path.dirname(logFilePath))) {
        fs.mkdirSync(path.dirname(logFilePath));
    }

    // Leer los datos existentes
    fs.readFile(logFilePath, "utf8", (err, data) => {
        let logs = [];
        if (!err && data) {
            logs = JSON.parse(data);
        }

        // Agregar el nuevo log
        logs.push(logData);

        // Guardar los logs nuevamente en el archivo
        fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), "utf8", (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: "Error writing to file" });
            }

            // Responder con éxito
            res.status(200).json({ success: true, message: "Data received and logged" });
        });
    });
});

// Exportar el handler para que Vercel lo use
module.exports = app;
