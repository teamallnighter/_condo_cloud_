const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs/promises');
const config = require('../config');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || '/tmp/screenshots';
fs.mkdir(SCREENSHOT_DIR, { recursive: true }).catch(console.error);

async function takeScreenshot(url, filename = `screenshot-${Date.now()}.png`, fullPage = true) {
  let browser;

  const response = await axios.post(
      `${BACKEND_URL}/api/auth/signin/local`,
      { email: config.admin_email, password: config.admin_pass },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
  );

  const token = response.data;

  const outputPath = path.join(SCREENSHOT_DIR, filename);

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        'window-size=1920,1080'
      ]
    });
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });

    if (token) {
      await page.setRequestInterception(true);

      page.on('request', interceptedRequest => {
        if (interceptedRequest.isInterceptResolutionHandled()) {
          return;
        }

        const headers = interceptedRequest.headers();
        if (!headers['authorization'] && !headers['Authorization']) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        interceptedRequest.continue({ headers });
      });

      page.on('requestfailed', request => {
        console.error(`[ScreenshotService]: Request failed: ${request.url()} - ${request.failure().errorText}`);
      });
    }

    await page.goto(url, { waitUntil: 'load', timeout: 60000 });

    await page.screenshot({
      path: outputPath,
      fullPage: true,
    });

    console.log(`[ScreenshotService]: Screenshot saved to ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`[ScreenshotService]: Error taking screenshot: ${error.message}`);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { takeScreenshot };