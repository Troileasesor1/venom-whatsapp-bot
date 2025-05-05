const express = require('express');
const venom = require('venom-bot');
const app = express();

app.use(express.json());

let client;

venom
  .create({
    session: 'bot',
    multidevice: true,
    headless: true,
    puppeteerOptions: {
      executablePath: '/usr/bin/chromium-browser',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    }
  })
  .then((clientInstance) => {
    client = clientInstance;

    app.get('/', (req, res) => {
      res.send('✅ Bot activo desde Fly.io');
    });

    app.post('/send', async (req, res) => {
      const { to, message } = req.body;
      if (!to || !message) {
        return res.status(400).send('Faltan datos: "to" o "message"');
      }

      try {
        await client.sendText(to, message);
        res.send('Mensaje enviado ✅');
      } catch (err) {
        res.status(500).send(`Error al enviar mensaje: ${err.message}`);
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor activo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al iniciar VenomBot:', err);
  });
