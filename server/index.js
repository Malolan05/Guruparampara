const express = require("express");
const { existsSync } = require("fs");
const fs = require("fs/promises");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3001;

const dataPath = path.join(__dirname, "data", "acharyas.json");
const detailDir = path.join(__dirname, "acharya-data");
const imageDir = path.join(__dirname, "acharya-image");
const clientDist = path.join(__dirname, "..", "client", "dist");

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);
app.use("/images", apiLimiter);

app.get("/api/acharyas", async (_req, res) => {
  try {
    const payload = await fs.readFile(dataPath, "utf-8");
    res.json(JSON.parse(payload));
  } catch {
    res.status(404).json({ error: "not found" });
  }
});

app.get("/api/acharyas/:id", async (req, res) => {
  const safeId = path.basename(req.params.id || "");
  const filePath = path.join(detailDir, `${safeId}.json`);

  try {
    const payload = await fs.readFile(filePath, "utf-8");
    res.json(JSON.parse(payload));
  } catch {
    res.status(404).json({ error: "not found" });
  }
});

app.use("/images", express.static(imageDir));

if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
