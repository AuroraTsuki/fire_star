const CACHE_NAME = 'fire-star-cache-v1';

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
    // Minimal requirement for PWA: fetch listener
    // We can add offline caching strategy here later
    // For now, we just pass through
});
