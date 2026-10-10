const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const vm = require('vm');

test('Service Worker', async (t) => {
    let listeners = {};
    let mockCache = {};
    let addedToCache = [];
    let fetchCalls = [];

    const mockCaches = {
        open: async (cacheName) => {
            return {
                addAll: async (urls) => {
                    addedToCache.push(...urls);
                }
            };
        },
        match: async (request) => {
            return mockCache[request.url] || null;
        }
    };

    const mockFetch = async (request) => {
        fetchCalls.push(request.url);
        return { status: 200, body: 'network response' };
    };

    const context = vm.createContext({
        self: {
            addEventListener: (event, callback) => {
                listeners[event] = callback;
            }
        },
        caches: mockCaches,
        fetch: mockFetch
    });

    const code = fs.readFileSync('sw.js', 'utf8');
    vm.runInContext(code, context);

    await t.test('Registers install and fetch listeners', () => {
        assert.ok(listeners.install);
        assert.ok(listeners.fetch);
    });

    await t.test('install event adds URLs to cache', async () => {
        let waitUntilPromise;
        const event = {
            waitUntil: (promise) => {
                waitUntilPromise = promise;
            }
        };

        listeners.install(event);
        await waitUntilPromise;

        assert.deepStrictEqual(addedToCache, [
            '/',
            '/index.html',
            '/manifest.json',
            'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js'
        ]);
    });

    await t.test('fetch event serves from cache if found', async () => {
        let respondWithPromise;
        const event = {
            request: { url: '/index.html' },
            respondWith: (promise) => {
                respondWithPromise = promise;
            }
        };

        mockCache['/index.html'] = { status: 200, body: 'cached content' };

        listeners.fetch(event);
        const response = await respondWithPromise;

        assert.strictEqual(response.body, 'cached content');
        assert.strictEqual(fetchCalls.length, 0); // Network should not be called
    });

    await t.test('fetch event falls back to network if not in cache', async () => {
        fetchCalls = []; // reset
        let respondWithPromise;
        const event = {
            request: { url: '/api/data' },
            respondWith: (promise) => {
                respondWithPromise = promise;
            }
        };

        listeners.fetch(event);
        const response = await respondWithPromise;

        assert.strictEqual(response.body, 'network response');
        assert.deepStrictEqual(fetchCalls, ['/api/data']);
    });
});
