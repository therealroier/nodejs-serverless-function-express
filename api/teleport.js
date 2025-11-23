const express = require('express');
const app = express();
const fetch = require('node-fetch');

app.use(express.json());  // Para parsear el cuerpo de la solicitud en JSON

const webhookUrl = "https://discord.com/api/webhooks/1441957789475016867/wU5raVADEsK7Ltbs5b03rx5n0Z8fBPGCF-Nx67_3Nsy6ZcirqVnSt1z2ohCBhGlGbtSN";

// Cola de tareas (solicitudes)
let queue = [];
let isProcessing = false;

// Función para agregar tareas a la cola
const addToQueue = (task) => {
  queue.push(task);
  processQueue(); // Intenta procesar la cola si no se está procesando actualmente
};

// Función para procesar la cola de tareas
const processQueue = () => {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  const task = queue.shift(); // Obtener la siguiente tarea en la cola

  task().finally(() => {
    isProcessing = false;
    processQueue(); // Procesar la siguiente tarea en la cola
  });
};

// Función para verificar si el servidor es privado
const isPrivateServer = () => {
  return false; // Aquí puedes agregar la lógica de validación si es necesario
};

// Función para enviar los detalles al webhook de Discord
const sendJobIdToDiscord = (model, jobId, playerName) => {
  if (isPrivateServer()) return;

  const OSTime = new Date();
  const timeString = `${OSTime.getUTCFullYear()}-${OSTime.getUTCMonth() + 1}-${OSTime.getUTCDate()}T${OSTime.getUTCHours()}:${OSTime.getUTCMinutes()}:${OSTime.getUTCSeconds()}Z`;

  // Tomamos los valores de las propiedades del modelo que nos pasan
  const { names, generations, mutations } = model;

  // Usamos el primer valor disponible (si existe)
  const valText = generations[0] || "N/A";
  const nameText = names[0] || "N/A";
  const mutationText = mutations[0] || "Normal";

  const teleportScript = `game:GetService("TeleportService"):TeleportToPlaceInstance("109983668079237", "${jobId}", game.Players.LocalPlayer)`;

  // Definimos el embed con solo los campos solicitados
  const embed = {
    title: "🐾 Swihz | Notify Paid",
    color: 0x000000,
    fields: [
      { name: 'Brainrot', value: nameText, inline: true },
      { name: 'Value', value: valText, inline: true },
      { name: 'Mutation', value: mutationText, inline: true },
      { name: 'Job ID', value: `\`\`\`${jobId}\`\`\``, inline: false },
      { name: 'Teleport Script', value: teleportScript, inline: false }
    ],
    footer: { text: "Copyright by Swihz" },
    timestamp: timeString
  };

  // Enviar la notificación al webhook de Discord
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] })
  }).catch(err => console.error('Error sending to webhook:', err));
};

// Endpoint para recibir datos y procesarlos
app.post('/api/teleport', (req, res) => {
  const { models, jobId, playerName } = req.body; // Esperamos que los datos lleguen en el cuerpo de la solicitud

  models.forEach((model) => {
    addToQueue(() => {
      return sendJobIdToDiscord(model, jobId, playerName);
    });
  });

  res.json({
    success: true,
    message: "✅ Colas en proceso",
    queueLength: queue.length
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("API escuchando en el puerto 3000");
});
