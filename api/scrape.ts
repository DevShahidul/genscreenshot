import puppeteer from "puppeteer";

const Scrapping = async (url: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const screenshot = await page.screenshot();
  await browser.close();

  return screenshot;
};

export default Scrapping;
