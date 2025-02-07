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

// Proxy Middleware with Header Modifications
app.use(
  "/proxy/",
  createProxyMiddleware({
    target: "",
    router: (req) => req.query.url || "https://www.google.com",
    changeOrigin: true,
    secure: false,
    selfHandleResponse: false,
    ws: true, // WebSocket support
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      "Referer": "https://www.google.com/",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to: ${req.query.url}`);
    },
    onError: (err, req, res) => {
      res.status(500).send("Proxy Error: Unable to load site.");
    },
  })
);

app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});
