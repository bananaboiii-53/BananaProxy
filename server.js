const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve the web GUI
app.use(express.static(path.join(__dirname, "public")));

// Proxy Middleware with Dynamic Target
app.use(
  "/proxy",
  (req, res, next) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
      return res.status(400).send("Error: No URL provided.");
    }

    createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      followRedirects: true,
      ws: true, // Enable WebSocket support
      secure: false,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Referer": targetUrl,
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${targetUrl}`);
      },
      onError: (err, req, res) => {
        console.error("Proxy Error:", err);
        res.status(500).send("Proxy Error: Unable to load site.");
      },
    })(req, res, next);
  }
);

app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});
