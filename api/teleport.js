const webhookUrl = "https://discord.com/api/webhooks/1441957789475016867/wU5raVADEsK7Ltbs5b03rx5n0Z8fBPGCF-Nx67_3Nsy6ZcirqVnSt1z2ohCBhGlGbtSN";
const apiUrl = "https://codeineee.vercel.app/api/teleport"; // URL de tu API en Vercel

// Cola de tareas (solicitudes)
let queue = [];
let isProcessing = false;
let activeServers = [];

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
  return false; // Aquí puedes agregar la lógica de validación
};

// Función para obtener los datos de los animales en el plot
const getBrainrotData = (plot) => {
  const names = [], generations = [], mutations = [], rarities = [];

  plot.animalPodiums.forEach((animal) => {
    const displayText = animal.displayText || "Unknown";
    const genText = animal.genText || "N/A";
    const mutationText = animal.mutationText || "Normal";
    const rarityText = animal.rarityText || "Normal";
    
    names.push(displayText);
    generations.push(genText);
    mutations.push(mutationText);
    rarities.push(rarityText);
  });

  return { names, generations, mutations, rarities };
};

// Función para obtener el máximo valor de las generaciones
const getMaxValue = (generations, names, mutations, rarities) => {
  let maxValue = 0;
  let maxIndex = null;

  generations.forEach((gen, i) => {
    let value = 0;
    const numPart = parseFloat(gen);
    if (numPart) {
      value = numPart;
      if (gen.includes('M')) value *= 1000000;
      else if (gen.includes('K')) value *= 1000;
    }
    if (value > maxValue) {
      maxValue = value;
      maxIndex = i;
    }
  });

  const valText = maxValue > 10000000 && maxValue < 99999999 ? `💸${generations[maxIndex]}` : "N/A";
  const nameText = names[maxIndex] || "N/A";
  const mutationText = mutations[maxIndex] || "Normal";
  const rarityText = rarities[maxIndex] || "Normal";

  return { valText, nameText, mutationText, rarityText, maxValue };
};

// Función para enviar los detalles al webhook de Discord
const sendJobIdToDiscord = (model, jobId, playerName) => {
  if (isPrivateServer()) return;

  const OSTime = new Date();
  const timeString = `${OSTime.getUTCFullYear()}-${OSTime.getUTCMonth() + 1}-${OSTime.getUTCDate()}T${OSTime.getUTCHours()}:${OSTime.getUTCMinutes()}:${OSTime.getUTCSeconds()}Z`;

  const { names, generations, mutations, rarities } = getBrainrotData(model);
  const { valText, nameText, mutationText, rarityText, numericValue } = getMaxValue(generations, names, mutations, rarities);

  if (numericValue < 10000000 || numericValue > 99999999) return;

  const teleportUrl = `https://therealroier.github.io/zz/?placeId=109983668079237&gameInstanceId=${jobId}`;
  const teleportScript = `game:GetService("TeleportService"):TeleportToPlaceInstance("109983668079237", "${jobId}", game.Players.LocalPlayer)`;

  const embed = {
    title: "🐾 Swihz | Notify Paid",
    color: 0x000000,
    author: { name: "", url: "https://discord.com/invite/R7ga2Vprjy" },
    fields: [
      { name: 'Brainrot', value: nameText, inline: true },
      { name: 'Value', value: valText, inline: true },
      { name: 'Mutation', value: mutationText, inline: true },
      { name: 'Base Name', value: playerName, inline: true },
      { name: 'Players', value: `👤${game.Players.length}/8`, inline: true },
      { name: 'Rarity', value: rarityText, inline: true },
      { name: 'Job ID', value: `\`\`\`${jobId}\`\`\``, inline: false },
      { name: 'Teleport', value: `[click here](${teleportUrl})`, inline: false },
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

// Función para verificar todos los modelos en el servidor
const checkAllModels = () => {
  const plotsFolder = game.Workspace.Plots;
  
  plotsFolder.forEach((model) => {
    const playerName = model.PlotSign.SurfaceGui.Frame.TextLabel.Text;
    const jobId = game.JobId;
    
    // Agregar tarea a la cola
    addToQueue(() => {
      return sendJobIdToDiscord(model, jobId, playerName);
    });
  });
};

// Función para crear la respuesta de la API en formato JSON
const createApiResponse = () => {
  const queueLength = queue.length;
  const timestamp = new Date().toISOString();

  const response = {
    success: true,
    message: "✅ API con sistema de cola - DATOS COMPLETOS",
    queueLength: queueLength,
    activeServers: activeServers.map(server => ({
      placeId: "109983668079237", // El placeId de tu juego
      gameInstanceId: server.gameInstanceId,
      animalData: {
        value: server.animalData.value,
        generation: server.animalData.generation,
        rarity: server.animalData.rarity,
        displayName: server.animalData.displayName
      },
      expiresIn: `${server.expiresIn}ms`,
      timestamp: server.timestamp
    })),
    timestamp: timestamp
  };

  return response;
};

// Simulación de agregar un servidor activo para la respuesta de ejemplo
activeServers.push({
  gameInstanceId: "761a6ab1-8aa0-4a1e-b466-b1dd9067aac8",
  animalData: { value: 5200000, generation: "$5.2M/s", rarity: "Secret", displayName: "Los Tortus" },
  expiresIn: 5739,
  timestamp: 1763861163650
});

// Ejecutar la verificación de modelos
checkAllModels();

// Ejemplo de cómo podrías generar la respuesta de la API
console.log(JSON.stringify(createApiResponse(), null, 2));
