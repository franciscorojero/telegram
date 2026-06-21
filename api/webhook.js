import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;

/*
Enviar mensaje
*/
async function enviarMensaje(chatId, texto) {
  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: texto
    })
  });
}

/*
Enviar imagen
*/
// async function enviarImagen(chatId) {
//   const url = `https://api.telegram.org/bot${TOKEN}/sendPhoto`;

//   await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       chat_id: chatId,
//       photo: "https://picsum.photos/800/500"
//     })
//   });
// }

async function enviarImagen(chatId) {
  // Generar número aleatorio entre 1 y 100
  const idImagen = Math.floor(Math.random() * 100) + 1;

  const urlImagen =
    `https://picsum.photos/id/${idImagen}/800/500`;

  const urlTelegram =
    `https://api.telegram.org/bot${TOKEN}/sendPhoto`;

  await fetch(urlTelegram, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      photo: urlImagen,
      caption: `Imagen aleatoria #${idImagen}`
    })
  });
}

app.get('/webhook', (req, res) => {
    res.send('Telegram API');
});

/*
Webhook de Telegram
*/
app.post("/webhook", async (req, res) => {
  try {
    const mensaje = req.body.message;

    if (!mensaje) {
      return res.sendStatus(200);
    }

    const chatId = mensaje.chat.id;
    const texto = mensaje.text;

    /*
    /saludar
    */
    if (texto === "/saludar") {
      const fecha = new Date();

      const respuesta =
        `Hola\n` +
        `Fecha: ${fecha.toLocaleDateString()}\n` +
        `Hora: ${fecha.toLocaleTimeString()}`;

      await enviarMensaje(chatId, respuesta);
    }

    /*
    /imagen
    */
    else if (texto === "/imagen") {
      await enviarImagen(chatId);
    }

    /*
    Comando desconocido
    */
    else {
      await enviarMensaje(
        chatId,
        "Comandos disponibles:\n/saludar\n/imagen"
      );
    }

    res.sendStatus(200);

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});

export default app;