import puppeteer, { Browser, KnownDevices } from "puppeteer";

interface ScrappingProps {
  url: string;
  selectedDevice: string | null;
  width: number;
  height: number;
  fullPage: boolean;
}

let browser: Browser | null = null;

const Scrapping = async ({
  url,
  width = 1920,
  height = 1080,
  selectedDevice = null,
  fullPage = false,
}: ScrappingProps) => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--start-maximized"],
    });
  }
  const page = await browser.newPage();

  if (selectedDevice) {
    const device = KnownDevices[selectedDevice as keyof typeof KnownDevices];
    await page.emulate(device);
  }

  if (!selectedDevice && width && height) {
    await page.setViewport({
      width,
      height,
    });
  }

  await page.goto(url, { waitUntil: "networkidle2" });
  const screenshot = await page.screenshot({ fullPage });
  await page.close();

  return screenshot;
};

export default Scrapping;
