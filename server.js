onst http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

// Serve static HTML (you can keep the index.html in the "public" folder)
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf-8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error reading the HTML file.');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
    return;
  }

  // Handle proxy requests
  if (req.url.startsWith('/proxy')) {
    const targetUrl = req.url.split('?url=')[1];
    if (!targetUrl) {
      res.statusCode = 400;
      res.end('No URL provided.');
      return;
    }

    const parsedUrl = url.parse(targetUrl);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.path,
      method: 'GET',
      headers: req.headers
    };

    // Send the request to the target URL
    const proxyReq = protocol.request(requestOptions, (proxyRes) => {
      res.statusCode = proxyRes.statusCode;
      res.setHeader('Content-Type', proxyRes.headers['content-type']);
      proxyRes.pipe(res); // Pipe the response back to the client
    });

    proxyReq.on('error', (err) => {
      res.statusCode = 500;
      res.end('Error while proxying request.');
    });

    proxyReq.end();
  } else {
    // Handle 404 errors
    res.statusCode = 404;
    res.end('Page not found.');
  }
});

server.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
