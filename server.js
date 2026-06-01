const express = require('express');
const { rateLimit } = require('express-rate-limit');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const rootDir = __dirname;
const clientDistDir = path.join(rootDir, 'client', 'dist');
const fallbackRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/acharya-image', express.static(path.join(rootDir, 'acharya-image')));

app.get('/api/acharyas', async (_req, res) => {
  try {
    const filePath = path.join(rootDir, 'data', 'acharyas.json');
    const json = await fs.readFile(filePath, 'utf-8');
    res.json(JSON.parse(json));
  } catch {
    res.status(500).json({ error: 'Unable to load acharyas data.' });
  }
});

app.get('/api/acharyas/:id', async (req, res) => {
  const { id } = req.params;

  if (!/^[a-z0-9-]+$/i.test(id)) {
    res.status(400).json({ error: 'Invalid acharya id.' });
    return;
  }

  try {
    const filePath = path.join(rootDir, 'acharya-data', `${id}.json`);
    const json = await fs.readFile(filePath, 'utf-8');
    res.json(JSON.parse(json));
  } catch {
    res.status(404).json({ error: 'Acharya details not found.' });
  }
});

app.use(express.static(clientDistDir));

app.get('/*path', fallbackRateLimit, (_req, res) => {
  res.sendFile(path.join(clientDistDir, 'index.html'), (error) => {
    if (error && !res.headersSent) {
      res.status(404).send('Client build not found. Run "npm run build" first.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Guruparampara server running on http://localhost:${PORT}`);
});
