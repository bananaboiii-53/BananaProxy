const express = require('express');
const axios = require('axios'); // To make HTTP requests
const { URL } = require('url');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded bodies (for POST/PUT requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle incoming proxy requests for any HTTP method
app.all('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('No URL provided.');
  }

  try {
    // Parse the URL to make sure we handle paths and queries correctly
    const parsedUrl = new URL(targetUrl);
    const fullUrl = `${parsedUrl.origin}${parsedUrl.pathname}${parsedUrl.search}`;

    console.log(`Proxying ${req.method} request to: ${fullUrl}`);

    // Make the request to the target URL (handling GET, POST, etc.)
    const response = await axios({
      method: req.method, // Forward the HTTP method (GET, POST, etc.)
      url: fullUrl,
      data: req.body, // Forward the body for POST/PUT requests
      headers: req.headers, // Forward headers from the client
      responseType: 'stream' // Stream the response for large files or dynamic content
    });

    // Set the correct content-type and forward the response body
    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res); // Pipe the response back to the client

  } catch (error) {
    console.error('Error while proxying request:', error);
    res.status(500).send("Error while rendering the page. Please check the server logs.");
  }
});

// Start the server to listen for proxy requests
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
