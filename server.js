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

// Proxy Middleware
app.use(
  "/proxy",
  createProxyMiddleware({
    target: "https://example.com/",
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const newTarget = req.query.url;
      return newTarget ? path.replace("/proxy", newTarget) : path;
    },
    onProxyReq: (proxyReq, req) => {
      console.log(`Proxying request to: ${req.query.url}`);
    },
  })
);

app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});
