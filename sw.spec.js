const { test, expect } = require('@playwright/test');

test.describe('Service Worker Caching', () => {
  test('should cache and serve resources offline', async ({ page, context }) => {
    // 1. Navigate to the page to register and install the service worker
    await page.goto('http://localhost:8000');

    // 2. Wait for the service worker to become active
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      return registration.active.state;
    });

    // Ensure the page has loaded its resources by waiting for a key element
    // instead of 'networkidle' which can be flaky
    await page.waitForSelector('title');

    // 3. Set network offline
    await context.setOffline(true);

    // 4. Reload page and assert it still loads correctly
    const response = await page.reload();

    // Status should be 200 even when offline (served from cache)
    expect(response.status()).toBe(200);

    // Verify some content is still rendered
    const title = await page.title();
    expect(title).not.toBe('');

    // Wait for manifest or other resources if needed, but successful reload is good enough
    // We can also check that the cache contains what we expect
    const cacheKeys = await page.evaluate(async () => {
      const keys = await caches.keys();
      return keys;
    });

    expect(cacheKeys).toContain('tracker-cache-v2');
  });
});
