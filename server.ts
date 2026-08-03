import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "20mb" }));

  // API Route: My IP & Client Details from Server Headers
  app.get("/api/my-ip", (req, res) => {
    let clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "";

    // Clean IPv6-mapped IPv4 addresses
    if (clientIp.startsWith("::ffff:")) {
      clientIp = clientIp.substring(7);
    }

    res.json({
      ip: clientIp,
      userAgent: req.headers["user-agent"] || "",
      acceptLanguage: req.headers["accept-language"] || "",
      host: req.headers["host"] || "",
      timestamp: new Date().toISOString(),
    });
  });

  // API Route: Quick Ping Test
  app.get("/api/ping", (_req, res) => {
    res.json({ status: "pong", timestamp: Date.now() });
  });

  // API Route: Download Speed Test (Generates ~2MB dummy binary data)
  app.get("/api/speedtest/download", (_req, res) => {
    const sizeInBytes = 2 * 1024 * 1024; // 2MB
    const buffer = Buffer.alloc(sizeInBytes, "X");
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Length", sizeInBytes.toString());
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.send(buffer);
  });

  // API Route: Upload Speed Test
  app.post("/api/speedtest/upload", (req, res) => {
    const receivedSize = JSON.stringify(req.body).length;
    res.json({ status: "ok", bytesReceived: receivedSize, timestamp: Date.now() });
  });

  // Vite middleware for development or static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
