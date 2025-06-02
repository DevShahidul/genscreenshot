import cors from "cors";
import express, { Request, RequestHandler, Response } from "express";
import { ScreenshotScrapper } from "./scrapper"; // Import the scrapper class

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Create an instance of the ScreenshotScrapper
const scrapper = new ScreenshotScrapper();

// Middleware to fix cors issue
app.use(cors());

// Middleware to parse URL-encoded bodies (for query parameters)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * @route GET /
 * @description Landing the API route first page and return Welcome to Screenshot API Tool
 * @returns {json}
 */

app.get("/", (req, res) => {
  res.send("Welcome to Screenshot API Tool!").json;
});

/**
 * @route GET /screenshot
 * @description Takes a screenshot of a given URL and returns it as a PNG image.
 * @queryparam {string} url - The URL of the website to screenshot.
 * @queryparam {number} [width=1280] - The width of the viewport for the screenshot.
 * @queryparam {number} [height=800] - The height of the viewport for the screenshot.
 * @queryparam {boolean} [fullPage=false] - Whether to take a screenshot of the full scrollable page.
 * @returns {image/png} The screenshot image.
 * @returns {json} Error message if URL is missing or invalid.
 */
app.get("/screenshot", (async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  const width = parseInt(req.query.width as string) || 1280;
  const height = parseInt(req.query.height as string) || 800;
  const fullPage = req.query.fullPage === "true";

  if (!targetUrl) {
    return res.status(400).json({ error: "URL query parameter is required." });
  }

  try {
    // Call the takeScreenshot method from the scrapper instance
    const screenshotBuffer = await scrapper.takeScreenshot(
      targetUrl,
      width,
      height,
      fullPage
    );

    res.setHeader("Content-Type", "image/png");
    res.send(screenshotBuffer);
  } catch (error: any) {
    // Centralized error handling for the API endpoint
    console.error(`API Error for ${targetUrl}:`, error);

    if (error.name === "TimeoutError") {
      res.status(504).json({
        error: `Navigation timed out for ${targetUrl}. It might be a slow or unresponsive website.`,
      });
    } else if (
      error.message.includes("ERR_NAME_NOT_RESOLVED") ||
      error.message.includes("net::ERR_")
    ) {
      res.status(400).json({
        error: `Invalid or unreachable URL: ${targetUrl}. Please check the URL.`,
      });
    } else {
      res.status(500).json({
        error: "Failed to take screenshot due to an internal server error.",
      });
    }
  }
}) as RequestHandler);

// --- Server Initialization ---
// Initialize the Puppeteer browser and start cleanup interval before starting the Express server
scrapper
  .initializeBrowser()
  .then(() => {
    scrapper.startCleanupInterval(); // Start the cleanup interval after browser is launched
    app.listen(PORT, () => {
      console.log(
        `Screenshot API service listening at http://localhost:${PORT}`
      );
      console.log(
        `Example usage: http://localhost:${PORT}/screenshot?url=https://www.google.com`
      );
      console.log(
        `Example full page: http://localhost:${PORT}/screenshot?url=https://www.example.com&fullPage=true`
      );
    });
  })
  .catch((err) => {
    console.error("Server failed to start due to browser launch error:", err);
    process.exit(1); // Exit if browser cannot be launched
  });

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing browser and exiting.");
  await scrapper.closeBrowser();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing browser and exiting.");
  await scrapper.closeBrowser();
  process.exit(0);
});
