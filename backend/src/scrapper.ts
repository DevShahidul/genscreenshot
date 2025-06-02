// src/scrapper.ts

import puppeteer, { Browser, KnownDevices, Page } from "puppeteer";
import { DeviceName } from "./devices";

// Define interfaces for better type safety
interface ActivePageEntry {
  page: Page;
  lastAccessed: number;
}

interface ScreenshotCacheEntry {
  buffer: Buffer;
  timestamp: number;
}

// Configuration for cache timeouts
const PAGE_CACHE_TIMEOUT_MS = 5 * 60 * 1000; // Close inactive pages after 5 minutes
const SCREENSHOT_CACHE_TIMEOUT_MS = 60 * 60 * 1000; // Clear screenshot from cache after 1 hour

/**
 * ScreenshotScrapper class encapsulates Puppeteer browser management,
 * page caching, and screenshot generation logic.
 */
export class ScreenshotScrapper {
  private browserInstance: Browser | null = null;
  private activePages: Map<string, ActivePageEntry> = new Map();
  private screenshotCache: Map<string, ScreenshotCacheEntry> = new Map();
  private cleanupIntervalId: NodeJS.Timeout | null = null;

  constructor() {
    console.log("ScreenshotScrapper instance created.");
  }

  /**
   * Initializes the global Puppeteer browser instance.
   * This should be called once when the application starts.
   */
  public async initializeBrowser(): Promise<void> {
    if (!this.browserInstance) {
      try {
        this.browserInstance = await puppeteer.launch({
          headless: "shell", // Use the new headless mode
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu",
          ],
        });
        console.log("Puppeteer browser launched successfully.");
      } catch (error) {
        console.error("Failed to launch Puppeteer browser:", error);
        // Re-throw to allow main.ts to handle process exit
        throw error;
      }
    }
  }

  /**
   * Starts a periodic cleanup process for inactive pages and old screenshots.
   */
  public startCleanupInterval(): void {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId); // Clear existing interval if any
    }
    this.cleanupIntervalId = setInterval(() => {
      const now = Date.now();

      // Clean up old pages from activePages cache
      for (const [url, { page, lastAccessed }] of this.activePages.entries()) {
        if (now - lastAccessed > PAGE_CACHE_TIMEOUT_MS) {
          console.log(`Closing inactive page for: ${url}`);
          page
            .close()
            .catch((err) =>
              console.error(`Error closing page for ${url}:`, err)
            );
          this.activePages.delete(url);
        }
      }

      // Clean up old screenshots from screenshotCache
      for (const [key, { timestamp }] of this.screenshotCache.entries()) {
        if (now - timestamp > SCREENSHOT_CACHE_TIMEOUT_MS) {
          console.log(`Clearing old screenshot from cache: ${key}`);
          this.screenshotCache.delete(key);
        }
      }
    }, 60 * 1000); // Run cleanup every 1 minute
    console.log("Cache cleanup interval started.");
  }

  /**
   * Stops the periodic cleanup process.
   */
  public stopCleanupInterval(): void {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
      this.cleanupIntervalId = null;
      console.log("Cache cleanup interval stopped.");
    }
  }

  /**
   * Scrolls to the bottom of the page incrementally to trigger lazy loading.
   * @param page The Puppeteer Page instance.
   * @param scrollDelay The delay in ms after each scroll to allow content to load.
   * @param scrollStep The maximum number of scroll steps (px).
   */
  private async scrollToBottom(
    page: Page,
    scrollDelay: number = 100,
    scrollStep: number = 250
  ): Promise<void> {
    // Use page.evaluate to run the scrollPageToBottom function in the browser context
    await page.evaluate(
      async (scrollStep, scrollDelay) => {
        function sleep(ms: number) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }

        let previousScrollY = -1;

        while (true) {
          window.scrollBy(0, scrollStep);
          await sleep(scrollDelay);

          const currentScrollY = window.scrollY;
          const pageHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
          );

          // Stop if we've reached or passed the bottom
          if (window.innerHeight + currentScrollY >= pageHeight) {
            // console.log("✅ Reached the bottom of the page.");
            break;
          }

          // Safety check: if scroll position isn't changing anymore
          if (currentScrollY === previousScrollY) {
            // console.warn("⚠️ Scroll position stuck. Stopping scroll.");
            break;
          }

          previousScrollY = currentScrollY;
        }
        // Pause before scroll top
        console.log("Sleeping for 1s for go back to top..");
        await sleep(1000);
        // Scroll to top smoothly
        console.log("Going back to top..");
        window.scrollTo({ top: 0 });
        console.log("I'm on top now.");
      },
      scrollStep,
      scrollDelay
    );

    // After attemting to scroll to the bottom, give it a moment for any final assets.
    try {
      await page.waitForNetworkIdle({ idleTime: 500, timeout: 5000 }); // Wait for 0 network requests for 500ms, max 5s
      console.log("Post-scroll network idle achived (or timed out).");
    } catch (err) {
      // This catch block handles the timeout waitForNetworkIdl, which is common
      // for pages with constant background activity, but we continue anyway.
      console.warn(
        "Post-scroll network idle wait timed out or failed, continuing anyway."
      );
    }
  }

  /**
   * Takes a screenshot of the given URL with specified dimensions.
   * Implements caching for both page instances and generated screenshots.
   * @param targetUrl The URL of the website to screenshot.
   * @param width The width of the viewport.
   * @param height The height of the viewport.
   * @param fullPage Whether to take a screenshot of the full scrollable page.
   * @returns A Promise that resolves with the screenshot buffer (image/png).
   * @throws Error if Puppeteer browser is not initialized or screenshot fails.
   */
  public async takeScreenshot(
    targetUrl: string,
    width: number = 1920,
    height: number = 1080,
    fullPage: boolean,
    selectedDevice: DeviceName | null
  ): Promise<Buffer> {
    // Create a unique cache key for the screenshot based on all relevant parameters
    const screenshotCacheKey = `${targetUrl}-${width}-${height}-${fullPage}-${selectedDevice}`;

    // --- Caching Logic (Screenshot Buffer) ---
    const cachedScreenshot = this.screenshotCache.get(screenshotCacheKey);
    if (
      cachedScreenshot &&
      Date.now() - cachedScreenshot.timestamp < SCREENSHOT_CACHE_TIMEOUT_MS
    ) {
      console.log(`Serving cached screenshot for: ${screenshotCacheKey}`);
      return cachedScreenshot.buffer;
    }

    let page: Page | undefined;
    let pageFromCache = false;

    try {
      if (!this.browserInstance) {
        throw new Error("Puppeteer browser not initialized.");
      }

      // --- Caching Logic (Page Instance) ---
      const cachedPageEntry = this.activePages.get(targetUrl);

      if (cachedPageEntry) {
        page = cachedPageEntry.page;
        pageFromCache = true;
        cachedPageEntry.lastAccessed = Date.now();
        console.log(`Using cached page for: ${targetUrl}`);
      } else {
        console.log(`Creating new page and navigating to: ${targetUrl}`);
        page = await this.browserInstance.newPage();
        await page.goto(targetUrl, {
          waitUntil: "networkidle0",
          timeout: 30000,
        });
        this.activePages.set(targetUrl, { page, lastAccessed: Date.now() });
      }

      // Check if select any device
      if (selectedDevice) {
        const device = KnownDevices[selectedDevice];
        if (device) {
          await page.emulate(device);
        } else {
          console.warn(
            `Device "${selectedDevice}" not found in Puppeteer.KnownDevices`
          );
        }
      }

      if (!selectedDevice && width && height) {
        // Always set the viewport, even for cached pages, as dimensions might change per request
        await page.setViewport({ width, height });
      }

      // Handle Lazy Loading for Full page Screenshots
      if (fullPage) {
        console.log(
          "Attempting to scroll to load lazy content for full page screenshot..."
        );
        await this.scrollToBottom(page);
      }

      // Take the screenshot
      const screenshotBuffer = await page.screenshot({
        type: "png",
        fullPage: fullPage,
      });

      // Cache the newly generated screenshot
      // Explicitly cast the Uint8Array to Buffer to satisfy TypeScript
      this.screenshotCache.set(screenshotCacheKey, {
        buffer: screenshotBuffer as Buffer,
        timestamp: Date.now(),
      });
      console.log(`Screenshot generated and cached for: ${screenshotCacheKey}`);

      return screenshotBuffer as Buffer;
    } catch (error: any) {
      console.error(`Error in takeScreenshot for ${targetUrl}:`, error);

      // If an error occurred with a page that was taken from the cache,
      // it might be in a bad state. Close it and remove it from the cache.
      if (pageFromCache && page) {
        console.log(
          `Error with cached page for ${targetUrl}, closing and removing from cache.`
        );
        try {
          await page.close();
        } catch (closeError) {
          console.error(
            `Error trying to close page after failed screenshot:`,
            closeError
          );
        } finally {
          this.activePages.delete(targetUrl);
        }
      }
      // Re-throw the error to be handled by the API endpoint
      throw error;
    }
  }

  /**
   * Closes the Puppeteer browser instance and all active pages.
   * This should be called when the application is shutting down.
   */
  public async closeBrowser(): Promise<void> {
    this.stopCleanupInterval(); // Stop cleanup before closing browser
    for (const [url, { page }] of this.activePages.entries()) {
      console.log(`Closing page for: ${url} during shutdown.`);
      await page
        .close()
        .catch((err) =>
          console.error(`Error closing page ${url} on shutdown:`, err)
        );
    }
    this.activePages.clear();
    this.screenshotCache.clear();

    if (this.browserInstance) {
      console.log("Closing Puppeteer browser.");
      await this.browserInstance.close();
      this.browserInstance = null;
    }
  }
}
