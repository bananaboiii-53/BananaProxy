const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(
  "/proxy",
  createProxyMiddleware({
    target: "https://example.com",
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
  console.log(`Proxy running on http://localhost:${PORT}`);
});
