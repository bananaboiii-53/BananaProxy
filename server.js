const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve the web GUI
app.use(express.static(path.join(__dirname, "public")));

// Use Puppeteer to render the page and serve it
app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send("Error: No URL provided.");
  }

  try {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set a user-agent to mimic a real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    );

    // Open the requested URL
    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded", // Wait until the page is loaded
    });

    // Get the HTML content of the page
    const content = await page.content();

    // Send the rendered HTML to the client
    res.send(content);

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error("Error while fetching page:", error);
    res.status(500).send("Error while rendering the page.");
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});
