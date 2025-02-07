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

// Dynamic Proxy Middleware
app.use(
  "/proxy/",
  createProxyMiddleware({
    target: "", // Will be set dynamically
    router: (req) => {
      return req.query.url || "https://www.google.com"; // Default to Google
    },
    changeOrigin: true,
    selfHandleResponse: false,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to: ${req.query.url}`);
    },
    onError: (err, req, res) => {
      res.status(500).send("Proxy Error: Unable to load site.");
    }
  })
);

app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});
