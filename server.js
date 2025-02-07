 }

  try {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch({ headless: true });
    // Launch Puppeteer browser with debugging enabled
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Set a user-agent to mimic a real browser
@@ -62,7 +62,7 @@ app.get("/proxy", async (req, res) => {
    await browser.close();
  } catch (error) {
    console.error("Error while fetching page:", error);
    res.status(500).send("Error while rendering the page.");
    res.status(500).send("Error while rendering the page. Please check the server logs.");
  }
});
