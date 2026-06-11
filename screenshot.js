const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  // Set viewport to a mobile size
  await page.setViewport({ width: 375, height: 812 });

  // Navigate to local server
  await page.goto('http://localhost:8000/index.html');

  // Add some data so the dashboard shows
  await page.evaluate(() => {
    projectData = { lighting: { "model1": { quantity: 10, unit: "ea", stages: {} } }, it: {}, automation: {}, av: {}, bms: {} };
    saveData();
    renderUI();
  });

  // Take mobile screenshot
  await page.screenshot({ path: 'mobile_dashboard.png', fullPage: true });

  // Set viewport to desktop size
  await page.setViewport({ width: 1280, height: 800 });
  await page.screenshot({ path: 'desktop_dashboard.png', fullPage: true });

  await browser.close();
})();
